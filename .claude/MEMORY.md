# Project Memory

## Python Code Style
Always use OOP (Object-Oriented Programming) when writing Python code. Every implementation must be structured as a class, not as standalone functions or procedural scripts.

## LangGraph Python Conventions

**GitHub repo:** `https://github.com/shafiqul-islam-sumon/langgraph/tree/main`
**Gemini model:** `gemini-3-flash-preview` (set via `GEMINI_MODEL_NAME` in `.env`)

**File structure for each series entry:**
- `config.py` — loads `.env` with `python-dotenv`, defines `Config` class with model settings
- `llm.py` — imports `Config`, defines `GeminiLLM` wrapping `ChatGoogleGenerativeAI`
- `state.py` — defines state as `TypedDict`
- `nodes.py` — imports `GeminiLLM` from `llm.py`, defines node class with node methods
- `graph.py` — builds and compiles the `StateGraph`, exposes compiled graph
- `qa_runner.py` — entry point, contains `QARunner`, imports graph and runs demo
- `app.py` — Gradio `ChatInterface` wrapping `QARunner` from `qa_runner.py`
- `.env` and `requirements.txt` live in the parent `langgraph/` folder, not per-series

**Node return type:**
LangGraph nodes return a **partial state update** — only the keys that changed, not the full state.
Use `-> dict` not `-> StateType`. Annotating `-> QAState` implies returning the full state, which is misleading.

**Naming conventions:**
- Variable holding compiled graph: `self.compiled_graph` (not `self.app`)
- Method exposing compiled graph: `get_compiled_graph()` (not `get_app()`)
- Private build method: `_build()` (called once in `__init__`)

**invoke() ownership:**
`invoke()` belongs to `CompiledStateGraph` (a LangChain `Runnable`), not to the `QAGraph` wrapper class.
`graph.compile()` returns the `CompiledStateGraph`. Store it as `self.compiled_graph`, expose it via `get_compiled_graph()`.
The runner (`QARunner`) calls `.invoke()` on the compiled graph — never on `QAGraph` or `StateGraph`.
Object chain: `_build()` → `graph.compile()` → `CompiledStateGraph` stored in `self.compiled_graph` → exposed via `get_compiled_graph()` → `QARunner.self.app` → `self.app.invoke()`.

**Node registry — how edges resolve to functions:**
`graph.add_node("answer", self.nodes.answer_node)` registers a string name → callable mapping.
`graph.add_edge(START, "answer")` references the string name, not the function directly.
When `invoke()` runs, the engine resolves the string `"answer"` to `answer_node` through this registry and calls it.
The string in `add_node()` and `add_edge()` must match exactly — that is what connects edges to functions.

**langchain-google-genai 4.x response.content:**
Returns a list of dicts `[{"type": "text", "text": "...", ...}]` instead of a plain string.
Always handle both formats in node functions with an `isinstance(content, list)` check.

## Mermaid Diagrams in Blog
- Use local `js/mermaid.min.js` — do not use CDN
- Add two script tags at the bottom with the other JS libs (after `detail.js`):
  ```html
  <script src="../js/mermaid.min.js"></script>
  <script>mermaid.initialize({ startOnLoad: true, theme: 'default' });</script>
  ```
- Embed diagrams as `<pre class="mermaid">` inside `.blg-mermaid-container` inside `.blg-img-container`
- Add a `.blg-img-caption` below the diagram
- No separate Mermaid CSS needed — it renders to inline SVG

## Installation & Setup Section (LangGraph series posts)
Every LangGraph blog post's Installation & Setup section must include in this order:
1. **Python version** — state 3.12 explicitly, include `python --version` command
2. **Virtual environment** — create with `python -m venv langgraph`, show activation for both macOS/Linux and Windows
3. **requirements.txt** — show the full file content as a `properties` code block, then `pip install -r requirements.txt`
4. **Gemini API key** — get from Google AI Studio, show `.env` file contents, warn about `.gitignore`

Never just show `pip install package1 package2` — always use requirements.txt as the canonical install method.

## Blog Writing Style
Blog posts must be beginner-friendly and easy to understand. Write for someone intelligent but new to the topic.
- Define every technical term on first use
- Use enough concrete examples to explain complex concepts — don't just describe, show
- Explain code blocks line by line or section by section, not just dump code
- Smooth transitions between sections — reader should never feel lost
- Vary sentence length, use contractions occasionally
- Avoid AI filler: "It is worth noting", "In conclusion", "Delve into", "As we can see"
- Use meaningful emojis in headers and callouts where they add clarity
- Cover the topic fully — don't skip steps

## posts.json Description Guidelines
The description shown on the homepage card must be descriptive and natural — not a feature list and never a teaching tone.
- Write 3–5 sentences
- First sentence: briefly say what the subject/technology is — give context before diving into components
- Second sentence: describe what the post covers (components, examples, demo) — factually, not as a promise to the reader
- **Never use instructional/teaching tone:** no "lets you", "you'll learn", "we'll walk through", "by the end you'll", "this guide walks you", "learn how to"
- Tone should feel like a neutral summary, not a pitch or a lesson
- Read it aloud — if it sounds like a teacher or a brochure, rewrite it

## Table of Contents Guidelines
Always propose a TOC and get user approval before writing any blog post.

**Structure rules:**
- Add sub-sections (1.1, 1.2 etc.) only when a section has genuinely distinct parts — concept vs code, or two clearly different ideas
- Do NOT add sub-sections just to fill space or for single-step content (e.g. a simple pip install does not need 2.1/2.2)
- Each TOC entry must have a clear, plain-English description of what it covers — not vague labels
- Keep section titles intuitive: a reader should understand what they'll learn just from the title

**TOC table format (for LangGraph.md tracking):**
| # | Section | What it covers | Status |
- Use ⬜ for pending, 🔄 for in progress, ✅ for done
- Store each blog's TOC under its entry in LangGraph.md
