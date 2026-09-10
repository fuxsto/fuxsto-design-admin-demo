#!/usr/bin/env node
/* eslint-disable */
/**
 * FALLTHROUGH AUDIT  ——  属性透传合法性检查
 * ---------------------------------------------------------------------------
 * 背景（第一性原则）：
 *   Vue 3 中，只有当组件「渲染出单一元素根节点」时，非 prop 属性（class / style /
 *   任意自定义 attr）才会被自动继承（attribute fallthrough）。若组件根节点是
 *   Fragment（多根）、文本节点或 Teleport，Vue 无法自动继承，于是：
 *     1) 开发环境打印 [Vue warn]: Extraneous non-props attributes ... renders fragment
 *     2) 该属性被「静默丢弃」—— 最典型的后果是 class="h-full w-full" 失效，
 *        组件塌缩成内容尺寸，视觉上表现为「组件里没东西 / 显示异常」。
 *
 * 本脚本做两件事：
 *   A. 从 node_modules/fuxsto-design 的编译产物中，静态识别「Fragment 根组件」；
 *   B. 扫描 src\**\*.vue 模板，报告所有「把非 prop 属性传给 Fragment 根组件」的用法。
 *
 * 判定规则（对 Fragment 根组件）：
 *   - class / style（含 :class / :style）        => 违规（必然丢失 + 警告）
 *   - 任意不在该组件 Props 声明中的属性          => 违规（同样无法透传）
 *   - 组件已声明的 prop、Vue 内建指令 / 事件 / 插槽 => 合法
 * ---------------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const LIB = path.join(ROOT, "node_modules", "fuxsto-design", "dist", "components");
const SRC = path.join(ROOT, "src");

/* ---------------------------------------------------------------- helpers */

function walk(dir, pred, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, acc);
    else if (pred(p)) acc.push(p);
  }
  return acc;
}

/** 已知 Vue 内建指令 / 特殊属性（不参与 fallthrough 判定） */
const BUILTIN = new Set([
  "key", "ref", "is", "slot", "class", "style",
  "v-if", "v-else", "v-else-if", "v-for", "v-show", "v-model",
  "v-html", "v-text", "v-once", "v-memo", "v-pre", "v-cloak",
  "v-bind", "v-on", "v-slot", "v-is",
]);

const CANNOT_FALLTHROUGH = new Set(["class", "style"]);

/* --------------------------------------------- A. 识别 Fragment 根组件 */
function discoverFragmentRootComponents() {
  const langFiles = walk(LIB, (p) => p.endsWith("_lang.js"));
  const result = new Map(); // ComponentName -> { js, dtsAbs, props }
  for (const js of langFiles) {
    const code = fs.readFileSync(js, "utf8");
    // 根返回语句：return openBlock(), createElementBlock(Fragment, ...
    if (!/return openBlock\(\), createElementBlock\(Fragment/.test(code)) continue;
    const name = path
      .basename(js)
      .replace(/\.vue_vue_type_script_setup_true_lang\.js$/, "");
    const dtsAbs = js.replace(
      /\.vue_vue_type_script_setup_true_lang\.js$/,
      ".vue.d.ts"
    );
    result.set(name, {
      js: path.relative(ROOT, js).replace(/\\/g, "/"),
      dtsAbs,
      props: readProps(dtsAbs),
    });
  }
  return result;
}

function readProps(dtsAbs) {
  if (!dtsAbs || !fs.existsSync(dtsAbs)) return null;
  const t = fs.readFileSync(dtsAbs, "utf8");
  const m = t.match(/interface\s+Props\s*\{([\s\S]*?)\n\}/);
  if (!m) return null;
  const set = new Set();
  const re = /^\s*([A-Za-z_$][\w$]*)\s*\??\s*:/gm;
  let x;
  while ((x = re.exec(m[1]))) set.add(x[1]);
  return set;
}

/* ----------------------------------------------------- B. 模板解析工具 */

/** 找到所有 PascalCase 组件标签，返回 { name, attrsRaw, line } */
function findComponentTags(src) {
  const out = [];
  const re = /<\s*([A-Z][A-Za-z0-9_]*)\b/g;
  let m;
  while ((m = re.exec(src))) {
    const name = m[1];
    let i = re.lastIndex;
    let quote = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) {
        if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'") {
        quote = c;
        continue;
      }
      if (c === ">") break;
    }
    const attrsRaw = src.slice(re.lastIndex, i);
    const line = src.slice(0, m.index).split("\n").length;
    out.push({ name, attrsRaw, line });
    re.lastIndex = i + 1;
  }
  return out;
}

/** 把属性串解析为 [{ name, value }]（引号感知） */
function parseAttrs(raw) {
  const out = [];
  let i = 0;
  while (i < raw.length) {
    while (i < raw.length && /\s/.test(raw[i])) i++;
    if (i >= raw.length) break;
    let name = "";
    while (i < raw.length && !/[\s=]/.test(raw[i])) name += raw[i++];
    while (i < raw.length && /\s/.test(raw[i])) i++;
    let value = null;
    if (raw[i] === "=") {
      i++;
      while (i < raw.length && /\s/.test(raw[i])) i++;
      const q = raw[i];
      if (q === '"' || q === "'") {
        i++;
        let v = "";
        while (i < raw.length && raw[i] !== q) v += raw[i++];
        i++;
        value = v;
      } else {
        let v = "";
        while (i < raw.length && !/\s/.test(raw[i])) v += raw[i++];
        value = v;
      }
    }
    if (name && name !== "/") out.push({ name, value });
  }
  return out;
}

/** kebab-case -> camelCase（Vue 模板属性名与 props 声明名的映射规则） */
function toCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** 归类属性并抽出「被绑定的键名」 */
function classify(name) {
  if (name.startsWith(":")) return { kind: "bind", key: name.slice(1) };
  if (name.startsWith("v-bind:")) return { kind: "bind", key: name.slice(7) };
  if (name.startsWith("@") || name.startsWith("v-on:")) return { kind: "event" };
  if (name.startsWith("#") || name.startsWith("v-slot")) return { kind: "slot" };
  if (name.startsWith("v-")) return { kind: "directive", key: name };
  return { kind: "plain", key: name };
}

/* --------------------------------------------------------------- 主流程 */

const frag = discoverFragmentRootComponents();

if (frag.size === 0) {
  console.error("!! 未能识别任何 Fragment 根组件，请检查 node_modules 结构。");
  process.exit(2);
}

const violations = [];
const vueFiles = walk(SRC, (p) => p.endsWith(".vue"));

for (const file of vueFiles) {
  const src = fs.readFileSync(file, "utf8");
  for (const tag of findComponentTags(src)) {
    const info = frag.get(tag.name);
    if (!info) continue;
    const props = info.props || new Set();
    for (const attr of parseAttrs(tag.attrsRaw)) {
      const { kind, key } = classify(attr.name);

      if (kind === "event" || kind === "slot") continue;
      if (kind === "directive") {
        const base = key.split(":")[0];
        if (BUILTIN.has(base) || base.startsWith("v-model")) continue;
        violations.push({
          file, line: tag.line, comp: tag.name, attr: attr.name,
          reason: `未知指令 "${attr.name}"（Fragment 根组件无插槽式透传）`,
        });
        continue;
      }
      // plain / bind
      const propKey = key.split(".")[0].split("[")[0];
      if (CANNOT_FALLTHROUGH.has(propKey)) {
        violations.push({
          file, line: tag.line, comp: tag.name, attr: attr.name,
          reason: `"${propKey}" 不是 prop，且该组件根为 Fragment —— 属性会被静默丢弃并触发 Vue warn`,
        });
        continue;
      }
      if (props.has(propKey) || props.has(toCamel(propKey))) continue;
      if (BUILTIN.has(propKey)) continue;
      violations.push({
        file, line: tag.line, comp: tag.name, attr: attr.name,
        reason: `未声明的属性 "${propKey}"（该组件根为 Fragment，无法透传）`,
      });
    }
  }
}

/* --------------------------------------------------------------- 输出 */

console.log("=== FALLTHROUGH AUDIT (Fragment-root attribute inheritance) ===");
console.log(`Fragment 根组件 (${frag.size}):`);
for (const [name, info] of frag) {
  console.log(`  - ${name.padEnd(14)} ${info.js}`);
}
console.log("");
console.log(`扫描模板文件: ${vueFiles.length}`);
console.log(`违规用法: ${violations.length}`);

if (violations.length) {
  console.log("");
  for (const v of violations) {
    console.log(
      `  ✗ ${path.relative(ROOT, v.file).replace(/\\/g, "/")}:${v.line}  <${v.comp} ${v.attr}>`
    );
    console.log(`      → ${v.reason}`);
  }
  process.exit(1);
}

console.log("");
console.log("✓ 无属性透传违规：所有 Fragment 根组件均只接收已声明的 prop / 内建指令。");
process.exit(0);
