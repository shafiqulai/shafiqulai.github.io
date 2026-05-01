================================================================
  BLOG DETAIL PAGE — CONTENT STANDARDS & RULES
  File: instructions.md
  Last updated: May 2026
================================================================

These rules define the correct HTML structure and CSS classes for every
element inside a blog detail page (blogs/blog_*.html).
Always use shared CSS classes from css/style.css. Never use inline styles
inside blog content. Inline styles make maintenance impossible and produce
inconsistent output across posts.

----------------------------------------------------------------
  1. PAGE-LEVEL STRUCTURE
----------------------------------------------------------------
Each blog detail page must follow this outer shell:

  <body>
    <div id="wrapper">
      <div id="site-header"></div>           ← injected by components.js

      <section id="content">
        <div class="container">
          <div id="blogContainer">

            <!-- [blog title] -->
            <!-- [author section] -->
            <!-- [thumbnail image] -->
            <!-- [preface / intro] -->
            <!-- [table of contents] -->
            <!-- [section 1 ... N] -->
            <!-- [related posts slider — injected by detail.js] -->

          </div>
        </div>
      </section>

      <div id="site-footer"></div>           ← injected by components.js
    </div>
  </body>

----------------------------------------------------------------
  2. BLOG TITLE
----------------------------------------------------------------
Class: .blg-title-container + .blg-title

  <div class="container blg-title-container">
    <h2 class="blg-title">Your Blog Post Title Here</h2>
  </div>

Rules:
  - Use exactly one title per page.
  - Title text must match the <title> meta tag exactly.
  - No inline styles.

----------------------------------------------------------------
  3. AUTHOR SECTION
----------------------------------------------------------------
Class: .author_section, .author_img, .author_details, .author_name, .published_date

  <div class="author_section">
    <img id="author_img" src="" alt="Author Photo" class="author_img">
    <div class="author_details">
      <span id="author_name" class="author_name"></span>
      <span id="published_date" class="published_date"></span>
    </div>
  </div>

Rules:
  - Leave src="" empty — detail.js populates author_img and author_name
    from posts.json.
  - Do not hardcode author name or date here.

----------------------------------------------------------------
  4. THUMBNAIL / HERO IMAGE
----------------------------------------------------------------
Class: .blg-thumbnail (replaces inline style="width: 70%;")

Option A — standalone (image centered, full row):

  <div class="blg-img-container">
    <img src="../img/blog_N/thumbnail.webp"
         alt="Descriptive alt text matching page title"
         class="blg-thumbnail" />
  </div>

Option B — intro layout (thumbnail left 44%, preface right):

  <div class="blg-intro">
    <div class="blg-intro-img">
      <img src="../img/blog_N/thumbnail.webp"
           alt="Descriptive alt text"
           class="blg-thumbnail" />
    </div>
    <div class="blg-intro-text">
      <!-- preface paragraphs / callouts go here -->
    </div>
  </div>

Rules:
  - Use .blg-thumbnail class; never set width with inline style.
  - Option A: CSS sets width: 70% on desktop, 100% on mobile.
  - Option B: .blg-intro is flex row (44% image / remaining text); stacks
    vertically on mobile (≤767px). Image takes 100% of its column.
  - Use .webp format for thumbnails.
  - Alt text must be descriptive (copy the page title if unsure).

----------------------------------------------------------------
  5. SECTION WRAPPER
----------------------------------------------------------------
Class: .blg-section (NEW — replaces the repeated inline div style)

  <div class="blg-section">
    <!-- section content here -->
  </div>

Rules:
  - Every logical section of the post (intro, each numbered section,
    conclusion) must be wrapped in <div class="blg-section">.
  - Never use: <div style="font-family:...; line-height:...; color:...">
  - The .blg-section class in CSS sets: font-family, line-height, color,
    font-size, padding.

----------------------------------------------------------------
  6. SCROLL ANCHOR TARGET
----------------------------------------------------------------
Class: .blg-anchor (NEW — replaces inline style on <a> tag)

  <a id="section-id" class="blg-anchor"></a>

Rules:
  - Place immediately before the heading it anchors.
  - Use class="blg-anchor" instead of style="position:relative; top:-110px;
    visibility:hidden;"
  - CSS applies: position: relative; top: -90px; visibility: hidden;
    display: block;

----------------------------------------------------------------
  7. MAIN SECTION HEADER (Level 1)
----------------------------------------------------------------
Class: .blg-main-header (existing)

  <a id="section-id" class="blg-anchor"></a>
  <div class="blg-main-header">
    <h2>📘 1. Section Title</h2>
  </div>

Rules:
  - Use <h2>, NOT <h1>. Only one <h1> exists per page (the .blg-title).
  - Do NOT add inline styles to the <h2> (no color, no font-size).
  - CSS controls: color, font-size, margin, padding.
  - Emojis before the number are optional but consistent within a post.

----------------------------------------------------------------
  8. SUB-SECTION HEADER (Level 2)
----------------------------------------------------------------
Class: .blg-sub-header (existing)

Numbered sub-sections (e.g. 2.1, 8.3) — use a .blg-sub-badge for the number:

  <a id="subsection-id" class="blg-anchor"></a>
  <div class="blg-sub-header">
    <span class="blg-sub-badge">2.1</span>
    <h3>🔧 Sub-section Title</h3>
  </div>

Unnumbered sub-sections (e.g. "Web Interface Preview") — no badge:

  <div class="blg-sub-header">
    <h3>🖼️ Sub-section Title</h3>
  </div>

Rules:
  - Use <h3> inside .blg-sub-header (not <h2> — <h2> is used by main header).
  - The number goes in .blg-sub-badge only — do NOT repeat it inside <h3>.
  - Keep the emoji inside <h3>, not in the badge.
  - Do NOT add inline styles.
  - Style: amber rounded badge left + bold dark-navy h3 + amber bottom border.

----------------------------------------------------------------
  9. PARAGRAPH
----------------------------------------------------------------
Class: .blg-paragraph (existing)

  <div class="blg-paragraph">
    <p>Body text goes here.</p>
  </div>

Rules:
  - Wrap paragraphs in .blg-paragraph for consistent line-height, font-size,
    and color.
  - Do not use bare <p> tags with inline styles.
  - For bold emphasis within a paragraph, use <strong>.
  - For italic, use <em>.

----------------------------------------------------------------
  10. BULLET LIST (unordered)
----------------------------------------------------------------
Class: .blg-ul with .blg-li items (existing)

  <ul class="blg-ul">
    <li class="blg-li">Item one</li>
    <li class="blg-li">Item two</li>
  </ul>

Rules:
  - Never use <ul style="padding-left: 40px;">.
  - Use .blg-ul on the <ul> and .blg-li on each <li>.
  - For nested lists, add a second <ul class="blg-ul"> inside a <li>.
  - Emoji bullets are fine at the start of li text.

----------------------------------------------------------------
  11. CHECKLIST / TICK LIST
----------------------------------------------------------------
Class: .blg-li-check (existing)

  <ul>
    <li class="blg-li-check">Completed item one</li>
    <li class="blg-li-check">Completed item two</li>
  </ul>

Rules:
  - Use only for checklist-style items (✅ visual marker).
  - Do not mix with .blg-li in the same list.

----------------------------------------------------------------
  12. NUMBERED LIST (ordered)
----------------------------------------------------------------
  <ol class="blg-toc-ol">
    <li class="blg-toc-li">Step one</li>
    <li class="blg-toc-li">Step two</li>
  </ol>

Rules:
  - Reuse the same .blg-toc-ol / .blg-toc-li classes for numbered content
    outside the TOC.
  - For step-by-step workflows, prefer .blg-steps (B-04, future class).

----------------------------------------------------------------
  13. INLINE CODE
----------------------------------------------------------------
Class: .code-soft (existing)

  <span class="code-soft">filename.py</span>

Rules:
  - Use for any inline code, file name, command, or technical term.
  - Never use <code> without a class, or backtick-wrapped text.

----------------------------------------------------------------
  13b. PARAGRAPH HIGHLIGHT CHIPS
----------------------------------------------------------------
Classes: .highlight-blue, .highlight-green, .highlight-purple,
         .highlight-orange, .highlight-teal

  <p>We use a <span class="highlight-purple">large language model</span> to re-rank results.</p>

Color variants — when to use each:
  .highlight-blue    General technical terms, default concepts (blue on light blue)
  .highlight-green   Models, embeddings, ML components (green on light green)
  .highlight-purple  LLMs, AI reasoning, language models (purple on light purple)
  .highlight-orange  Important caveats, config values, constraints (orange on amber)
  .highlight-teal    Databases, storage, pipelines, search systems (teal on light teal)

Rules:
  - Use sparingly — 1–3 chips per section maximum.
  - Vary colors across sections; don't repeat the same color consecutively.
  - Use for KEY CONCEPTS in paragraphs, not for code/filenames (use .code-soft instead).
  - Never use inside headings or callout boxes.

----------------------------------------------------------------
  14. CODE BLOCK
----------------------------------------------------------------
Class: .blg-code-block

  Standard usage — always include data-lang; Prism.js handles highlighting:

  <div class="blg-code-block" data-lang="python">import os
from langchain import LLMChain

def run(query):
    return chain.invoke({"input": query})</div>

  Manual control — wrap spans for precise coloring (blocks with existing
  spans are skipped by Prism automatically):

  <div class="blg-code-block"><span class="code-kw">python3.12</span> <span class="code-flag">-m</span> venv venv
<span class="code-kw">source</span> venv/bin/activate  <span class="code-cmt"># Windows: venv\Scripts\activate</span></div>

Prism.js integration (required in every blog page):
  - prism.css linked in <head> after style.css.
  - prism.js loaded with data-manual attribute (before code-highlight.js).
  - code-highlight.js wraps each .blg-code-block in <pre><code class="language-X">
    and calls Prism.highlightElement().
  - Language is read directly from data-lang="X" on the div — always set this attribute.
    Fallback when data-lang is absent: bash.
  - Blocks that already contain <span> tags are skipped (manual highlighting preserved).
  - Copy button is hidden globally: div.code-toolbar > .toolbar { display: none; }.

Span color classes — for manual control only:
  .code-kw    Keywords, commands, built-in names (purple bold) — if, return, for, pip, python
  .code-flag  Method calls, option flags, function names (blue) — .encode(), -m, install
  .code-arg   Plain arguments, module names (dark) — venv, requirements.txt
  .code-var   Variable names, env keys (red bold) — GROQ_API_KEY, result
  .code-val   String literals, numbers (green) — "hello", 42, True
  .code-cmt   Inline comments (muted grey) — # any comment

Rules:
  - Always set data-lang on every .blg-code-block. Valid values: python, bash, docker,
    yaml, json, properties, markdown. Default fallback is bash.
  - For new blog posts: write plain text in .blg-code-block — Prism handles highlighting.
  - white-space: pre is set by CSS — preserve exact indentation in the HTML source.
  - overflow-x: auto handles wide code automatically.
  - No inline styles inside .blg-code-block.

----------------------------------------------------------------
  14b. DIRECTORY TREE BLOCK
----------------------------------------------------------------
Class: .blg-tree + span color classes

  <div class="blg-tree"><span class="tree-root">project-root/</span>
<span class="tree-pipe">├── </span><span class="tree-dir">folder/</span>        <span class="tree-comment"># comment</span>
<span class="tree-pipe">│ ├── </span><span class="tree-file">file.py</span>           <span class="tree-comment"># comment</span>
<span class="tree-pipe">│ └── </span><span class="tree-spec">.env</span>              <span class="tree-comment"># comment</span>
<span class="tree-pipe">└── </span><span class="tree-file">README.md</span></div>

Span color classes — when to use each:
  .tree-root    Root folder name (top-level project dir). Dark bold blue.
  .tree-dir     Any subdirectory name (ends with /). Blue bold.
  .tree-file    Regular source files (.py, .txt, .csv, .md, .yml, etc.). Dark text.
  .tree-spec    Special/sensitive files (.env, secrets, keys). Red — signals caution.
  .tree-pipe    Tree connectors only (├── └── │). Muted grey — decorative, not content.
  .tree-comment Inline comment after # describing the file/folder. Muted grey.

Column-alignment rule:
  - Pad with spaces so every tree-comment in a block starts at the same column.
  - Target = longest(pipe_text + name_text) + 6 spaces minimum.
  - Example: longest entry is 25 chars → pad all entries to column 31.
  - No CSS margin is applied to .tree-comment; spaces in the HTML handle alignment.

Rules:
  - Use .blg-tree for directory/file trees only — not for code snippets.
  - Use .blg-code-block (with plain text) for actual code — Prism.js will highlight it.
  - Comments use # prefix (not ←).
  - Do not use inline styles inside .blg-tree.
  - white-space: pre is set by CSS — preserve exact spacing for alignment.

----------------------------------------------------------------
  15. CALLOUT BOXES (blockquote variants)
----------------------------------------------------------------
Classes: .blg-callout-info, .blg-callout-warning, .blg-callout-tip,
         .blg-callout-quote, .blg-callout-note, .blg-callout-purple

  Info (blue):
  <blockquote class="blg-callout-info">
    💡 This is an informational note.
  </blockquote>

  Warning (orange):
  <blockquote class="blg-callout-warning">
    ⚠️ This is a warning or caution.
  </blockquote>

  Tip (green):
  <blockquote class="blg-callout-tip">
    ✅ This is a helpful tip.
  </blockquote>

  Quote (teal):
  <blockquote class="blg-callout-quote">
    "A quote or sample query goes here."
  </blockquote>

  Note (amber/yellow) — key findings, important observations:
  <blockquote class="blg-callout-note">
    📌 <strong>Key finding:</strong> explanation text here.
  </blockquote>

  Highlight (purple) — definitions, bridging concepts, technical terms:
  <blockquote class="blg-callout-purple">
    🔗 <strong>Term:</strong> explanation or definition here.
  </blockquote>

Rules:
  - Never use <blockquote style="background:...; border-left:...">
  - Pick the variant that matches the intent:
    info (facts/notes), warning (cautions), tip (best practices),
    quote (user queries / citations), note (key findings / observations),
    purple (definitions / bridging concepts).

----------------------------------------------------------------
  16. IMAGE WITH CAPTION
----------------------------------------------------------------
Class: .blg-img-container + .blg-img-caption (NEW — defined by B-05)

  <div class="blg-img-container">
    <img src="../img/blog_N/image_name.webp"
         alt="Descriptive alt text"
         class="blg-img" />
    <p class="blg-img-caption">Figure 1: Caption text here.</p>
  </div>

Rules:
  - Never set width/height inline on <img>.
  - Use .blg-img class; CSS sets width: 70% centered on desktop, 100% on mobile (≤767px).
  - Always include alt text.
  - Caption is optional but recommended for diagrams and screenshots.
  - Prefer .webp or .png for diagrams, .jpg for photos.

----------------------------------------------------------------
  17. TABLE
----------------------------------------------------------------
Class: .blg-table

  <div class="blg-table">
    <table>
      <thead>
        <tr><th>Column A</th><th>Column B</th><th>Column C</th></tr>
      </thead>
      <tbody>
        <tr><td>Value</td><td>Value</td><td>Value</td></tr>
        <tr><td>Value</td><td>Value</td><td>Value</td></tr>
      </tbody>
    </table>
  </div>

Rules:
  - Use .blg-table as the sole wrapper — no extra container needed.
  - Write plain <table>, <thead>, <tbody>, <th>, <td> — no Bootstrap
    utility classes (table-bordered, table-dark, etc.).
  - Do NOT add class attributes to individual <th> or <td> elements.
  - CSS handles all styling: light blue (#eef4ff) header with dark text,
    plain white rows, subtle row dividers, hover highlight, rounded
    border with box border.
  - Width: 85% centered on desktop, 100% on mobile (≤767px).
  - First column is automatically bold with a light gray background —
    this is pure CSS (td:first-child) and requires no extra class.
  - Do NOT use Tabulator.js — it has been removed from the project.

----------------------------------------------------------------
  18. HORIZONTAL DIVIDER
----------------------------------------------------------------
Class: .blg-hr (existing)

  <hr class="blg-hr">

Rules:
  - Place between major sections as a visual separator.
  - Use at the END of a .blg-section div, before the closing </div>.
  - Do not use bare <hr> without the class.

----------------------------------------------------------------
  19. EXTERNAL LINKS
----------------------------------------------------------------
Class: .blg-link (NEW)

  <a href="https://example.com"
     class="blg-link"
     target="_blank"
     rel="noopener noreferrer">Link text</a>

Rules:
  - Never use style="text-decoration: underline;" on links.
  - Always add target="_blank" and rel="noopener noreferrer" for external URLs.
  - .blg-link CSS: underline on hover/focus, primary colour.

----------------------------------------------------------------
  20. TABLE OF CONTENTS
----------------------------------------------------------------
Class: .blg-toc-container (existing)

  <div class="blg-toc-container">
    <h2>📚 Table of Contents</h2>
    <ol class="blg-toc-ol">
      <li class="blg-toc-li"><a href="#section-id">1. Section Title</a></li>
      <ul class="blg-toc-ul">
        <li class="blg-toc-li"><a href="#sub-id">1.1 Sub-section</a></li>
      </ul>
    </ol>
  </div>

Rules:
  - Use <h2> (not <h1>) for the TOC heading.
  - href values must match the id on .blg-anchor elements.
  - Anchor IDs must be lowercase, hyphen-separated (e.g. "project-overview").
  - Smooth scrolling is handled by SmoothScroll.js (detail.js).

----------------------------------------------------------------
  21. RELATED BLOG POSTS (slider)
----------------------------------------------------------------
This section is auto-generated by detail.js. The required HTML shell
must appear at the bottom of every blog post:

  <div class="related-posts-section">
    <div class="blog-title-bar">
      <img src="../img/others/blog.png" alt="blog post" style="width: 24px; height: auto;">
      <h2>Related Blog Posts</h2>
    </div>
    <div class="related-posts-wrapper">
      <div class="related-posts-swiper-area">
        <div class="swiper" id="postContainer">
          <div class="swiper-wrapper">
            <!-- populated by detail.js -->
          </div>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      <div class="blg-slide-counter">
        <div class="slide-progress-bar">
          <div class="slide-progress-fill" id="slideProgressFill"></div>
        </div>
        <div class="slide-counter-label">
          <span id="currentSlide">1</span> / <span id="totalSlides">1</span>
        </div>
      </div>
    </div>
  </div>

Rules:
  - Copy this block exactly — do not modify IDs or class names.
  - Do not add content inside #postContainer; detail.js fills it.
  - PLACEMENT: this div must sit OUTSIDE .blog-detail-layout but still inside .container.
    Correct nesting order at the end of a long post:
      </div> <!-- closes last .blg-section inside #blogContainer -->
      </div> <!-- closes #blogContainer -->
      </div> <!-- closes .blog-detail-main -->
      </div> <!-- closes .blog-detail-layout -->
      <div class="related-posts-section"> ← HERE (inside .container)
    If placed inside .blog-detail-layout, the TOC sidebar stretches to the footer.

----------------------------------------------------------------
  21b. TRAILING SECTIONS (Tech Stacks / Download / References)
----------------------------------------------------------------
These three blocks appear at the bottom of every blog post, inside the
blog content div, after the Conclusion section and before the related
posts slider.

  Technical Stacks (card grid):
  <!-- 13. Technical Stacks -->
  <div class="blg-trailing-section">
    <div class="blg-trailing-header">
      <img src="../img/technical_stack/stack.png" alt="Technical Stacks">
      <h2>Technical Stacks</h2>
    </div>
    <div class="blg-tech-grid">
      <div class="blg-tech-card">
        <img src="../img/technical_stack/python.svg" alt="Python"> Python
      </div>
      <!-- repeat for each technology used in the post -->
    </div>
  </div>
  <!-- End: Technical Stacks -->

  Download Source Code (CTA card):
  <!-- 14. Download Source Code -->
  <div class="blg-download-card">
    <img src="../img/others/download.svg" alt="Download">
    <div class="blg-download-info">
      <h3>Download Source Code</h3>
      <p>Project Name</p>
    </div>
    <a href="GITHUB_URL" class="blg-download-btn" target="_blank" rel="noopener noreferrer">View on GitHub</a>
  </div>
  <!-- End: Download Source Code -->

  References (bullet list):
  <!-- 15. References -->
  <div class="blg-trailing-section">
    <div class="blg-trailing-header">
      <span style="font-size: 22px; line-height: 1;">📚</span>
      <h2>References</h2>
    </div>
    <ul class="blg-ul">
      <li class="blg-li">
        <img src="../img/technical_stack/github.svg" alt="GitHub" width="18"
             style="vertical-align: middle; margin-right: 6px;">
        <strong>GitHub Repository:</strong>
        <a class="blg-link" target="_blank" rel="noopener noreferrer" href="URL">Link text</a>
      </li>
    </ul>
  </div>
  <!-- End: References -->

Rules:
  - Sections are separated by 48px margin (blg-trailing-section + blg-download-card).
  - No <hr class="blg-hr"> inside or between these three trailing sections.
  - The <hr class="blg-hr"> belongs at the END of the last content section (Conclusion),
    not inside any trailing section. Example:
      <div class="blg-section"> <!-- Conclusion -->
        ...
        <hr class="blg-hr" />   ← correct placement
      </div>
      <!-- Technical Stacks -->
      <div class="blg-trailing-section"> ← no <hr> here
  - blg-tech-grid: 4 columns desktop → 2 columns mobile (handled by CSS).
  - blg-download-btn wraps to full-width on mobile automatically.
  - Tech icons: use SVG from ../img/technical_stack/ when available; PNG for llama, rag, prompt, stack.
  - Reference icons: use 18px inline img with vertical-align: middle; margin-right: 6px;
  - Use github.svg and huggingface.svg for the first two reference items.
  - Never use raw URLs as link text in references — always use short descriptive text with .blg-link.
  - Section comments follow the N. Title / End: Title format.

----------------------------------------------------------------
  21c. FEATURE CARDS (blg-feature-grid)
----------------------------------------------------------------
A 2-column card grid for highlighting key features or capabilities.
Each card has a colored left border and an emoji/icon header.

Structure:
  <div class="blg-feature-grid">
    <div class="blg-feature-card card-blue">
      <div class="blg-feature-card-header">
        <span class="blg-feature-card-icon">🔍</span>
        <h4>Card Title</h4>
      </div>
      <div class="blg-feature-card-body">
        <p>Short description of this feature.</p>
      </div>
    </div>
    <!-- repeat cards -->
  </div>

Color modifier classes (applied alongside .blg-feature-card):
  .card-blue    — left border #2563eb, icon bg #eff6ff
  .card-purple  — left border #7c3aed, icon bg #f5f3ff
  .card-green   — left border #059669, icon bg #f0fdf4
  .card-teal    — left border #0d9488, icon bg #f0fdfa
  .card-orange  — left border #d97706, icon bg #fffbeb
  .card-red     — left border #dc2626, icon bg #fef2f2

Rules:
  - Grid collapses to 1 column on mobile.
  - .blg-feature-card-header wraps the icon span + h4 title.
  - .blg-feature-card-body wraps the description paragraph.
  - Each card needs exactly one .card-* modifier.

----------------------------------------------------------------
  21d. ARCHITECTURE STACK (blg-arch-stack)
----------------------------------------------------------------
A numbered vertical pipeline showing architecture layers.
Numbers are auto-generated with CSS counters — do NOT hardcode them in HTML.

Structure:
  <div class="blg-arch-stack">
    <div class="blg-arch-layer al-blue">
      <div class="blg-arch-icon">🧩</div>
      <div class="blg-arch-name">Layer Name</div>
      <div class="blg-arch-desc">Short description of what this layer does.</div>
    </div>
    <!-- repeat layers -->
  </div>

Color modifier classes (applied alongside .blg-arch-layer):
  .al-amber   — warm amber background
  .al-purple  — soft purple background
  .al-blue    — light blue background
  .al-teal    — teal/cyan background
  .al-green   — light green background
  .al-orange  — pale orange background

Rules:
  - Up to 8 layers in sequence; cycle colors to visually distinguish steps.
  - The numbered circle (::before pseudo-element) is pure CSS — no number in HTML.
  - Keep .blg-arch-desc short: 1–2 sentences.

----------------------------------------------------------------
  21e. QUERY / OUTPUT CARDS (blg-query-list)
----------------------------------------------------------------
A vertical list of Q&A pairs shown as two-row cards.
Used for "Example Queries & Output" sections.

Structure:
  <div class="blg-query-list">
    <div class="blg-query-card">
      <div class="blg-query-q">
        <span class="blg-query-badge bq-query">Q</span>
        "User's natural language query text."
      </div>
      <div class="blg-query-a">
        <span class="blg-query-badge bq-output">A</span>
        What the system returned or did.
      </div>
    </div>
    <!-- repeat cards -->
  </div>

Badge modifiers:
  .bq-query   — blue badge (query row)
  .bq-output  — green badge (output/answer row)

Rules:
  - .blg-query-q has a light blue background; .blg-query-a is white.
  - Do NOT include the intro "✅ Examples:" paragraph — the card format is self-explanatory.
  - Keep query text in quotation marks; keep output text as a plain statement.

----------------------------------------------------------------
  22. GENERAL RULES
----------------------------------------------------------------
  ✅ DO:
  - Use CSS classes for ALL styling.
  - Follow the class names defined in this file exactly.
  - Keep HTML semantic: h2 for main sections, h3 for sub-sections.
  - Use Open Sans font (loaded via Google Fonts) — no inline font-family.
  - Use CSS custom properties: var(--primary), var(--text), etc.
  - Test on mobile before committing.

  ❌ DON'T:
  - Use inline style="" attributes anywhere in post content.
  - Use <h1> inside post content (only .blg-title uses h2, and it is
    styled to look like a title via CSS).
  - Hardcode hex colors, pixel sizes, or font stacks inline.
  - Use <br><br> for spacing — use margin/padding via CSS classes.
  - Use <b> for bold — use <strong>.
  - Use <i> for italic — use <em>.

----------------------------------------------------------------
  23. QUICK REFERENCE — CLASS CHEAT SHEET
----------------------------------------------------------------
  .blg-title-container    Page title wrapper (blue bar)
  .blg-title              Page title text
  .author_section         Author row (photo + name + date)
  .blg-thumbnail          Hero/thumbnail image
  .blg-intro              Flex row wrapper: thumbnail left (44%), preface right
  .blg-intro-img          Left column inside .blg-intro (image fills full width)
  .blg-intro-text         Right column inside .blg-intro (preface text)
  .blg-section            Content section wrapper (replaces inline div)
  .blg-anchor             Invisible scroll target anchor
  .blg-main-header        Blue-left-border h2 wrapper (24px desktop / 20px mobile)
  .blg-sub-header         Amber-underline flex row: badge + h3 (20px desktop / 17px mobile)
  .blg-sub-badge          Amber rounded number badge inside .blg-sub-header
  .blg-paragraph          Paragraph text wrapper
  .blg-ul                 Unordered list
  .blg-li                 List item (standard bullet)
  .blg-li-check           List item (✅ checkmark)
  .blg-toc-container      Table of contents box
  .blg-toc-ol             TOC numbered list
  .blg-toc-ul             TOC nested list
  .blg-toc-li             TOC list item
  .code-soft              Inline code/filename chip (blue bg, bold)
  .highlight-blue         Paragraph concept chip — general terms (blue)
  .highlight-green        Paragraph concept chip — models/embeddings (green)
  .highlight-purple       Paragraph concept chip — LLMs/AI (purple)
  .highlight-orange       Paragraph concept chip — caveats/config (orange)
  .highlight-teal         Paragraph concept chip — databases/pipelines (teal)
  .blg-code-block         Code block (Prism.js auto-highlights plain text; manual spans preserved)
  .code-kw                Code span: keyword/command (purple bold)
  .code-flag              Code span: method/flag/function name (blue)
  .code-arg               Code span: plain argument/module (dark)
  .code-var               Code span: variable/env key (red bold)
  .code-val               Code span: string/number literal (green)
  .code-cmt               Code span: comment (muted grey)
  .blg-tree               Directory/file tree wrapper
  .tree-root              Tree: root folder name (dark bold blue)
  .tree-dir               Tree: subdirectory name (blue bold)
  .tree-file              Tree: regular file (dark text)
  .tree-spec              Tree: special/sensitive file e.g. .env (red)
  .tree-pipe              Tree: connectors ├── └── │ (muted grey)
  .tree-comment           Tree: inline # comment (muted grey)
  .blg-callout-info       Blue info callout
  .blg-callout-warning    Orange warning callout
  .blg-callout-tip        Green tip callout
  .blg-callout-quote      Teal quote block (italic)
  .blg-callout-note       Amber/yellow key-finding callout
  .blg-callout-purple     Purple highlight / definition callout
  .blg-img-container      Image wrapper
  .blg-img                Image element
  .blg-img-caption        Image caption
  .blg-table              Table wrapper — light blue header, white rows, rounded border
  .blg-hr                 Horizontal divider
  .blg-link               External link
  .blg-trailing-section   Trailing section wrapper (Tech Stacks / References)
  .blg-trailing-header    Trailing section header bar (with bottom border)
  .blg-tech-grid          4-col card grid for tech stack icons
  .blg-tech-card          Individual tech stack card (icon + name)
  .blg-download-card      Download CTA card (left blue border)
  .blg-download-info      Download card text block (h3 + p)
  .blg-download-btn       GitHub button inside download card
  .blg-feature-grid       2-col card grid for key features
  .blg-feature-card       Feature card (requires .card-* modifier)
  .blg-feature-card-icon  Emoji/icon header inside feature card
  .card-blue              Feature card variant — blue left border
  .card-purple            Feature card variant — purple left border
  .card-green             Feature card variant — green left border
  .card-teal              Feature card variant — teal left border
  .card-orange            Feature card variant — orange left border
  .card-red               Feature card variant — red left border
  .blg-arch-stack         Numbered vertical architecture pipeline
  .blg-arch-layer         Single layer inside arch stack (requires .al-* modifier)
  .blg-arch-icon          Emoji/icon inside arch layer
  .blg-arch-name          Layer name (bold)
  .blg-arch-desc          Layer description text
  .al-amber / .al-purple / .al-blue / .al-teal / .al-green / .al-orange — arch layer bg colors
  .blg-query-list         Vertical list of Q&A cards
  .blg-query-card         Single query/output card
  .blg-query-q            Query row (light blue bg)
  .blg-query-a            Output row (white bg)
  .blg-query-badge        Q or A badge chip
  .bq-query               Blue badge (for Q row)
  .bq-output              Green badge (for A row)
  .related-posts-section  Related posts slider section
