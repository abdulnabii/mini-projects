# Day 05 — AI Meeting Summarizer

| Field | Details |
|---|---|
| **Day** | 05 |
| **Category** | AI / Productivity |
| **Difficulty** | Intermediate |
| **Estimated Build Time** | 6–8 hours |

---

## 📌 Project Overview

The AI Meeting Summarizer is a productivity powerhouse that takes raw meeting transcripts (exported from Zoom, Microsoft Teams, or Google Meet) or audio files and distills them into structured, actionable intelligence in under 30 seconds. Abdul Nabi built this tool after noticing that the average knowledge worker spends 4+ hours per week in meetings yet retains only a fraction of the decisions made. The app eliminates the cognitive overhead of note-taking entirely.

The core pipeline passes transcript text through GPT-4o with a carefully engineered extraction prompt that identifies: all attendees and their roles, every decision made (with timestamps), action items assigned to specific individuals with deadlines, blockers or risks raised, and a concise executive summary suitable for sharing with stakeholders who weren't present. For audio uploads, OpenAI's Whisper API handles transcription first, adding speaker diarization through pyannote.audio to distinguish who said what.

The output can be pushed directly to a Notion database via the Notion API — creating a perfectly structured meeting notes page — or exported as a polished Microsoft Word document (.docx) with table formatting. A Slack integration allows one-click posting of the executive summary to any channel, making information flow from meetings to teams instantaneous.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **Transcript Paste or File Upload** | Accept raw text paste (Teams/Zoom format) or .txt/.vtt subtitle file upload |
| **Audio File Transcription** | Upload MP3/MP4/WAV files; Whisper API transcribes with speaker diarization |
| **Attendee Extraction** | Automatically identifies all meeting participants and their mentioned roles |
| **Decision Extraction** | Pulls every formal decision made during the meeting with associated timestamp |
| **Action Item Parser** | Extracts tasks with assigned owner, deadline mentioned, and priority level |
| **Blocker & Risk Identification** | Flags concerns, blockers, and risks raised during the meeting |
| **Executive Summary Generator** | Produces a 3–5 sentence C-suite-ready summary of the meeting |
| **Notion Integration** | Pushes structured output to a Notion database as a formatted page |
| **Word Document Export** | Exports summary as a professionally formatted .docx file with tables |
| **Slack Post Integration** | One-click posting of the executive summary to a chosen Slack channel |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **AI Engine:** OpenAI GPT-4o (extraction), OpenAI Whisper API (transcription)
- **Speaker Diarization:** pyannote.audio (Python microservice)
- **Notion Integration:** `@notionhq/client` (official Notion SDK)
- **Word Export:** `docx` npm package (client-side .docx generation)
- **Slack Integration:** Slack Bolt SDK (webhook-based posting)
- **File Handling:** Multer (Next.js API routes), FormData API
- **State Management:** Zustand
- **Database:** Supabase (save meeting history and summaries)
- **Auth:** Clerk
- **Deployment:** Vercel + Railway (pyannote diarization service)

---

## 🔧 Key Functions

### `extractMeetingIntelligence(transcript: string): Promise<MeetingIntelligence>`
The core GPT-4o pipeline function. Sends the full transcript with a structured extraction system prompt to GPT-4o. Parses the JSON response into a typed `MeetingIntelligence` object containing `attendees`, `decisions`, `actionItems`, `blockers`, `executiveSummary`, and `meetingDuration`. Implements retry logic with exponential backoff for API failures and validates the JSON schema before returning.

### `transcribeAudioWithDiarization(audioBuffer: Buffer, mimeType: string): Promise<TranscriptWithSpeakers>`
Sends the audio buffer to OpenAI Whisper API for base transcription. Simultaneously processes through the pyannote.audio diarization service to assign speaker labels (Speaker 1, Speaker 2, etc.). Merges the timestamp-aligned outputs to produce a `TranscriptWithSpeakers` object with timestamped, speaker-attributed utterances. Supports MP3, MP4, WAV, M4A, and WebM formats.

### `pushToNotion(intelligence: MeetingIntelligence, databaseId: string): Promise<NotionPage>`
Uses the official Notion SDK to create a new page in the specified database. Maps `MeetingIntelligence` fields to Notion block types: executive summary → callout block, decisions → numbered list, action items → to-do blocks (with assignee mentioned), blockers → bulleted list with ⚠️ icon. Returns the created `NotionPage` object with its URL for the success toast.

### `generateWordDocument(intelligence: MeetingIntelligence): Promise<Blob>`
Uses the `docx` npm library to programmatically construct a `.docx` document with a title heading, metadata table (date, duration, attendees), and separate styled sections for each extracted category. Action items are rendered as a formatted table with Owner, Task, Deadline, and Priority columns. Returns a `Blob` that triggers a browser download.

### `detectSentimentAndTone(transcript: string): MeetingToneAnalysis`
Analyzes the overall meeting sentiment using keyword frequency and GPT-4o classification. Identifies the dominant tone (collaborative, tense, decisive, exploratory) and flags any segments with high emotional intensity (arguments, frustration, excitement). Returns a `MeetingToneAnalysis` object with `overallSentiment`, `toneLabel`, `energyLevel`, and `flaggedSegments[]`.

---

## 📁 File Structure

```
ai-meeting-summarizer/
├── app/
│   ├── page.tsx                    # Upload / paste interface
│   ├── results/[id]/page.tsx       # Structured results view
│   ├── history/page.tsx            # Past meetings library
│   └── api/
│       ├── extract/route.ts        # POST: GPT-4o extraction
│       ├── transcribe/route.ts     # POST: Whisper transcription
│       ├── notion/route.ts         # POST: Push to Notion
│       └── slack/route.ts          # POST: Post to Slack
├── components/
│   ├── upload/
│   │   ├── TranscriptInput.tsx     # Text paste area
│   │   ├── AudioUploader.tsx       # Drag-and-drop audio upload
│   │   └── ProgressTracker.tsx     # Processing pipeline status
│   ├── results/
│   │   ├── ExecutiveSummary.tsx
│   │   ├── AttendeesGrid.tsx
│   │   ├── DecisionsList.tsx
│   │   ├── ActionItemsTable.tsx    # Sortable task table
│   │   ├── BlockersPanel.tsx
│   │   └── ToneAnalysisBar.tsx
│   ├── export/
│   │   ├── NotionExportButton.tsx
│   │   ├── WordExportButton.tsx
│   │   └── SlackPostButton.tsx
│   └── ui/
├── lib/
│   ├── openai.ts                   # GPT-4o + Whisper clients
│   ├── notion.ts                   # Notion SDK wrapper
│   ├── docxGenerator.ts
│   ├── prompts/
│   │   └── meetingExtractor.txt    # Extraction system prompt
│   └── zustand/meetingStore.ts
├── diarization-service/            # Python microservice
│   ├── app.py
│   ├── diarize.py
│   └── requirements.txt
├── types/meeting.ts
├── .env.local
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a precision meeting intelligence extraction engine. Your job is to analyze meeting 
transcripts and extract structured information with surgical accuracy. You never invent 
information not present in the transcript. If a field cannot be determined, return null 
or an empty array.

Extract the following and return ONLY valid JSON matching this schema:
{
  "attendees": [{"name": string, "role": string | null}],
  "decisions": [{"decision": string, "timestamp": string | null, "decisionMaker": string | null}],
  "actionItems": [{"task": string, "assignee": string | null, "deadline": string | null, "priority": "high"|"medium"|"low"}],
  "blockers": [{"description": string, "raisedBy": string | null, "severity": "critical"|"moderate"|"minor"}],
  "executiveSummary": string,
  "meetingDuration": string | null,
  "overallSentiment": "positive"|"neutral"|"tense"|"mixed"
}

USER:
Transcript:
[00:00] John (Product): Alright everyone, let's get started. We have Sarah, Mike, and 
Lisa joining today.
[00:45] Sarah (Engineering): The API latency issue is blocking the mobile release. 
We need to resolve it before Friday.
[02:10] Mike (Design): I've finalized the new onboarding screens. John, can you review 
and approve by Wednesday?
[03:30] John: Approved. We're going ahead with the blue color scheme — that's final.
[04:15] Lisa (QA): I'll run the full regression suite by Thursday EOD.
[05:00] John: Great. Mike, please also send the design files to the dev team by tomorrow.
```

---

## 📤 Expected Output (Result)

**Extracted Meeting Intelligence (JSON):**
```json
{
  "attendees": [
    {"name": "John", "role": "Product"},
    {"name": "Sarah", "role": "Engineering"},
    {"name": "Mike", "role": "Design"},
    {"name": "Lisa", "role": "QA"}
  ],
  "decisions": [
    {
      "decision": "Blue color scheme approved for onboarding",
      "timestamp": "03:30",
      "decisionMaker": "John"
    }
  ],
  "actionItems": [
    {"task": "Review and approve new onboarding screens", "assignee": "John", "deadline": "Wednesday", "priority": "high"},
    {"task": "Run full regression suite", "assignee": "Lisa", "deadline": "Thursday EOD", "priority": "high"},
    {"task": "Send design files to dev team", "assignee": "Mike", "deadline": "Tomorrow", "priority": "medium"},
    {"task": "Resolve API latency issue blocking mobile release", "assignee": "Sarah", "deadline": "Friday", "priority": "high"}
  ],
  "blockers": [
    {"description": "API latency issue blocking mobile release", "raisedBy": "Sarah", "severity": "critical"}
  ],
  "executiveSummary": "The team reviewed mobile release readiness. A critical API latency blocker was identified and assigned to Engineering for resolution by Friday. Design finalized and approved onboarding screens using the blue color scheme. QA will complete regression testing by Thursday. Four action items were assigned across the team.",
  "meetingDuration": "~5 minutes",
  "overallSentiment": "positive"
}
```

**UI Status Display:**
```
✅ Meeting Analyzed Successfully  |  Processing time: 3.2s

📋 Executive Summary
   "The team reviewed mobile release readiness. A critical API latency blocker 
    was identified..."  [Read more]

👥 Attendees (4):  John · Sarah · Mike · Lisa

✅ Decisions Made (1)
   → Blue color scheme approved for onboarding  [03:30]

📌 Action Items (4)   [2 HIGH · 1 MEDIUM · 1 LOW]
   🔴 Resolve API latency blocker → Sarah  (Due: Friday)
   🔴 Full regression suite → Lisa  (Due: Thursday EOD)
   🔴 Review onboarding screens → John  (Due: Wednesday)
   🟡 Send design files → Mike  (Due: Tomorrow)

⚠️  Blockers (1)
   🚨 CRITICAL: API latency blocking mobile release (raised by Sarah)

📤 Exported to Notion  |  📄 Downloaded meeting_summary.docx
```

---

## 🚀 Stretch Goals

- [ ] Add real-time meeting summarization via browser tab audio capture (Web Audio API)
- [ ] Build a Teams/Zoom native plugin that auto-summarizes post-meeting
- [ ] Implement a recurring meeting tracker that shows trends across sprint cycles
- [ ] Add sentiment timeline visualization (line chart of tone across meeting duration)
- [ ] Generate a visual meeting "story" — a one-page infographic summary
- [ ] Build a searchable meeting archive with semantic search across all past summaries
- [ ] Add multi-language support for Spanish, French, Arabic, and Urdu transcripts
