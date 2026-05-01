# shafiqulai.github.io — Claude Context

Personal engineering blog by **Md Shafiqul Islam** (AI Engineer / LLM Specialist / Python Developer).
Topics: LLMs, RAG, AI Agents, LangChain, Docker, Hugging Face, OpenAI, Streamlit, Gradio.
7 blog posts published (`blog_1.html` through `blog_7.html`), hosted on GitHub Pages.

**Before writing any blog HTML → read `.claude/instructions.md`.**
**To create a new blog post → read `.claude/new-post-guide.md`.**

## Tech Stack

| Layer | Technology | Files |
|-------|-----------|-------|
| CSS framework | Bootstrap 5 | `css/bootstrap.min.css`, `js/bootstrap.bundle.min.js` |
| Custom styles | CSS custom properties | `css/style.css` |
| Syntax highlighting | Prism.js (`data-manual`) | `js/prism.js` + `js/code-highlight.js` |
| Slider/carousel | Swiper.js | `js/swiper-bundle.min.js`, `css/swiper-bundle.min.css` |
| Component injection | — | `js/components.js` |
| Blog detail logic | — | `js/detail.js` |
| Homepage cards | — | `js/site.js` |

**Removed — do not add back:** jQuery, Tabulator.js, Slick carousel, Font Awesome, `smooth-scroll.polyfills.min.js`, scroll-up button.

## File Structure

```
shafiqulai.github.io/
├── index.html                    # Homepage (blog card grid)
├── blogs/
│   └── blog_1.html … blog_7.html # Blog detail pages (no template file)
├── data/
│   └── posts.json                # All blog metadata — source of truth for cards + slider
├── img/
│   ├── blog_N/                   # Images for blog N (thumbnail.webp + content images)
│   ├── author/                   # Author photos (shafiqul.jpg)
│   ├── technical_stack/          # Tech stack icons (SVG preferred, PNG for some)
│   └── others/                   # Misc icons (download.svg, blog.png, read_more.png)
├── css/
│   ├── style.css                 # All custom CSS (design system)
│   ├── bootstrap.min.css
│   ├── swiper-bundle.min.css
│   └── prism.css                 # Prism syntax highlighting theme
├── js/
│   ├── site.js                   # Homepage: renders blog cards from posts.json
│   ├── detail.js                 # Blog pages: TOC scroll-spy, related posts, author info
│   ├── components.js             # Injects #site-header and #site-footer into every page
│   ├── code-highlight.js         # Wraps .blg-code-block in <pre><code>, calls Prism
│   ├── main.js                   # Homepage misc (reading progress, etc.)
│   ├── prism.js                  # Prism.js syntax highlighter
│   ├── bootstrap.bundle.min.js
│   └── swiper-bundle.min.js
├── CLAUDE.md                     # This file (auto-loaded by Claude Code)
└── .claude/
    ├── instructions.md           # Full HTML class reference for blog content
    ├── new-post-guide.md         # Step-by-step guide for creating a new blog post
    └── notes.md                  # Quick reference: URLs, git commands, tools
```

## How the Site Works

**Component injection:** Every page has `<div id="site-header"></div>` and `<div id="site-footer"></div>`. `components.js` injects header/footer at load time.

**Blog detail pages:** `detail.js` extracts post ID from filename → fetches `../data/posts.json` → populates author info → renders related posts Swiper slider → runs `initScrollSpy()` (activates if `#tocSidebar` exists).

**Homepage:** `site.js` fetches `./data/posts.json` and renders blog cards dynamically.

**Syntax highlighting:** `code-highlight.js` reads `data-lang="X"` from each `.blg-code-block`, wraps in `<pre><code class="language-X">`, calls `Prism.highlightElement()`.
- Always set `data-lang` explicitly. Fallback: `bash`.
- Valid values: `python` `bash` `docker` `yaml` `json` `properties` `markdown`
- Blocks with `<span>` tags are skipped (manual highlighting preserved)
- `self`/`cls` registered as Python keywords via `Prism.languages.insertBefore`

## CSS Conventions

- Never use inline styles — all styling via CSS classes in `css/style.css`
- Use `var(--primary)`, `var(--text)`, etc. — never hardcode hex colors
- `.blg-tree` comments aligned with spaces (not CSS margin); rule: `max(pipe+name) + 6`
- **`overflow-x: clip` on html/body — never revert to `hidden`.**
  `hidden` makes `body` the scroll container in Chrome, breaking `position: sticky`.

## Design System — Class Quick Reference

Full reference: `.claude/instructions.md`

| Group | Key classes |
|-------|-------------|
| Layout | `.blg-section`, `.blg-anchor`, `.blg-intro`, `.blg-intro-img`, `.blg-intro-text` |
| Headers | `.blg-main-header` + `<h2>`, `.blg-sub-header` + `<h3>` + `.blg-sub-badge` |
| Text | `.blg-paragraph`, `.blg-ul`, `.blg-li`, `.blg-li-check`, `.code-soft`, `.highlight-*` |
| Code | `.blg-code-block` (+ `data-lang`), `.blg-tree` + tree span classes |
| Media | `.blg-img-container`, `.blg-img`, `.blg-img-caption`, `.blg-thumbnail` |
| Callouts | `.blg-callout-info/warning/tip/quote/note/purple` |
| Table | `.blg-table` |
| Trailing | `.blg-trailing-section`, `.blg-tech-grid`, `.blg-tech-card`, `.blg-download-card` |
| Components | `.blg-feature-grid`, `.blg-arch-stack`, `.blg-query-list` |
