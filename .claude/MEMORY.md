# Project Memory

## Python Code Style
Always use OOP (Object-Oriented Programming) when writing Python code. Every implementation must be structured as a class, not as standalone functions or procedural scripts.

## LangGraph Python Conventions

**GitHub repo:** `https://github.com/shafiqul-islam-sumon/langgraph/tree/main`
**Gemini model:** `gemini-3-flash-preview` (set via `GEMINI_MODEL_NAME` in `.env`)

**File structure for each series entry:**
- `config.py` — loads `.env` with `python-dotenv`, defines `Config` class with model settings
- `llm.py` — imports `Config`, defines `GeminiLLM` wrapping `ChatGoogleGenerativeAI`
- `state.py` — defines state as `TypedDict` (with `Annotated` fields where accumulation is needed)
- `nodes.py` — imports `GeminiLLM` from `llm.py`, defines node class with node methods; loads prompt templates from `prompts/` in `__init__`
- `prompts/` — subfolder with one `.txt` file per node; templates use `{placeholder}` syntax, filled with `.format()` at runtime
- `graph.py` — builds and compiles the `StateGraph`, exposes compiled graph
- `<app_name>_runner.py` — entry point named after the app (e.g. `qa_runner.py`, `topic_runner.py`), contains runner class, imports graph and runs demo
- `app.py` — Gradio web UI wrapping the runner; use `gr.ChatInterface` inside `gr.Blocks` for posts that need a "New Session" button
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
Returns a list of dicts `[{"type": "text", "text": "...", "extras": {...}}]` instead of a plain string.
Handle both formats everywhere content is read — node functions, runner `chat()`, runner `stream_chat()`, and any console preview:
```python
if isinstance(content, list):
    return "".join(b.get("text","") for b in content if isinstance(b,dict) and b.get("type")=="text")
```
For `stream_chat()`, check each chunk with `if not hasattr(chunk, "content"): continue` before reading content.

## Gradio ChatInterface Conventions (LangGraph series)

**`theme` argument not supported:** Never pass `theme=gr.themes.Soft()` (or any theme) to `gr.ChatInterface` — it raises `TypeError: unexpected keyword argument 'theme'`. Remove it entirely; the default theme is fine.

**Streaming:** `gr.ChatInterface` generator functions must `yield` the **full accumulated response so far** on each iteration — not individual tokens. Gradio replaces the bot message with the last yielded value.
```python
accumulated = ""
for token in self.runner.stream_chat(message, thread_id):
    accumulated += token
    yield accumulated
```

**New Session button:** Wrap `gr.ChatInterface` in `gr.Blocks`. Use `gr.ClearButton([chat.chatbot, chat.textbox], value="🔄 New Session", variant="primary")` to reset the visual history, then chain `.click(fn=lambda: str(uuid.uuid4()), outputs=[thread_state])` to also reset the LangGraph thread.

**Thread isolation:** Pass `gr.State(value=str(uuid.uuid4()))` as `additional_inputs` to `gr.ChatInterface`. Initialise with a UUID (not `""`) so the first message already has a valid thread_id.

**Empty message guard:** Use `yield ""; return` (not bare `return`) — a generator that returns before its first yield raises `RuntimeError` in Gradio's async wrapper.

## Prompts Folder Convention (LangGraph series)
Prompt text lives in `prompts/` subfolder — one `.txt` file per node function.

- Load all prompts once in `__init__` (not on every node call): `self.expand_prompt = _load_prompt("expand_node.txt")`
- Use `str.format()` to fill placeholders at runtime: `self.expand_prompt.format(topic=state["topic"])`
- Prompt files use `{placeholder}` syntax (same as Python's `str.format`)
- Module-level helper: `_load_prompt(filename)` reads from `os.path.join(os.path.dirname(__file__), "prompts", filename)`
- Benefit: prompts are editable without touching code; cleaner node methods

## Node Output Tagging Convention
When a graph has multiple nodes writing to the same Annotated field, prefix each item with `[NodeName]` so the output clearly shows which node produced which item.

Example: `expand_node` returns `[f"[Expand] {line}" for line in lines]` and `refine_node` returns `[f"[Refine] {line}" for line in lines]`.

This makes the reducer's accumulation effect visually obvious in console output and blog examples.

## Mermaid Diagrams in Blog
- **Every LangGraph series post must include a Mermaid graph diagram** showing the graph structure (nodes and edges). Place it in the Running & Output section (or equivalent), after the console output.
- Use local `js/mermaid.min.js` — do not use CDN
- Add two script tags at the bottom with the other JS libs (after `detail.js`):
  ```html
  <script src="../js/mermaid.min.js"></script>
  <script>mermaid.initialize({ startOnLoad: true, theme: 'default' });</script>
  ```
- Embed diagrams as `<pre class="mermaid">` inside `.blg-mermaid-container` inside `.blg-img-container`
- Add a `.blg-img-caption` below the diagram
- No separate Mermaid CSS needed — it renders to inline SVG

## HTML Structure Rules

**`.blg-table` must be a `<div>` wrapper, never a class on `<table>`.**
- Correct: `<div class="blg-table"><table>…</table></div>`
- Wrong: `<table class="blg-table">`
- Reason: `overflow-x: auto` (mobile scroll) only works on a block container. Putting it on `<table>` has no effect, causing content to be clipped on mobile.

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

## LangGraph Basics Series — Complete (blog_8–13)

All 6 posts in the Basics series are done. Scenarios used (do not repeat in Series 2):
- blog_8: Simple Q&A Bot (StateGraph, nodes, edges)
- blog_9: Topic Expander (state, Annotated, reducers)
- blog_10: Customer Support Router (conditional edges, routing)
- blog_11: Personal Study Buddy (checkpointers, memory, streaming)
- blog_12: Personal Finance Assistant (tools, ToolNode, create_react_agent)
- blog_13: AI Travel Planner (subgraphs, interrupt(), Human-in-the-Loop)

## Subgraph & HITL Conventions (established in blog_13)

**Subgraphs:**
- Compile the subgraph once in `__init__`, store as `self.compiled`, expose via `get_compiled()`.
- Subgraph has its own `TypedDict` state — keys never shared directly with parent state.
- Parent node calls `self.subgraph.invoke({...})` and explicitly maps result keys back into parent state.
- Subgraph does NOT need a checkpointer — only the parent graph needs one for HITL.

**Human-in-the-Loop:**
- `from langgraph.types import interrupt` — call `interrupt(payload)` inside a node to pause execution.
- `from langgraph.types import Command` — call `app.invoke(Command(resume=value), config=config)` to resume.
- The same `thread_id` must be passed in `config` for both the initial invoke and every resume call.
- `MemorySaver` (or any checkpointer) is **required** — without it `interrupt()` cannot persist the paused state.
- Approved keywords set: `{"approved", "approve", "yes", "ok", "looks good", "great", "perfect"}`.
- Runner exposes two methods: `start_planning(request, thread_id)` and `resume(feedback, thread_id)`.

## LangGraph Advanced Series — Conventions (blog_14–18)

**Advanced series scenarios used (do not repeat):**
- blog_14: Personal Recipe Assistant (messages + summary, RemoveMessage, SqliteSaver, streaming)
- blog_15: AI Personal Wellness Coach (multi-agent supervisor, structured output, MemorySaver)
- blog_16: AI Company Onboarding Assistant — OnboardBot (RAG pipeline, Chroma, grade_documents, rewrite_query, retry loop, fallback, no checkpointer)
- blog_17: AI Real Estate Advisor — HomeBot (ReAct agent, 5 BaseTool subclasses, ToolNode, tools_condition, MemorySaver, Gradio gr.Blocks with thread_id)
- blog_18: AI Smart Notes Assistant — NoteBot (MCP, FastMCP, MultiServerMCPClient, create_react_agent, background asyncio thread for persistent MCP connection in Gradio)

### Multi-Agent Supervisor Pattern (established in blog_15)

**State:** `TypedDict` with `messages: Annotated[list[BaseMessage], add_messages]` plus a routing field `next_agent: str` (last-write-wins, no reducer). Supervisor writes only to `next_agent`; specialists write only to `messages`.

**SupervisorDecision schema:**
```python
from typing import Literal
from pydantic import BaseModel

class SupervisorDecision(BaseModel):
    next_agent: Literal["agent_a", "agent_b", ..., "FINISH"]
    reasoning:  str
```
Always use `Literal` to enumerate every valid destination — prevents hallucinated node names.

**Structured output binding:**
```python
self.supervisor_llm = self.llm.with_structured_output(SupervisorDecision)
```

**Supervisor node — never adds messages, only updates `next_agent`:**
```python
def supervisor_node(self, state) -> dict:
    messages = [SystemMessage(content=self.supervisor_prompt)] + list(state["messages"])
    decision = self.supervisor_llm.invoke(messages)
    return {"next_agent": decision.next_agent}
```

**Route function:**
```python
def route_by_agent(state) -> str:
    return state.get("next_agent", "FINISH")
```

**Graph wiring — the supervisor loop:**
```python
graph.add_edge(START, "supervisor")
graph.add_conditional_edges("supervisor", route_by_agent, {"agent_a": "agent_a", ..., "FINISH": END})
graph.add_edge("agent_a", "supervisor")   # return edges create the loop
graph.add_edge("agent_b", "supervisor")
```

**Runner `chat()` — collect all new AI messages from one invocation:**
```python
def chat(self, message, thread_id) -> str:
    state_before = self.app.get_state(config)
    count_before = len(state_before.values.get("messages", [])) if state_before.values else 0
    self.app.invoke({"messages": [HumanMessage(content=message)]}, config=config)
    state_after = self.app.get_state(config)
    new_ai = [m for m in state_after.values.get("messages", [])[count_before:] if m.type == "ai"]
    return "\n\n".join(_extract_text(m.content) for m in new_ai)
```

**Gradio app for multi-agent:** Use a regular function (not a generator/yield) — streaming is complex with multiple sequential LLM calls. `respond()` returns a string, not a generator.

**Checkpointer:** Use `MemorySaver()` (in-process, session-scoped) rather than `SqliteSaver` when cross-restart persistence is not needed. Pass to `graph.compile(checkpointer=MemorySaver())`.

**Specialist agent persona prefix:** Each specialist prompt instructs the agent to start every response with a branded emoji prefix (e.g. `🥦 **Nutrition Coach:**`). This makes multi-specialist responses readable when joined.

## Blog HTML Writing Rule Update (from blog_13 experience)

Stream stalls occur when Claude generates large HTML blocks in one turn. The safe pattern:
1. Write skeleton only (head + shell + `<!-- SECTION N PLACEHOLDER -->` comments) — one small Write call.
2. Edit in each section one at a time — one `Edit` per `<div class="blg-section">` block.
3. Replace `<!-- TRAILING PLACEHOLDER -->` with Tech Stacks + Download + References last.
This prevents any single generation from exceeding ~3 KB before a tool call.
