import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

/**
 * CMS page bodies come from the admin's rich text editor as HTML, or as
 * Markdown for pages saved before it. Either way the result is sanitized:
 * the admin's HTML mode accepts anything, so scripts, event handlers,
 * javascript: links and unknown embeds are stripped here.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img", "figure", "figcaption", "picture", "source", "video", "iframe", "u", "s", "del", "span",
  ],
  allowedAttributes: {
    "*": ["class", "id", "style", "title", "lang", "dir"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
    source: ["src", "srcset", "type", "media"],
    video: ["src", "poster", "controls", "autoplay", "muted", "loop", "playsinline", "width", "height"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "loading", "referrerpolicy"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    ol: ["start", "type"],
  },
  // Embeds only from video hosts.
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  // Inline styles limited to layout-safe properties.
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      "font-weight": [/^(normal|bold|[1-9]00)$/],
      "font-style": [/^(normal|italic)$/],
      "text-decoration": [/^[a-z\s-]+$/i],
      width: [/^\d+(\.\d+)?(px|%|em|rem)$/],
      "max-width": [/^\d+(\.\d+)?(px|%|em|rem)$/],
      margin: [/^[\d\s.a-z%-]+$/i],
      padding: [/^[\d\s.a-z%-]+$/i],
    },
  },
  // Drop embeds whose source was removed above.
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  transformTags: {
    // New-tab links can't reach back into this window.
    a: (tagName, attribs) =>
      attribs.target === "_blank"
        ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
        : { tagName, attribs },
  },
}

const isHtml = (body: string) => /^\s*</.test(body)

export async function renderRichText(body: string): Promise<string> {
  // Cached: sanitize-html calls Math.random(), which prerendering rejects
  // outside a cache scope. The output depends only on the body anyway.
  "use cache"
  if (!body.trim()) return ""
  const html = isHtml(body) ? body : (marked.parse(body, { async: false }) as string)
  return sanitizeHtml(html, OPTIONS)
}
