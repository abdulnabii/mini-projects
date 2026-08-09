# 🚀 30 AI Projects in 30 Days — Monorepo

Welcome to the **30 AI Projects in 30 Days** repository by **Abdul Nabi** ([aiwithab.site](https://aiwithab.site)). This monorepo tracks 30 full-stack AI web applications built sequentially, each featuring a unique design aesthetic, robust architecture, and live subdomain deployment.

---

## 📌 Projects Directory

| Day | Project Name | Category | Live Subdomain | Tech Stack | Status |
|:---|:---|:---|:---|:---|:---:|
| **01** | [AI Symptom Checker & Triage Assistant](./day-01-ai-symptom-checker) | Healthcare / AI | 🌐 [`symptom-checker.aiwithab.site`](https://symptom-checker.aiwithab.site) | Next.js 14, Tailwind CSS, Gemini API | ✅ Deployed |
| **02** | [Real-Time Code Review Bot](./day-02-code-review-bot) | DevTools / Cyber-IDE | 🌐 [`code-review.aiwithab.site`](https://code-review.aiwithab.site) | Next.js 14, Monaco, Gemini 1.5 Flash | ✅ Deployed |
| **03** | [Smart Resume Builder & ATS Optimizer](./day-03-smart-resume-builder) | HR Tech / Productivity | 🌐 [`resume-builder.aiwithab.site`](https://resume-builder.aiwithab.site) | Next.js 14, Gemini API, Print CSS | ✅ Deployed |
| **04** | *Upcoming Project* | - | - | - | ⏳ Pending |
| ... | *Days 05–30* | - | - | - | ⏳ Pending |

---

## 🛠️ Monorepo Architecture

Each project is self-contained in its respective `day-XX-` directory:
- **Framework**: Next.js 14 (App Router) & TypeScript
- **Styling**: Tailwind CSS & Framer Motion with tailored project design themes
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel & custom subdomains under `aiwithab.site`

---

## 💻 Local Development Setup

Clone the repository and run any project locally:

```bash
git clone https://github.com/abdulnabii/mini-projects.git
cd mini-projects/day-01-ai-symptom-checker # Or day-02-..., day-03-...

npm install
npm run dev
```

Open `http://localhost:3000` to view the application locally.

---

## 👤 Author & Contact

- **Author**: Abdul Nabi
- **Portfolio**: [aiwithab.site](https://aiwithab.site)
- **GitHub**: [@abdulnabii](https://github.com/abdulnabii)