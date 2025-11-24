# 🧠 OmniDigest

**Turn hours of reading into minutes of insight.**

OmniDigest is a full-stack AI application designed to solve information overload. It allows students and professionals to upload complex PDF documents and receive instant, structured summaries, keyword extraction, and "Chat with PDF" capabilities.

### 🚀 Key Features
* **Smart Chunking (Map-Reduce):** Handles large research papers by splitting text into context-aware chunks for high-accuracy summarization without hitting token limits.
* **Structured AI Output:** Uses strict JSON enforcement with Google Gemini 1.5 Flash to generate clean titles, keyword tags, and formatted summaries.
* **Asynchronous Processing:** Built with Python (FastAPI) and AsyncIO to handle concurrent requests efficiently.
* **Modern UI:** A responsive, dark-mode enabled frontend built with React/Next.js and Tailwind CSS.

### 🛠️ Built With
* **Frontend:** Next.js 14, Tailwind CSS, TypeScript
* **Backend:** Python, FastAPI, Uvicorn
* **AI:** Google Gemini 1.5 Flash
* **Deployment:** AWS / Vercel (planned)
