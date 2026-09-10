/**
 * 本地生成的占位素材（SVG data URI）。
 *
 * 为什么不用 picsum / dicebear 等外链：
 * 模板在内网、离线或外链被墙时会整块白掉，看起来像「内容没渲染」。
 * 这里全部改为本地计算生成，任何环境下都能稳定显示。
 *
 * 关键修复（对比上一版）：
 * - 不再使用 hsl(H S% L%) 这种「空格分隔」写法。SVG 被当作 <img> 渲染时，
 *   部分渲染引擎不认这种现代语法，导致整张图是空白——表现为「Image 里面没有图片」。
 * - 统一改用 rgb(r, g, b)，并给 <svg> 显式写出 width / height，
 *   保证任何浏览器都能稳定画出一张有内容的图。
 */

/** 简单字符串哈希，保证同一个 seed 永远得到同一个结果 */
function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** 从 seed 取一个稳定的色相（0-359） */
function hue(seed: string): number {
  return hash(seed) % 360
}

/** HSL -> RGB（经典算法）。返回 "r, g, b" 字符串，直接给 rgb(r, g, b) 用。 */
function rgbString(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * color)
  }
  return `${f(0)}, ${f(8)}, ${f(4)}`
}

function encodeSvg(svg: string): string {
  // encodeURIComponent 会把 # 转成 %23，避免 data URI 被当成 URL 片段；
  // 兼容性好，不会破坏 data URI 结构。
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim())}`
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      default:
        return '&quot;'
    }
  })
}

/**
 * 头像：取名字首字（中文取首字，英文取首字母大写），配稳定底色。
 * Avatar 组件在图片加载失败时会回退到 name 缩写，这里再给一张一定能加载的图。
 */
export function avatarDataUri(name: string): string {
  const clean = (name || '?').trim()
  const initial = /[a-zA-Z]/.test(clean[0] ?? '')
    ? (clean[0] ?? '?').toUpperCase()
    : (clean[0] ?? '?')
  const h = hue(clean)
  const bg = `rgb(${rgbString(h, 24, 22)})`
  const fg = `rgb(${rgbString(h, 60, 82)})`
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="14" fill="${bg}"/>
      <text x="48" y="49" text-anchor="middle" dominant-baseline="central"
            font-family="-apple-system,Segoe UI,PingFang SC,Microsoft YaHei,sans-serif"
            font-size="42" font-weight="700" fill="${fg}">${escapeXml(initial)}</text>
    </svg>
  `)
}

/**
 * 封面图：稳定渐变 + 几何装饰，作为真实可渲染的「图片」塞进 Image / Carousel。
 * 用 rgb() 颜色 + 显式宽高，确保任何浏览器都能画出内容。
 */
export function coverDataUri(seed: string, w = 960, h = 360, label = ''): string {
  const a = hue(seed)
  const b = (a + 48) % 360
  const top = rgbString(a, 32, 30)
  const bottom = rgbString(b, 36, 46)
  const deco1 = rgbString(a, 50, 82)
  const deco2 = rgbString(b, 44, 70)
  const labelColor = rgbString(a, 50, 94)
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgb(${top})"/>
          <stop offset="100%" stop-color="rgb(${bottom})"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <circle cx="${Math.round(w * 0.8)}" cy="${Math.round(h * 0.28)}" r="${Math.round(h * 0.34)}" fill="rgb(${deco1})" opacity="0.18"/>
      <circle cx="${Math.round(w * 0.16)}" cy="${Math.round(h * 0.84)}" r="${Math.round(h * 0.26)}" fill="rgb(${deco2})" opacity="0.16"/>
      <path d="M0 ${h} L ${Math.round(w * 0.32)} ${Math.round(h * 0.62)} L ${Math.round(w * 0.6)} ${h} Z" fill="rgb(${deco1})" opacity="0.14"/>
      <path d="M${Math.round(w * 0.4)} ${h} L ${Math.round(w * 0.72)} ${Math.round(h * 0.5)} L ${w} ${h} Z" fill="rgb(${deco2})" opacity="0.12"/>
      ${
        label
          ? `<text x="${Math.round(w / 2)}" y="${Math.round(h / 2)}" text-anchor="middle" dominant-baseline="central"
            font-family="-apple-system,Segoe UI,PingFang SC,Microsoft YaHei,sans-serif"
            font-size="${Math.round(h * 0.12)}" font-weight="700"
            fill="rgb(${labelColor})">${escapeXml(label)}</text>`
          : ''
      }
    </svg>
  `)
}
