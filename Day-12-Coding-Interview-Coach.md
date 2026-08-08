# Day 12 — Coding Interview Coach

| Field | Details |
|---|---|
| **Day** | 12 |
| **Category** | Developer Tools / AI |
| **Difficulty** | Advanced |
| **Estimated Build Time** | 9–12 hours |

---

## 📌 Project Overview

The Coding Interview Coach is an immersive AI-powered interview simulator that replicates the exact experience of a technical interview at a top-tier technology company. The AI acts as a skilled interviewer — presenting problems, listening to the candidate's verbal approach, providing progressive hints (without giving away the answer), evaluating submitted code, and delivering detailed post-interview feedback. Unlike LeetCode, which only checks correctness, this system evaluates the full interview experience: problem-solving approach, communication quality, code readability, and time/space complexity analysis.

The system supports three difficulty levels (Easy, Medium, Hard) and five topic categories (Arrays & Strings, Dynamic Programming, Graphs & Trees, System Design, and Behavioral). For System Design problems, the AI conducts a conversational design review — asking follow-up questions about scalability, database choices, and trade-offs, much like a real Staff Engineer would. The code editor is Monaco (the same editor powering VS Code) with support for Python, JavaScript, TypeScript, Java, and C++, with real-time syntax highlighting and auto-complete.

After code submission, the evaluation engine runs the solution against hidden test cases via a Judge0 code execution sandbox, then passes both the code and the test results to GPT-4o for a holistic evaluation. The feedback report covers: correctness score, time complexity (identified algorithmically), space complexity, code style score, communication score (based on comments/naming/structure), an optimal solution walkthrough, and a personalized improvement plan for the next session.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **AI Interviewer Mode** | GPT-4o acts as an interviewer, presenting problems and responding to verbal approach descriptions |
| **Problem Library** | 50+ curated problems across 5 topics and 3 difficulty levels |
| **Progressive Hints System** | 3-tier hint system (nudge → guidance → near-solution) released on request only |
| **Monaco Code Editor** | VS Code-powered editor with syntax highlighting for 5 languages |
| **Code Execution Sandbox** | Judge0 API runs code against hidden test cases; shows pass/fail per test |
| **Complexity Analyzer** | GPT-4o identifies Big O time and space complexity of submitted solution |
| **Communication Scorer** | Evaluates code quality signals: naming, comments, structure, readability |
| **System Design Mode** | Conversational design review with follow-up questions on scalability and trade-offs |
| **Post-Interview Report** | Detailed PDF report with scores, feedback, optimal solution, and improvement plan |
| **Session History** | Tracks all past interviews with scores and improvement trends over time |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **AI Interviewer:** OpenAI GPT-4o (problem presentation, evaluation, hints)
- **Code Execution:** Judge0 API (self-hosted or RapidAPI hosted sandbox)
- **Speech-to-Text:** Web Speech API (verbal approach input) + OpenAI Whisper (fallback)
- **Text-to-Speech:** Web Speech Synthesis API (AI interviewer voice)
- **State Machine:** XState (interview flow state machine)
- **Database:** Supabase (problem library, session history, user scores)
- **Auth:** Clerk
- **PDF Report:** Puppeteer (post-interview report generation)
- **Real-Time:** Supabase Realtime (live typing indicator for AI response)
- **Deployment:** Vercel + Railway (Judge0 sandbox)

---

## 🔧 Key Functions

### `conductInterviewSession(config: InterviewConfig): InterviewSession`
Initializes an XState state machine with states: `idle → presenting_problem → awaiting_approach → hinting → coding → evaluating → feedback`. Creates the `InterviewSession` object with `sessionId`, `problem`, `startTime`, `hintsUsed: 0`, `messages: []` (conversation log), and `codeSnapshots: []` (timestamped code saves). Returns the session object and starts the state machine.

### `evaluateSolution(code: string, language: string, problem: Problem, approach: string): Promise<EvaluationReport>`
Submits code to the Judge0 API for execution against the problem's hidden test suite. Simultaneously sends the code, approach description, and problem statement to GPT-4o with an evaluation prompt requesting: `correctnessScore` (0–100), `timComplexity` (Big O string), `spaceComplexity`, `codeQualityScore`, `communicationScore`, `strengths[]`, `improvements[]`, `optimalSolution` (code string), and `optimalExplanation`. Merges both results into an `EvaluationReport`.

### `generateProgressiveHint(problem: Problem, currentCode: string, hintsGiven: number): Promise<Hint>`
Determines the appropriate hint tier based on `hintsGiven` (0=nudge, 1=guidance, 2=near-solution). Builds a tier-specific prompt instructing GPT-4o to give exactly the right amount of help — never revealing the complete approach at tier 0, only a conceptual nudge. At tier 2, provides a concrete algorithmic direction with a 3-line pseudocode scaffold. Returns a `Hint` with `tier`, `content`, `conceptHighlighted`, and `penaltyPoints` (deducted from final score).

### `analyzeSystemDesign(designDescription: string, requirements: SystemRequirements): Promise<DesignReview>`
For system design problems, takes the candidate's verbal/text description of their proposed architecture. GPT-4o plays the role of a Staff Engineer reviewer, generating 4–6 follow-up questions targeting weaknesses (uncovered edge cases, scalability bottlenecks, single points of failure). Returns a `DesignReview` with `followUpQuestions[]`, `componentsCovered[]`, `componentsMissed[]`, `scaleAssessment`, and a `designScore`.

### `generateSessionReport(session: InterviewSession, evaluation: EvaluationReport): Promise<Buffer>`
Compiles the complete interview session into a Puppeteer-rendered PDF report. Sections include: problem statement, candidate's approach narrative, code submission with syntax highlighting, test case results table, evaluation scores (radar chart), complexity analysis, optimal solution side-by-side comparison, AI feedback paragraphs, and a personalized 3-topic improvement plan for the next session.

---

## 📁 File Structure

```
coding-interview-coach/
├── app/
│   ├── page.tsx                    # Dashboard + start interview
│   ├── interview/[sessionId]/
│   │   └── page.tsx                # Live interview interface
│   ├── results/[sessionId]/
│   │   └── page.tsx                # Post-interview report
│   ├── history/page.tsx            # Past sessions + trends
│   └── api/
│       ├── interview/
│       │   ├── start/route.ts      # POST: Init session
│       │   ├── hint/route.ts       # POST: Get progressive hint
│       │   └── message/route.ts    # POST: Interviewer response
│       ├── execute/route.ts        # POST: Judge0 code execution
│       ├── evaluate/route.ts       # POST: GPT-4o evaluation
│       ├── design/route.ts         # POST: System design review
│       └── report/route.ts         # GET: PDF generation
├── components/
│   ├── interview/
│   │   ├── ProblemStatement.tsx    # Problem display panel
│   │   ├── InterviewerChat.tsx     # AI interviewer message thread
│   │   ├── ApproachInput.tsx       # Verbal approach text/voice input
│   │   ├── HintPanel.tsx           # Progressive hint display
│   │   └── TimerBar.tsx            # Interview countdown timer
│   ├── editor/
│   │   ├── CodeEditor.tsx          # Monaco editor wrapper
│   │   ├── LanguageSelector.tsx
│   │   └── TestCasePanel.tsx       # Test case results
│   ├── evaluation/
│   │   ├── ScoreRadarChart.tsx     # Multi-axis score visualization
│   │   ├── ComplexityBadge.tsx     # Big O display
│   │   ├── FeedbackCard.tsx        # Strength/improvement cards
│   │   └── OptimalSolution.tsx     # Side-by-side code comparison
│   ├── config/
│   │   ├── DifficultySelector.tsx
│   │   └── TopicSelector.tsx
│   └── ui/
├── lib/
│   ├── xstate/interviewMachine.ts  # XState state machine
│   ├── judge0/execute.ts           # Code execution client
│   ├── openai.ts                   # GPT-4o client
│   ├── problems/
│   │   ├── index.ts                # Problem registry
│   │   ├── easy/
│   │   ├── medium/
│   │   └── hard/
│   └── zustand/sessionStore.ts
├── data/
│   └── problems.json               # Problem library (50+ problems)
├── types/interview.ts
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are Alex, a senior staff engineer at a top tech company conducting a technical 
coding interview. You are rigorous but supportive. Your goals:
1. Present the problem clearly, ask if they have any clarifying questions
2. Listen to their approach before they code — give neutral acknowledgment 
   ("That sounds reasonable, go ahead") or ask one probing question
3. If they get stuck and request a hint, give the minimum information needed
4. After submission, evaluate holistically — correctness matters but so does 
   communication, clean code, and recognizing trade-offs

Your tone: Professional, encouraging, direct. No excessive praise. Real interviewers 
are neutral, not cheerleaders. Ask follow-up questions like "What's the time complexity 
of that approach?" or "How would this scale to 10M users?"

Current interview config:
- Difficulty: Medium
- Topic: Arrays & Strings
- Language: Python
- Time limit: 35 minutes

USER:
[SYSTEM]: Interview started. Present the problem.
```

---

## 📤 Expected Output (Result)

**Interview Problem Presentation:**
```
Alex (AI Interviewer):
"Welcome! Let's get started. Today's problem is called Two Sum with Sorted Array.

You're given a sorted array of integers `nums` and a target integer `target`. 
Return the indices of the two numbers that add up to `target`. You may assume 
exactly one solution exists, and you may not use the same element twice.

Example:
  Input:  nums = [2, 7, 11, 15], target = 9
  Output: [0, 1]  (because nums[0] + nums[1] == 9)

Take a moment to think through your approach before you start coding. 
Do you have any clarifying questions?"
```

**Post-Submission Evaluation (JSON):**
```json
{
  "sessionId": "sess_a84f2c",
  "problem": "Two Sum with Sorted Array",
  "testResults": {
    "passed": 8,
    "total": 10,
    "failedCases": [
      {"input": "nums=[-3,-2,0], target=-5", "expected": "[0,1]", "got": "None"}
    ]
  },
  "evaluation": {
    "correctnessScore": 80,
    "timeComplexity": "O(n) — two-pointer approach detected",
    "spaceComplexity": "O(1) — in-place, no extra data structures",
    "codeQualityScore": 85,
    "communicationScore": 70,
    "strengths": ["Correctly used two-pointer technique", "Clean variable names", "Recognized sorted array constraint"],
    "improvements": ["Did not handle negative number edge cases", "Missing docstring/type hints", "No discussion of why two-pointer beats hash map here"],
    "optimalExplanation": "Two-pointer is optimal here: left pointer starts at index 0, right at n-1. Sum > target: move right left. Sum < target: move left right. O(n) time, O(1) space.",
    "overallScore": 79,
    "nextTopics": ["Binary Search", "Sliding Window", "Edge case handling for negative integers"]
  }
}
```

**UI Score Panel:**
```
📊 Interview Complete  |  Session: sess_a84f2c  |  Time used: 28:14 / 35:00

┌─────────────────────────────────────────┐
│  Overall Score:  79/100  (B+)           │
├──────────────┬──────────────────────────┤
│ Correctness  │  80/100  ████████░░      │
│ Code Quality │  85/100  █████████░      │
│ Communication│  70/100  ███████░░░      │
│ Complexity   │  ✅ O(n) time, O(1) space│
├──────────────┴──────────────────────────┤
│ Tests: 8/10 passed  ⚠️  2 edge cases   │
└─────────────────────────────────────────┘

📥 Download Full Report (PDF)
🔁 Next Session: "Sliding Window — Medium"
```

---

## 🚀 Stretch Goals

- [ ] Add a peer interview mode where two users interview each other with AI as judge
- [ ] Build a "Mock Loop" — simulate a full 4-round interview day in sequence
- [ ] Add resume-aware problems: AI picks problems relevant to the user's target company
- [ ] Implement AI voice interviewer using ElevenLabs TTS for a fully realistic experience
- [ ] Track improvement over time with a skill progression radar chart across sessions
- [ ] Build a company-specific mode (FAANG, startup, fintech) with tailored question banks
- [ ] Add a leaderboard for competitive practice among groups of developers
