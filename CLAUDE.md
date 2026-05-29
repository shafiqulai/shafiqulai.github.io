# shafiqulai.github.io — Claude Context

Personal engineering blog by **Md Shafiqul Islam** (AI Engineer / LLM Specialist / Python Developer).
Topics: LLMs, RAG, AI Agents, LangChain, LangGraph, Docker, Hugging Face, OpenAI, Streamlit, Gradio.
18 blog posts published (`blog_1.html` through `blog_18.html`), hosted on GitHub Pages.
LangGraph Basics series (blog_8–13) complete. LangGraph Advanced series (blog_14–18) complete — all 11 LangGraph posts done.

**Before writing any blog HTML → read `.claude/instructions.md`.**
**To create a new blog post → read `.claude/new-post-guide.md`.**

## Blog HTML Writing Rule — CRITICAL

**Never generate large amounts of HTML in a single tool call.** Large single writes cause stream stalls and connection drops before the file is saved.

**Always write blog HTML using a skeleton-first approach:**

1. **First Write — skeleton only** (`<head>` + body shell + TOC sidebar + inline TOC + placeholder comments + closing tags):
   - One small Write call; fast and safe.
   - Insert `<!-- SECTION N PLACEHOLDER -->` comments for every section.
2. **Section-by-section Edits** — replace each placeholder with its section content:
   - One `Edit` call per section (one main section at a time, not all at once).
   - A "section" = one `<div class="blg-section">` block — intro, setup, concept, example, etc.
   - If a section is very long (many subsections + code blocks), split it across two Edit calls.
3. **Trailing sections last** — replace `<!-- TRAILING PLACEHOLDER -->` with Tech Stacks + Download + References in one final Edit.

**Why skeleton-first:** Claude generates HTML content in its thinking phase before calling Write/Edit. Generating an entire blog post at once stalls the stream at ~3 KB. Generating one section at a time stays well under that limit.

**Do not pause between edits.** Write the skeleton and all section edits in the same working session without waiting for user confirmation.

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
│   └── blog_1.html … blog_13.html # Blog detail pages (no template file)
├── data/
│   └── posts.json                # All blog metadata — source of truth for cards + slider
├── img/
│   ├── blog_N/                   # Images for blog N (thumbnail.webp + content images)
│   ├── author/                   # Author photos (shafiqul.png)
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

## Image Lightbox Rule

**All blog content images automatically open full-scale in a lightbox overlay when clicked** — no extra HTML needed.

`detail.js` runs `initLightbox()` on every page load, attaching the zoom handler to:
- `.blg-thumbnail` — the post thumbnail at the top of every blog page
- `.blg-img` — all content images (screenshots, diagrams, web UI previews)

**What this means for new posts:**
- Always use `class="blg-thumbnail"` on the thumbnail `<img>` — lightbox applied automatically.
- Always use `class="blg-img"` inside `.blg-img-container` for content images — lightbox applied automatically.
- Never add inline `onclick` handlers or custom JS for zoom behaviour.
- Zoom-in cursor is applied via CSS (`.blg-thumbnail, .blg-img { cursor: zoom-in }`).

Clicking the overlay or pressing Escape closes the lightbox.

## Image Format Rule

**Always use `.webp` format for all images in new blog posts** — thumbnails, content images, and web UI screenshots.
- Never reference `.png` or `.jpg` in new blog HTML unless no `.webp` version exists.
- When adding images to `img/blog_N/`, convert to `.webp` before referencing in HTML.

**Author image in `data/posts.json` must always use `.png`:** `"author_img": "../img/author/shafiqul.png"`. Never use `.jpg` for the author image.

## Image Folder Rule

**Every time a new blog post is started, immediately create `img/blog_N/` before writing any HTML.**

- Run `mkdir img/blog_N` (replace `N` with the blog number) as the very first step.
- Place all images for that post — `thumbnail.webp`, content images, web UI screenshots — inside that folder.
- Never reference an image in blog HTML before the folder exists.

## Title Tag Rule

**The `<title>` tag in every blog post must exactly match the `title` field in `data/posts.json`** — character for character, including capitalisation, punctuation, and special characters.

- In HTML, encode `&` as `&amp;` in `<title>` (e.g. `Nodes &amp; Edges`).
- The `.blg-title` text inside the page body may differ in styling — `<title>` must match `posts.json`, not `.blg-title`.
- Before publishing: open `data/posts.json`, find the entry, copy the `title` value, paste into `<title>`.

**Why:** Google Search Console indexes `<title>` as the page headline. A mismatch creates inconsistency across search results, social shares, and browser tabs.

## Canonical Tag Rule

**Every HTML page must have a self-referencing `<link rel="canonical">` tag in `<head>`.**

Place it immediately after `<meta name="author">`:
```html
<meta name="author" content="MD SHAFIQUL ISLAM" />
<link rel="canonical" href="https://shafiqulai.github.io/blogs/blog_N.html" />
```

- Blog pages: `https://shafiqulai.github.io/blogs/blog_N.html`
- Non-blog pages (index.html, about.html): `https://shafiqulai.github.io/` and `https://shafiqulai.github.io/about.html`

**Without this tag**, Google picks its own canonical and reports the page as "Alternate page with proper canonical tag" in Search Console — it will not be indexed.

## Sitemap Rule

**Every time a new blog HTML file is created, append its URL to `sitemap.xml` immediately — do not wait until after publishing.**

```xml
<url>
    <loc>https://shafiqulai.github.io/blogs/blog_N.html</loc>
</url>
```

Replace `blog_N` with the actual blog number. Add the entry before the closing `</urlset>` tag.

## README Rule

**Every time a new series folder is created (e.g. `langgraph/basics-N-*/`), create a `README.md` inside that folder immediately.**

### Part README design (stunning template)

Use the existing part READMEs as the canonical style template. Every part README must have:

1. **Centered header block** using `<div align="center">`:
   - Emoji + title + subtitle
   - Large `for-the-badge` blog link badge: `[![Read Tutorial](https://img.shields.io/badge/📖%20Read%20Full%20Tutorial-shafiqulai.github.io-6366f1?style=for-the-badge&logoColor=white)](URL)`
   - Flat-square badges on the next line: Series, Part N of M, Python, LangGraph, License
   - Italic tagline summarising the core concept in one sentence

2. **Emoji-prefixed sections** in this order:
   - `## 🎯 What You'll Build` — project name + scenario description
   - `## 🧩 The Problem This Solves` — why the concept is needed (for Advanced; optional for Basics)
   - `## ✨ Key Concepts` — table
   - `## 🏗️ Graph Architecture` — ASCII diagram
   - `## 📊 Graph Diagram` — Mermaid code block
   - `## 📁 Project Structure` — annotated file tree
   - `## 🔑 Core Code` — key snippets with explanations
   - `## 🚀 Quick Start` — two bash commands (console + web UI)
   - `## 💬 What to Try` — example inputs table
   - `## 📚 Series Navigation` — full 11-row table (all Basics + Advanced, current marked `← You are here`)
   - `## 👤 Author`

3. **Full series navigation table** — include ALL 11 parts (6 Basics + 5 Advanced), not just prev/next. Mark "← You are here" on the current row. Advanced Part 5 additionally shows "🏆 Series Complete!".

**Basics badge colours:** Series `8b5cf6`, Part `6366f1`  
**Advanced badge colours:** Series `f59e0b`, Part `ea580c`

**Also update `langgraph/README.md`** whenever a new folder README is added:
- Add row to the series overview table (with App Built + Core Concept + Blog + Code columns)
- Update the project structure tree and Run Any Project table
- Use `basics-1-stategraph-nodes-edges/README.md` (Basics) or `advanced-1-conversational-chatbot/README.md` (Advanced) as style reference

Use `langgraph/basics-1-stategraph-nodes-edges/README.md` as the style template.

## Source Code Rule

**Every time a blog post HTML file is created or updated that references source code (Python files, project folders, GitHub links), create the actual source code immediately — do not wait until after publishing.**

- Source code lives in `langgraph/basics-N-<folder-name>/` for LangGraph series posts (e.g. `langgraph/basics-5-tools-toolnode/`).
- Before writing any files, read the existing series folder (e.g. `basics-4-checkpointers-memory-streaming/`) to match the exact code style, naming conventions, and class patterns used in the project.
- All Python files must follow the project's OOP conventions — see `.claude/MEMORY.md` and the existing `basics-N-*/` folders.
- The folder structure shown in the blog's `blg-tree` must exactly match the files actually created.
- Create **every file** shown in the project tree: `config.py`, `llm.py`, `state.py`, `nodes.py`, `graph.py`, `<app>_runner.py`, `app.py`, `prompts/<name>.txt`.
- After creating source files, also create `README.md` in the new folder and update `langgraph/README.md` — per the README Rule below.
- If code in the blog HTML differs from the actual source (e.g. different config attribute names, different class styles), update the blog HTML code blocks to match the real source.

### Gradio app pattern
- **Never pass `theme=` to `gr.ChatInterface`** — it is not supported and raises `TypeError`.
- **Always pass `css` to `demo.launch(css=...)`, never to `gr.Blocks(css=...)`** — Gradio 6.0 moved `css` to `launch()`. Passing it to `Blocks()` raises a `UserWarning` and may be ignored.
- Use `gr.Blocks` as the outer container when you need extra widgets (e.g. a "New Session" button). Use bare `gr.ChatInterface` only when no extra widgets are needed.
- **`respond` must `yield`, not `return`** — in `gr.ChatInterface`, always `yield` the response string (and `yield ""` for empty input early-return). Using `return` causes the response to silently not appear in the UI.
- **Use `isinstance(m, AIMessage)` not `m.type == "ai"`** — when extracting the last AI response from `state["messages"]`, `isinstance` is reliable across Gemini adapter versions; `.type` comparison can silently fail on newer `langchain-google-genai` builds.
- Always follow `basics-4-checkpointers-memory-streaming/app.py` as the canonical Gradio pattern.

## Blog Code Block Accuracy Rule

**Every code block in blog HTML must exactly match the actual source code patterns — no illustrative shortcuts, no placeholder values.**

### API keys
- Never hardcode `google_api_key="..."` or any API key in a code block.
- Instantiate LLMs without explicit key arguments: `ChatGoogleGenerativeAI(model=Config.MODEL_NAME)` — model name comes from `Config`, which reads `GEMINI_MODEL_NAME=gemini-3-flash-preview` from `.env`. Never hardcode a model string directly.
- Add a comment if it helps: `# reads GEMINI_API_KEY from .env`.

### Tool references
- When showing `ToolNode` or `bind_tools` in a code block, always import from the tools package: `from tools import TOOLS`. Never list bare function or class names inline (e.g. `[calculate_loan_payment, ...]`).
- Correct: `ToolNode(TOOLS)` and `llm.bind_tools(TOOLS)`.

### State class names
- All blog content — intro paragraphs, feature cards, callouts, code blocks — must use the project's actual state class name (e.g. `FinanceState`, `StudyState`). Never use LangGraph's shortcut name (`MessagesState`) when the project defines its own `TypedDict`.
- When explaining why you define your own `TypedDict` over `MessagesState`, say so explicitly: "We define `XState` as our own `TypedDict` rather than using LangGraph's `MessagesState` shortcut, because…"

### Console output
- The console output block in the blog must exactly match what the runner code would print — same separator text, same order (separator → graph saving → demo queries), same line format.
- Cross-check: read the `if __name__ == "__main__"` block, trace the print statements in order, then write the output block to match.

### Concept definitions
- Define terms in a method-agnostic way. For example, a LangChain "tool" is not "a function decorated with `@tool`" — it is "a Python callable wrapped as a structured object with a name, description, and parameter schema." Do not lock a definition to one of several valid approaches.

### create_react_agent parameter name
- **Use `prompt=` not `state_modifier=`** — in LangGraph 1.1.10, `create_react_agent()` accepts `prompt` for the system message string. `state_modifier` is no longer valid and raises `TypeError`. Always use `prompt=self.system_prompt`.

### MCP client pattern (langchain-mcp-adapters ≥ 0.1.0)
- **Never use `async with MultiServerMCPClient(...) as client:`** — the context manager API was removed in 0.1.0 and raises `NotImplementedError`.
- Correct pattern: `client = MultiServerMCPClient(MCP_CONFIG)` then `tools = await client.get_tools()`.
- In long-running apps (Gradio), store as `self._client = MultiServerMCPClient(...)` to keep the reference alive. The `await asyncio.Future()` in the background thread then keeps the event loop (and client) alive indefinitely.
- Canonical source: `advanced-5-mcp-integration/app.py` and `notebot_runner.py`.

## Vector Store / Embedding Rule

**Use native `chromadb` with `SentenceTransformerEmbeddingFunction` — do not add `langchain-chroma`.**

- `langchain-chroma` is **not** in `langgraph/requirements.txt` and must not be added back. It is superseded by direct chromadb usage.
- Use `chromadb.EphemeralClient()` for in-memory stores (no persistence needed in tutorials).
- Use `chromadb.utils.embedding_functions.SentenceTransformerEmbeddingFunction(model_name=Config.EMBEDDING_MODEL)` for embeddings — default model `BAAI/bge-base-en-v1.5`.
- `Config.EMBEDDING_MODEL` reads `EMBEDDING_MODEL_NAME` from `.env`, defaulting to `"BAAI/bge-base-en-v1.5"`.
- **Never use `GoogleGenerativeAIEmbeddings`** — the `models/text-embedding-004` endpoint returns 404 in the current project environment.
- Canonical `build_vectorstore()` pattern (see `advanced-3-rag-conditional-routing/knowledge_base.py`):

```python
def build_vectorstore() -> chromadb.Collection:
    embed_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=Config.EMBEDDING_MODEL
    )
    client = chromadb.EphemeralClient()
    collection = client.get_or_create_collection(
        name="collection_name",
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    collection.upsert(
        ids=[str(i) for i in range(len(DOCUMENTS))],
        documents=[d.page_content for d in DOCUMENTS],
        metadatas=[d.metadata for d in DOCUMENTS],
    )
    return collection
```

- Query the collection directly: `collection.query(query_texts=[question], n_results=k, include=["documents", "metadatas"])`.
- Wrap results back into `langchain_core.documents.Document` objects before storing in state.

## Tool Creation Rule

**Whenever creating LangChain/LangGraph tools, always use `BaseTool` subclassing with descriptions loaded from `prompts/`.**

- **One file per tool** — place each tool in its own file inside a `tools/` package (e.g. `tools/loan_payment.py`).
- **Use `BaseTool` subclassing** — never use `@tool` decorator or `StructuredTool.from_function()` in production source code. Always define a class with `name`, `description`, `args_schema`, `_run()`, and `_arun()`.
- **Pydantic input schema** — define a `BaseModel` subclass (e.g. `LoanPaymentInput`) and set it as `args_schema`. Never rely on type-annotation inference.
- **Description from prompts/** — load `description` via `_load_prompt()`, never hardcode it inline. Each tool gets its own `.txt` file in `prompts/`.
- **`_PROMPTS_DIR` path** — since tools live in a subdirectory, use `os.path.join(os.path.dirname(__file__), "..", "prompts")`.
- **`_load_prompt` per file** — define the helper at module level in each tool file (not shared via `__init__.py` to avoid circular imports).
- **`tools/__init__.py`** — import all tool classes and export `TOOLS = [ToolA(), ToolB(), ...]`. The rest of the project uses only `from tools import TOOLS`.
- **Module-level constants** — any dict or constant the tool uses (e.g. exchange rate tables) must be module-level, not a class attribute (Pydantic would treat class-level dicts as model fields).

Canonical pattern (`tools/loan_payment.py`):
```python
import os
from typing import Type
from langchain_core.tools import BaseTool
from pydantic import BaseModel

_PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")

def _load_prompt(filename: str) -> str:
    with open(os.path.join(_PROMPTS_DIR, filename), "r") as f:
        return f.read().strip()

class LoanPaymentInput(BaseModel):
    principal: float
    annual_rate_pct: float
    months: int

class LoanPaymentTool(BaseTool):
    name: str = "calculate_loan_payment"
    description: str = _load_prompt("loan_payment.txt")
    args_schema: Type[BaseModel] = LoanPaymentInput

    def _run(self, principal: float, annual_rate_pct: float, months: int) -> str:
        ...

    async def _arun(self, principal: float, annual_rate_pct: float, months: int) -> str:
        return self._run(principal, annual_rate_pct, months)
```

## Graph Figure Rule

**Every LangGraph post must save the compiled graph as a Mermaid diagram and PNG into a `figure/` folder.**

- Add `FIGURE_DIR = os.path.join(os.path.dirname(__file__), "figure")` to `graph.py`.
- Add a `save_figure()` method to the graph class that calls `get_graph().draw_mermaid()` (saves `.mmd`) and `get_graph().draw_mermaid_png()` (saves `.png`).
- Delegate `save_figure()` from the runner class: `def save_figure(self): self.graph.save_figure()`.
- Call `runner.save_figure()` at the very start of the `if __name__ == "__main__"` block, before any demo runs.
- The console output shown in the blog must include the two `Graph saved →` lines.
- The project tree in the blog HTML must show the `figure/` folder with `graph.mmd` and `graph.png` entries.
- `figure/` is auto-created by `os.makedirs(FIGURE_DIR, exist_ok=True)` — never create it manually or commit it empty.

Use `basics-3-conditional-edges/graph.py` and `support_runner.py` as the canonical pattern.

## Blog Graph Diagram Rule

**Every LangGraph blog post must include an inline colorful Mermaid diagram** in a dedicated subsection (e.g. 7.1 or 8.5 "Graph Diagram") — never a static image, never a plain ASCII tree.

### Required setup
- Add to the sidebar TOC and inline TOC: `<li class="toc-sidebar-sub"><a href="#graph-diagram">N.1 Graph Diagram</a></li>`
- Add Mermaid scripts before `</body>`:
```html
<script src="../js/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'default' });</script>
```

### Diagram HTML pattern
Always wrap the diagram with the `.blg-mermaid-wrap` class — **never use inline `style="display:flex;..."`**. The CSS class handles centering on desktop and horizontal scrolling on mobile:
```html
<div class="blg-mermaid-wrap">
  <div class="mermaid" style="min-width:460px;font-size:16px;">
flowchart TD
    S([__start__]) --> nodeA["node A"]
    nodeA --> nodeB["node B"]
    nodeB --> S2([__end__])

    style S    fill:#e8f5e9,stroke:#43a047,color:#1b5e20
    style S2   fill:#fce4ec,stroke:#e53935,color:#b71c1c
    style nodeA fill:#e3f2fd,stroke:#1e88e5,color:#0d47a1
    style nodeB fill:#fff3e0,stroke:#fb8c00,color:#e65100
  </div>
</div>
```
The `.blg-mermaid-wrap` class is defined in `css/style.css` and applies `overflow-x: auto` so diagrams scroll horizontally on small screens instead of clipping.

### Node colour palette (use in order, cycling if more nodes needed)
| Role | Fill | Stroke | Text |
|------|------|--------|------|
| `__start__` | `#e8f5e9` | `#43a047` | `#1b5e20` |
| `__end__` | `#fce4ec` | `#e53935` | `#b71c1c` |
| Primary nodes (agent, generate, main) | `#e3f2fd` | `#1e88e5` | `#0d47a1` |
| Secondary nodes (tools, grade, rewrite) | `#fff3e0` | `#fb8c00` | `#e65100` |
| Tertiary nodes (fallback, supervisor) | `#f3e5f5` | `#8e24aa` | `#4a148c` |
| Quaternary nodes (extra) | `#e8f5e9` | `#388e3c` | `#1b5e20` |

### Node label convention
- Use the actual compiled node names (`__start__`, `__end__`, `agent`, `tools`, etc.) — exactly as LangGraph generates them.
- Add a short human label in the node box when it helps: `agent["🤖 agent\nLLM with bound tools"]`.

Use `blogs/blog_17.html` Section 7.1 as the canonical example.

## Prompts Folder Rule

**Every LLM prompt must live in a `prompts/` subfolder as a plain `.txt` file — never hardcoded as a Python string inside a node function.**

- Create one `.txt` file per node (e.g. `prompts/study_buddy.txt`, `prompts/classify.txt`).
- Load it in `__init__` with a `_load_prompt(filename)` helper function (see `basics-3-conditional-edges/nodes.py` as the canonical pattern).
- Prompt files may use `{variable}` placeholders filled with `.format()` at call time.
- The project tree in the blog HTML must always show the `prompts/` folder and each `.txt` file with a comment.
- The nodes.py code walkthrough in the blog must show the file-loading pattern, not an inline string.
- **Tool descriptions also count as prompts.** When using `BaseTool` subclasses, load `description` from a `.txt` file in `prompts/` using `_load_prompt()` — never hardcode it as an inline string. Each tool gets its own file (e.g. `prompts/loan_payment.txt`). Use `_PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")` when the tool file is inside a subdirectory (e.g. `tools/`).

This rule applies to every LangGraph post and any other post that uses LLM prompts. Separation keeps prompt tuning independent of code changes.

## Real-World Scenario Rule

**Every blog post must be anchored to one concrete real-world scenario introduced in Section 1 and carried through to the complete example and web UI.**

- Pick a scenario a non-technical reader can picture immediately (e.g. "a student asking follow-up questions to an AI tutor", "a customer support bot that routes complaints").
- Introduce the scenario by name in the intro paragraph and explain *why* the concept being taught is necessary for that scenario.
- All abstract concepts (nodes, reducers, checkpointers, etc.) must be explained using that scenario as the running analogy before any code is shown.
- The complete example section must implement that exact scenario — not a generic placeholder.
- Source code file names, variable names, function names, and class names must reflect the scenario (e.g. `study_runner.py`, `StudyState`, not `runner.py`, `MyState`).
- The Gradio web UI must also wrap the same scenario — same runner class, same thread behaviour.
- The download card and GitHub repo name must reference the scenario.

**How to choose a scenario:**
- It must require the concept being taught (e.g. a multi-turn chatbot *needs* checkpointers; a content pipeline *needs* reducers).
- Prefer domains that are universally relatable: education, customer support, travel, personal productivity, content creation.
- Avoid toy examples ("foo/bar", "node_a/node_b") — every identifier should mean something.

**Scenarios used (do not repeat):**
| Blog | Scenario |
|------|---------|
| blog_8 | Simple Q&A Bot |
| blog_9 | Topic Expander |
| blog_10 | Customer Support Router |
| blog_11 | Personal Study Buddy |
| blog_12 | Personal Finance Assistant |
| blog_13 | AI Travel Planner |
| blog_14 | Personal Recipe Assistant |
| blog_15 | AI Personal Wellness Coach |
| blog_16 | AI Company Onboarding Assistant (OnboardBot) |
| blog_17 | AI Real Estate Advisor (HomeBot) |
| blog_18 | AI Smart Notes Assistant (NoteBot) |

## Conclusion Section Rule

**Every LangGraph blog post must have a Conclusion section** as the last `blg-section` before the trailing section (Tech Stacks + Download + References).

- Anchor: `<a id="conclusion" class="blg-anchor"></a>`
- Header: `<h2>✅ N. Conclusion</h2>` where N is the next section number.
- Add to both sidebar TOC: `<li><a href="#conclusion">N. Conclusion</a></li>` and inline TOC.
- Content structure (follow blog_15 / blog_16 / blog_17 as canonical examples):
  1. One paragraph summarising what was built and why it matters.
  2. One paragraph on how the pattern scales / extends.
  3. A `blg-ul` list of 5 key takeaways using `blg-li-check`.
  4. A `blg-callout-purple` that links the full series — where this post sits and what comes next (or "series complete" for Part 5).

## Download Card Rule

**The download card description must never list individual file names.**

- Wrong: `Full project — config.py, llm.py, state.py, nodes.py, graph.py, runner.py, app.py`
- Correct: brief, human-readable description of what's included, e.g.:
  - `Full project — HomeBot source code, all 5 financial tools, prompt files, and Gradio web UI.`
  - `Full project — NoteBot source code, MCP server, sample notes, and system prompt.`
- The GitHub link already points to the folder where all files are visible.

**GitHub source code repo for all LangGraph posts:**
```
https://github.com/shafiqul-islam-sumon/langgraph/tree/main/<folder-name>
```
- Basics: `basics-N-<folder-name>` (e.g. `basics-3-conditional-edges`)
- Advanced: `advanced-N-<folder-name>` (e.g. `advanced-4-react-agent-tool-calling`)
- Never use `shafiqulai/shafiqulai.github.io` as the repo — that is the blog site repo, not the source code repo.

## CSS Conventions

- Never use inline styles — all styling via CSS classes in `css/style.css`
- Use `var(--primary)`, `var(--text)`, etc. — never hardcode hex colors
- `.blg-tree` comments aligned with spaces (not CSS margin); rule: `max(pipe+name) + 6`
- **`overflow-x: clip` on html/body — never revert to `hidden`.**
  `hidden` makes `body` the scroll container in Chrome, breaking `position: sticky`.
- **`.blg-table` must always be a `<div>` wrapper, never a class on `<table>` itself.**
  Correct: `<div class="blg-table"><table>…</table></div>`.
  Wrong: `<table class="blg-table">`. The `overflow-x: auto` mobile scroll rule only works on a block container, not on `<table>`.
- **All callout elements must be `<blockquote>`, never `<div>`.**
  Correct: `<blockquote class="blg-callout-info">…</blockquote>`.
  Wrong: `<div class="blg-callout-info">…</div>`. Using `<div>` breaks the semantic meaning and may affect styling.
- **`.blg-tree` must never be combined with `.blg-code-block` or `data-lang`.**
  Correct: `<div class="blg-tree">…</div>`.
  Wrong: `<div class="blg-code-block blg-tree" data-lang="bash">…</div>`. Adding `blg-code-block` causes `code-highlight.js` to attempt wrapping the tree in `<pre><code>`, corrupting the tree span structure.
- **Never change version numbers in blog HTML code blocks.** Package versions (e.g. in `requirements.txt` blocks) are maintained manually by the author. Only fix which packages appear — never touch version strings.

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
