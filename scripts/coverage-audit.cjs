/* Coverage audit: every fuxsto-design runtime export must appear in src/. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

// Tokens to search for. Component/function export names from index.d.ts.
// Aliases (Tag, TagGroup, DialogComponent) are tracked but flagged as alias-only.
const tokens = [
  'cn',
  'Button', 'ButtonGroup', 'Card', 'Chip', 'Tag', 'ChipGroup', 'TagGroup',
  'Badge', 'Avatar', 'AvatarGroup', 'Divider', 'Tree', 'Transfer',
  'ScrollArea', 'VirtualList', 'Text', 'Title', 'Paragraph', 'Link',
  'Tabs', 'TabViews', 'Menu', 'ContextMenu', 'Breadcrumb', 'BreadcrumbItem',
  'Header', 'Anchor', 'Form', 'FormItem', 'Input', 'PinInput', 'Switch',
  'Radio', 'RadioGroup', 'Checkbox', 'CheckboxGroup', 'Select', 'Table',
  'Pagination', 'List', 'ListItem', 'Collapse', 'CollapseItem', 'Steps',
  'Segmented', 'Progress', 'Statistic', 'Timeline', 'TimelineItem', 'Image',
  'Carousel', 'Countdown', 'ContributionChart', 'Drawer', 'Tooltip',
  'Popconfirm', 'Empty', 'Loading', 'Skeleton', 'Result', 'BackTop', 'Alert',
  'Watermark', 'StreamingText', 'Tour', 'AutoComplete', 'Textarea',
  'InputNumber', 'Rate', 'Slider', 'Upload', 'DatePicker', 'TimePicker',
  'Cascader', 'ColorPicker',
  'Message', 'Notification', 'Dialog', 'startTour', 'resetTour',
  'removeMessage', 'removeNotification', 'closeAllNotifications',
];

// Symbols that represent the same underlying component (alias mapping).
const aliases = { Tag: 'Chip', TagGroup: 'ChipGroup', DialogComponent: 'Dialog' };

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(vue|ts|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const srcFiles = walk(SRC);
const srcText = srcFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

const results = [];
for (const t of tokens) {
  const re = new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
  const matches = srcText.match(re) || [];
  results.push({ token: t, count: matches.length });
}

const missing = results.filter((r) => r.count === 0).map((r) => r.token);
const used = results.filter((r) => r.count > 0).map((r) => r.token);

console.log('=== fuxsto-design COVERAGE AUDIT ===');
console.log(`Scanned ${srcFiles.length} source files under src/`);
console.log(`Total tracked exports: ${tokens.length}`);
console.log(`Used: ${used.length}`);
console.log(`Missing: ${missing.length}`);
if (missing.length) {
  console.log('\n-- MISSING (not referenced anywhere in src/) --');
  console.log(missing.join('\n'));
}
console.log('\n-- Per-token counts --');
for (const r of results) console.log(`${r.token.padEnd(20)} ${r.count}`);

process.exit(missing.length ? 1 : 0);
