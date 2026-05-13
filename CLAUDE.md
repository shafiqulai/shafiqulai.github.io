# shafiqulai.github.io — Claude Context

Personal engineering blog by **Md Shafiqul Islam** (AI Engineer / LLM Specialist / Python Developer).
Topics: LLMs, RAG, AI Agents, LangChain, Docker, Hugging Face, OpenAI, Streamlit, Gradio.
11 blog posts published (`blog_1.html` through `blog_11.html`), hosted on GitHub Pages.

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
│   └── blog_1.html … blog_11.html # Blog detail pages (no template file)
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

The folder README must cover:
- Brief description of what the part teaches
- Key concepts table
- Graph architecture — ASCII diagram + Mermaid code block
- Annotated project structure tree (one-line description per file)
- Key code snippets with explanations
- How to run (console runner + Gradio web UI)
- Series navigation (← prev | **you are here** | next →)
- Link to the blog post at the very top

**Also update `langgraph/README.md`** whenever a new folder README is added:
- Add the new part to the series table with a `README →` link column entry
- Add a short summary paragraph for the new part with a `→ Full details` link
- Update the project structure tree and "Running a Project" section

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
- Use `gr.Blocks` as the outer container when you need extra widgets (e.g. a "New Session" button). Use bare `gr.ChatInterface` only when no extra widgets are needed.
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

## CSS Conventions

- Never use inline styles — all styling via CSS classes in `css/style.css`
- Use `var(--primary)`, `var(--text)`, etc. — never hardcode hex colors
- `.blg-tree` comments aligned with spaces (not CSS margin); rule: `max(pipe+name) + 6`
- **`overflow-x: clip` on html/body — never revert to `hidden`.**
  `hidden` makes `body` the scroll container in Chrome, breaking `position: sticky`.
- **`.blg-table` must always be a `<div>` wrapper, never a class on `<table>` itself.**
  Correct: `<div class="blg-table"><table>…</table></div>`.
  Wrong: `<table class="blg-table">`. The `overflow-x: auto` mobile scroll rule only works on a block container, not on `<table>`.

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
