/* Property-legality audit (v2): extract real props from node_modules .d.ts
 * (interface Props { ... }) and verify every attribute bound to a library
 * component in src/ templates is a declared prop. Events/slots/directives/
 * HTML fallthrough attrs are excluded. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PKG = path.join(ROOT, 'node_modules', 'fuxsto-design', 'dist');
const INDEX = path.join(PKG, 'index.d.ts');

function kebab(s) { return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(); }
function camel(s) { return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()); }

// ---- map export name -> .vue file path via index.d.ts ----
const indexSrc = fs.readFileSync(INDEX, 'utf8');
const exportRe = /export\s+\{[^}]*?default as (\w+)[^}]*?\}\s+from\s+'(\.\/[^']+\.vue)'/g;
const fileForName = {};
let em;
while ((em = exportRe.exec(indexSrc)) !== null) {
  fileForName[em[1]] = em[2].replace(/^\.\//, '');
}

// ---- extract Props from each component .d.ts ----
const propMap = {}; // name -> Set(props)
const files = fs.readdirSync(PKG, { recursive: true });
for (const f of files) {
  if (!f.endsWith('.vue.d.ts')) continue;
  const full = path.join(PKG, f);
  const txt = fs.readFileSync(full, 'utf8');
  const start = txt.search(/interface\s+Props\s*\{/);
  if (start < 0) continue;
  // balance braces to handle nested types (e.g. ellipsis?: { rows?: number })
  let i = txt.indexOf('{', start);
  let depth = 0, end = -1;
  for (let k = i; k < txt.length; k++) {
    if (txt[k] === '{') depth++;
    else if (txt[k] === '}') { depth--; if (depth === 0) { end = k; break; } }
  }
  if (end < 0) continue;
  const body = txt.slice(i + 1, end);
  const props = new Set();
  const pm = /(\w+)\s*\??\s*:/g;
  let p;
  while ((p = pm.exec(body)) !== null) props.add(p[1]);
  const base = path.basename(f, '.vue.d.ts');
  propMap[base] = props;
}
// aliases: name -> file (Tag->Chip.vue etc.)
const nameToProps = {};
for (const [name, rel] of Object.entries(fileForName)) {
  const base = path.basename(rel, '.vue');
  if (propMap[base]) nameToProps[name] = propMap[base];
}

const libNames = new Set(Object.keys(nameToProps));

// HTML fallthrough attrs
const HTML_ATTRS = new Set([
  'class','style','id','key','ref','is','title','lang','dir','hidden','tabindex',
  'role','aria','data','slot','draggable','spellcheck','contenteditable','translate',
  'accesskey','autocapitalize','inputmode','type','name','value','placeholder',
  'disabled','readonly','required','autofocus','autocomplete','maxlength','minlength',
  'pattern','multiple','accept','step','min','max','href','target','rel','src','alt',
  'width','height','loading','crossorigin','referrerpolicy','download','label','for',
  'checked','selected','open','controls','autoplay','muted','loop','poster','preload',
  'playsinline','default','form','novalidate','cols','rows','wrap','start','reversed',
  'cite','datetime','colspan','rowspan','scope','headers','abbr','axis','summary',
  'border','cellpadding','cellspacing','valign','nowrap','bgcolor','align','charset',
  'media','sizes','srcset','sandbox','allow','allowfullscreen','frameborder','scrolling',
  'ping','shape','coords','usemap','ismap','longdesc','autoCapitalize',
]);

// ---- walk src .vue ----
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.name.endsWith('.vue')) acc.push(full);
  }
  return acc;
}
const vueFiles = walk(SRC);

const unknown = [];
const checked = [];

for (const file of vueFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const tplMatch = text.match(/<template>([\s\S]*?)<\/template>/);
  if (!tplMatch) continue;
  const tpl = tplMatch[1];
  // quote-aware scan: a `>` inside an attribute value (e.g. arrow fn `=>`) must
  // NOT terminate the opening tag.
  let i = 0;
  while (i < tpl.length) {
    const lt = tpl.indexOf('<', i);
    if (lt < 0) break;
    const after = tpl.slice(lt + 1);
    const nameM = after.match(/^([A-Z][A-Za-z0-9]*)/);
    if (!nameM) { i = lt + 1; continue; }
    const tagName = nameM[1];
    const pascal = nameToProps[tagName] ? tagName : (nameToProps[camel(tagName)] ? camel(tagName) : null);
    if (!pascal) { i = lt + 1 + tagName.length; continue; }
    // walk to end of opening tag, respecting quotes
    let j = lt + 1 + tagName.length;
    let inStr = null;
    let end = -1;
    while (j < tpl.length) {
      const c = tpl[j];
      if (inStr) {
        if (c === inStr && tpl[j - 1] !== '\\') inStr = null;
      } else if (c === '"' || c === "'" || c === '`') {
        inStr = c;
      } else if (c === '>') {
        end = j; break;
      } else if (c === '/' && tpl[j + 1] === '>') {
        end = j + 1; break;
      }
      j++;
    }
    if (end < 0) { i = j; continue; }
    const attrStr = tpl.slice(lt + 1 + tagName.length, end);
    i = end + 1;
    // tokenize attributes: name(="value"|='value'|=value)?
    const attrTok = /([@#]?[\w:.-]+)(?:\s*=\s*("(?:[^"]*)"|'(?:[^']*)'|[^>\s]+))?/g;
    let am;
    while ((am = attrTok.exec(attrStr)) !== null) {
      let full = am[1];
      if (full.startsWith('@') || full.startsWith('#')) continue;
      if (full.startsWith('v-')) continue;
      let name = full;
      if (name.startsWith(':')) name = name.slice(1);
      if (name.startsWith('v-model')) {
        const mm = name.match(/^v-model(?::(\w+))?$/);
        if (mm) { if (mm[1]) name = mm[1]; else continue; }
      }
      if (!/^[a-zA-Z]/.test(name)) continue; // skip numeric/weird tokens
      const c = camel(name);
      if (HTML_ATTRS.has(name) || HTML_ATTRS.has(c)) continue;
      const props = nameToProps[pascal];
      if (props.has(c)) checked.push(`${pascal}.${c}`);
      else unknown.push({ file: path.relative(ROOT, file), comp: pascal, attr: name, camel: c });
    }
  }
}

const seen = new Set();
const uniq = [];
for (const u of unknown) {
  const k = `${u.file}|${u.comp}|${u.attr}`;
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(u);
}

console.log('=== PROPERTY-LEGALITY AUDIT v2 (node_modules baseline) ===');
console.log(`Library components mapped: ${libNames.size}`);
console.log(`Valid props matched: ${checked.length}`);
console.log(`Suspected unknown attrs: ${uniq.length}`);
if (uniq.length) {
  console.log('\n-- REVIEW (attr not in component Props) --');
  for (const u of uniq) console.log(`${u.file}  <${u.comp} ${u.attr}>  (camel: ${u.camel})`);
}
process.exit(0);
