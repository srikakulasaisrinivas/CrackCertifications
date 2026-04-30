# Crack Certification Portal

A web portal for practicing certification exams, focused on the **GitHub Copilot GH300** exam.

## 🔒 How Answers Are Protected

This is a **frontend-only** app — no backend server needed. But answers aren't shipped in plain text:

| Layer | Protection |
|---|---|
| **Correct Answers** | Stored as **SHA-256 hashes** — DevTools shows `96e2e2c9...` not `"B"` |
| **Explanations** | **AES-256-CBC encrypted** — decrypted only after answering |
| **Build Process** | `question_new.md` → `build-questions.mjs` → hashed `questions.js` |

## Tech Stack

- **Frontend:** React 19 + Vite + React Router
- **Crypto:** Web Crypto API (SHA-256 + AES-256-CBC)
- **Hosting:** Any static host (Vercel, Netlify, GitHub Pages)

## Getting Started

```bash
cd frontend
npm install
npm run build:questions   # Generate hashed question data
npm run dev               # Start dev server at http://localhost:5173
```

## Deployment (Free)

### Vercel (recommended)
```bash
cd frontend
npx vercel
```
Or connect your GitHub repo — Vercel auto-builds on push.

### Netlify
```bash
cd frontend
npm run build
# Drag-drop the dist/ folder at netlify.com
```

### GitHub Pages
```bash
cd frontend
npm run build
# Push dist/ to gh-pages branch
```

## Project Structure

```
CrackCertifications/
├── frontend/
│   ├── scripts/
│   │   └── build-questions.mjs    # Parses MD → hashed JS
│   ├── src/
│   │   ├── components/            # React UI components
│   │   ├── data/
│   │   │   └── questions.js       # AUTO-GENERATED (hashed answers)
│   │   ├── services/
│   │   │   ├── api.js             # Local question service
│   │   │   ├── crypto.js          # SHA-256 + AES browser crypto
│   │   │   └── useQuizState.js    # Quiz state hook
│   │   └── styles/
│   ├── vercel.json
│   └── package.json
├── question_new.md                # Source questions with explanations
└── README.md
```

## Features

- ✅ **Practice Mode** — instant feedback + explanation after each question
- ✅ **Exam Mode** — 60-minute timer, results after submission
- ✅ **54 GH300 questions** — randomized each session
- ✅ **Flag questions** for review
- ✅ **Question navigator** — answered/flagged status
- ✅ **Summary page** — score, expandable explanations, retake
- ✅ **Answers protected** — SHA-256 hashed, not plain text
- ✅ **Explanations encrypted** — AES-256-CBC, decrypted only on reveal
- ✅ **No backend needed** — deploy anywhere for free
- ✅ **Mobile-responsive** dark-themed UI
