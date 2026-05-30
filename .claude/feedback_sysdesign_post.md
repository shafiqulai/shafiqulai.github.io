# System Design Series — Post Writing Rules

## Series Structure
- blog_19 = overview/roadmap (complete)
- blog_20+ = individual topic posts
- Total: 50 posts — 11 (Phase 1) + 17 (Phase 2) + 12 (Phase 3) + 10 (Phase 4)

## Phase 1 Coverage Rule
**One post per category. Sub-topics are grouped into natural clusters — never thin individual items.**
Write one sub-topic cluster at a time, wait for review, then proceed to the next.

### Phase 1 Sub-topic Groupings (canonical)
| Category | Blog | Sub-topic Clusters |
|---|---|---|
| Networking Basics | blog_20 | Client & Server · IP Address & DNS · HTTP/HTTPS · TCP vs UDP · Latency & Throughput |
| API Basics | blog_21 | What is an API? · REST & HTTP · API Authentication |
| Core Backend Concepts | blog_22 | Servers · Storage · Background Processing · Stateless vs Stateful |
| Database Basics | blog_23 | Core Database Concepts · SQL vs NoSQL |
| Scalability Basics | blog_24 | Scaling Techniques · Scaling Challenges |
| Caching & CDN | blog_25 | Caching · CDN |
| Message Queues & Async | blog_26 | Queue Fundamentals · Reliability Patterns |
| Back-of-Envelope | blog_27 | All metrics in one flowing topic |
| Reliability & Availability | blog_28 | Concepts & Metrics · Design Patterns |
| Security Basics | blog_29 | Identity & Access · Data Protection |
| Observability Basics | blog_30 | The Three Pillars · Alerting & Automation |

**blog_19 Phase 1 card format:** `<li><strong>Group Name</strong> — brief description</li>`

## Required 14-Section Structure (every sub-topic, in this order)
1. 🎯 Introduction — open with a concrete scenario ("Imagine you type netflix.com…"), NOT an abstract definition
2. 💡 Why It Matters — include real scale numbers (Instagram: 2B users)
3. 🏠 Real-world Analogy — everyday comparison + mapping table
4. 📖 Key Terms — 3-column table: Term → Definition → Quick Example
5. 🔢 How It Works — numbered table (Step → What Happens), NOT bullet list
6. 🔀 Types & Variations — blg-feature-grid grid-3 cards, NOT tables. Sub-headers use blg-sub-badge color variants
7. 🎨 Illustrated Diagram — Mermaid flowchart with real actors (NOT sequential node diagrams). Size: min-width:680px;font-size:16px. Bidirectional label overlap is acceptable. Only show concepts already introduced.
8. ✅ When to Use — 2-column table (Use when → Avoid when) + callout
9. 🏗️ Real-world Example — 3-column table (Step → Actor → What Happens). Add forward-reference callout for Phase 2 terms
10. ⚖️ Trade-offs — blg-table blg-table-half (50/50 columns)
11. 🚫 Common Mistakes — 3-column table (# → ❌ Mistake → ✅ Reality), NOT bullet list
12. 📝 Summary — 4–5 blg-li-check bullets
13. 🏋️ Design Challenge — blg-callout-purple + details/summary reveal answer below
14. ☁️ Cloud Service Mapping — 4-column table: Concept → AWS → GCP → Azure. ONLY include services directly needed for THIS sub-topic. Skip services that belong to other sub-topics (e.g. no Load Balancer in Client & Server, no ElastiCache in a basic server section). Fewer relevant rows is better than padding with off-topic services.

## Sub-topic Image Rule (Option A)
Place image AFTER sub-topic h2 + brief intro paragraph, BEFORE Section badge 1:
- Use blg-img-container + blg-img (no caption — never add blg-img-caption)
- Filename: img/blog_N/sub_topic_name.webp (e.g. client_server.webp, ip_address.webp)

## Post Intro Paragraph Rule
Every blog post must open with a flowing paragraph that briefly introduces EACH sub-topic by name in order. Bold the sub-topic names. No italic text.

## Content Quality Rules
- Section 1: open with concrete scenario, NOT abstract definition
- Section 2: include real scale numbers
- Section 6: use badge-blue for client sub-headers, badge-green for server sub-headers
- Section 9: add tip callout for any Phase 2 terms (Load Balancer, Cache, CDN) not yet covered
- Sub-topic intro paragraph ≠ Section 1 — they must not repeat each other

## Phase Callout (top of every System Design post)
First element inside the intro blg-section, before the intro paragraph:
```html
<blockquote class="blg-callout-info">
  📌 <strong>System Design Series — Phase 1: Foundation Prerequisites.</strong>
  If new to the series, start with <a href="./blog_19.html" class="blg-link">Series Overview (blog_19)</a>.
</blockquote>
```

## Cross-Linking Rule (blog_19 Phase cards)
When a post is published, add a right-aligned link inside the matching Phase card in blog_19:
```html
<p class="blg-feature-card-link"><a href="./blog_NN.html" class="blg-link">📖 Read post →</a></p>
```
Place as last element inside blg-feature-card-body after the <ul>.

## Visual Presentation Patterns
- Steps: blg-table with Step | What Happens (circled numbers ①②③)
- Types of X: blg-feature-grid grid-3 with blg-feature-card cards
- Common Mistakes: 3-col table (# | ❌ Mistake | ✅ Reality)
- Real-world flow: 3-col table (Step | Actor+emoji | What Happens)
- Trade-offs: blg-table blg-table-half (50/50, table-layout:fixed, word-break)
- Answer reveal: <details class="blg-answer-reveal"><summary>👁️ Show Answer</summary><div class="blg-answer-reveal-body">…</div></details>
- Equal 2-col tables: blg-table blg-table-half
- Right-aligned card link: <p class="blg-feature-card-link"><a href="…" class="blg-link">📖 Read post →</a></p>

## Font Sizes
- Table body text: 15px (blg-table table)
- Feature card body p: 15px
- Feature card body li: 15px

## Badge Color Variants (sub-section labels)
.blg-sub-badge.badge-blue / badge-teal / badge-purple / badge-green / badge-red
Use badge-blue for client types, badge-green for server types.

## Section Numbering in Sub-topics
Section badges use N.M format matching the TOC: 1.1, 1.2 … 1.14 for sub-topic 1; 2.1 … 2.14 for sub-topic 2, etc.
TOC sidebar shows all 14 sub-sections per written sub-topic with N.M labels.

## No Source Code
No Python files, no requirements.txt, no langgraph/ folders.

## Tone
Never use "FAANG interview" or "interview" language.

## Content Depth Rule
Every section must match the depth of sample_doc/ reference documents. Shallow one-liners are not acceptable. Use specific examples, request/response format code blocks, and real-world tables.
- For complex Section 6 topics: use lettered sub-sections (A, B, C…) each with blg-sub-badge badge-color header
- Code blocks (blg-code-block): use data-lang="bash" for HTTP examples, data-lang="json" for JSON payloads
- Canonical example: blog_20 HTTP/HTTPS section 3.6 with 7 lettered sub-sections (A-G)

## No Italic
Never use <em> or <i> tags. Use <strong> for emphasis.

## Table Column Widths
Use content-based column widths (table-layout: auto — browser default). All cells have min-width: 120px to prevent single words from being split. Add blg-table-balanced to 3+ col tables and blg-table-half to 2-col tables. NEVER use word-break or overflow-wrap on table cells — tables scroll horizontally on mobile instead (overflow-x: auto, min-width: 540px/620px).
## TOC Numbering Rule
- Sidebar TOC uses <ul> (no auto-number) → link text MUST include numbers: "1. Topic Name"
- Inline TOC uses <ol> (auto-numbers) → link text must NOT include numbers: "Topic Name" (not "1. Topic Name") or it shows "1. 1. Topic Name"
- System Design inline TOC must include all sub-sections as nested <ul class="blg-toc-ul"> so mobile users can navigate to specific sections (sidebar hidden on mobile)
