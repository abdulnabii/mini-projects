# Day 02 — Real-Time Code Review Bot

## 🗓️ Day: 2 of 30
## 🏷️ Category: Developer Tools / AI Automation
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 5–7 hours

---

## 📌 Project Overview

A web-based code review tool where developers paste any code snippet and receive instant, structured AI feedback — covering bugs, security vulnerabilities, performance issues, code style, and refactoring suggestions. Supports 20+ programming languages and outputs actionable line-by-line comments exactly like a senior engineer's pull request review.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Multi-Language Support | Python, JS, TS, Go, Rust, Java, C++, SQL, etc. |
| Auto Language Detection | Detects language from code automatically |
| Bug Detection | Identifies logic errors and runtime risks |
| Security Scanner | Flags SQL injection, XSS, hardcoded secrets |
| Performance Analyzer | Spots O(n²) loops, memory leaks, N+1 queries |
| Code Style Review | Enforces naming conventions, clean code principles |
| Refactoring Suggestions | Shows improved version side-by-side |
| Severity Badges | 🔴 Critical / 🟠 Major / 🟡 Minor / 🟢 Info |
| Copy Fixed Code | One-click copy of corrected snippet |
| Shareable Link | Generate shareable review URL |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Monaco Editor (VS Code editor in browser)
- **AI**: Google Gemini 1.5 Pro
- **Syntax Highlighting**: Prism.js
- **Diff View**: react-diff-viewer
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `detectLanguage(code: string): Language`
Uses regex heuristics + AI to identify programming language from code content.

### `reviewCode(code: string, language: Language): Promise<ReviewResult>`
Sends code to Gemini with a structured system prompt. Returns array of `CodeIssue` objects with line numbers, severity, description, and fix.

### `generateDiff(original: string, fixed: string): DiffResult`
Produces unified diff between original and AI-suggested fixed version for side-by-side view.

### `calculateCodeScore(issues: CodeIssue[]): number`
Computes a 0–100 quality score based on count and severity of detected issues.

### `formatReviewAsMarkdown(result: ReviewResult): string`
Formats the full review as copy-pasteable Markdown for GitHub PR comments.

---

## 📁 File Structure

```
code-review-bot/
├── app/
│   ├── page.tsx              # Landing page + editor
│   └── api/review/route.ts   # Gemini API route
├── components/
│   ├── CodeEditor.tsx        # Monaco editor wrapper
│   ├── ReviewPanel.tsx       # Issues list panel
│   ├── IssueBadge.tsx        # Severity badge component
│   ├── DiffViewer.tsx        # Side-by-side diff
│   └── ScoreGauge.tsx        # Quality score gauge
└── lib/
    ├── gemini.ts
    └── language-detect.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are an elite senior software engineer performing a thorough code review.
Analyze the following {language} code and return a JSON review.

Review checklist:
- Bugs & logic errors (check for off-by-one, null dereference, race conditions)
- Security vulnerabilities (SQL injection, XSS, SSRF, hardcoded secrets, insecure deserialization)
- Performance issues (unnecessary loops, memory leaks, blocking I/O)
- Code quality (naming, DRY principle, SOLID, dead code)
- Best practices for {language} specifically

Output ONLY valid JSON:
{
  "score": 73,
  "language": "python",
  "summary": "Code has 2 critical security issues and 3 performance concerns",
  "issues": [
    {
      "line": 14,
      "severity": "CRITICAL",
      "category": "Security",
      "title": "SQL Injection Vulnerability",
      "description": "User input directly concatenated into SQL query",
      "fix": "Use parameterized queries: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))"
    }
  ],
  "fixedCode": "...complete corrected code here..."
}

CODE TO REVIEW:
def get_user(user_id):
    query = "SELECT * FROM users WHERE id = " + user_id
    cursor.execute(query)
    return cursor.fetchone()
```

---

## 📤 Expected Output (Result)

```json
{
  "score": 28,
  "language": "python",
  "summary": "Critical security vulnerability detected. This code is unsafe for production.",
  "issues": [
    {
      "line": 2,
      "severity": "CRITICAL",
      "category": "Security",
      "title": "SQL Injection Vulnerability",
      "description": "Direct string concatenation of user_id into SQL query allows attackers to inject malicious SQL commands and access/destroy the entire database.",
      "fix": "cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))"
    },
    {
      "line": 1,
      "severity": "MINOR",
      "category": "Code Quality",
      "title": "Missing type hints",
      "description": "Function lacks type annotations, reducing code readability and IDE support.",
      "fix": "def get_user(user_id: int) -> Optional[dict]:"
    },
    {
      "line": 3,
      "severity": "MAJOR",
      "category": "Error Handling",
      "title": "No exception handling",
      "description": "Database errors will crash the application with no graceful fallback.",
      "fix": "Wrap in try/except and handle DatabaseError appropriately."
    }
  ],
  "fixedCode": "def get_user(user_id: int) -> Optional[dict]:\n    try:\n        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))\n        return cursor.fetchone()\n    except DatabaseError as e:\n        logger.error(f'Database error: {e}')\n        return None"
}
```

**UI Display:**
```
Code Quality Score: 28/100 🔴

Issues Found (3):
────────────────────────────────
🔴 CRITICAL — Line 2: SQL Injection Vulnerability
   Direct string concatenation allows SQL injection attacks.
   Fix: Use parameterized queries

🟠 MAJOR — Line 3: No Exception Handling
   Database crashes will propagate unhandled.

🟡 MINOR — Line 1: Missing Type Hints
   Add type annotations for better code clarity.

[View Fixed Code ▶] [Copy Fix] [Share Review 🔗]
```

---

## 🚀 Stretch Goals

- [ ] GitHub PR integration (auto-review on PR open)
- [ ] VS Code extension
- [ ] Team review history & dashboard
- [ ] Batch file upload review
