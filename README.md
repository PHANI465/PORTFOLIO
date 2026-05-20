# Phaneendra Gavara — AI Portfolio

An AI-powered developer portfolio built with Next.js 14, featuring 9 switchable themes, an AI chat assistant (Ankush), and a full RAG pipeline backed by Pinecone + GPT-4o.

> **Live demo:** https://phaneendra-portfolio.vercel.app  
> **GitHub:** https://github.com/your-username/phaneendra-portfolio *(update this)*

---

## ✨ Features

- 9 themes: Cyberpunk AI, Terminal Hacker, Glassmorphism, Minimal Professional, Dark Professional, Bright Neon, Futuristic Space, Anime Gaming, Retro Pixel
- AI assistant "Ankush" powered by GPT-4o + Pinecone RAG
- Animated hero sections with typewriter, matrix rain, tilt cards, parallax
- Contact form with Resend email delivery
- One-Page CV view & downloadable PDF resume
- Admin dashboard at `/dashboard`
- "Create Your Own" guide at `/docs`

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/phaneendra-portfolio
cd phaneendra-portfolio
npm install          # also auto-runs setup-content (copies example → real files)
cp .env.local.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔒 Privacy — Your data never goes to GitHub

This repo uses a two-file content system:

| File on GitHub (committed) | Your real file (gitignored) |
|---|---|
| `content/portfolio.example.json` | `content/portfolio.json` |
| `content/resume.example.json` | `content/resume.json` |
| `content/projects.example.json` | `content/projects.json` |
| `.env.local.example` | `.env.local` |

**The example files contain placeholder data** ("Your Name", "your.email@example.com", etc.).  
**Your real files are listed in `.gitignore`** and are never committed.

When you run `npm install`, the setup script automatically creates the real files from the examples if they don't exist yet. Edit those files with your own info.

---

## 📁 What to edit

| Want to change | Edit this file |
|---|---|
| Name, bio, tagline, links | `content/portfolio.json` |
| Work experience, education, skills | `content/resume.json` |
| Projects | `content/projects.json` |
| Blog posts | `content/blog/*.md` (create new .md files) |
| AI assistant knowledge | `lib/ai-assistant.ts` → `SYSTEM_PROMPT` |
| Resume PDF download | `public/resume/Phaneendra_G_Resume.pdf` |
| Default theme | `lib/context/ThemeContext.tsx` → `useState('cyberpunk-ai')` |

Full guide also available in the app at `/docs`.

---

## 🔑 Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

```env
# AI assistant (required for chat)
OPENAI_API_KEY=sk-...

# RAG vector search (optional — chat works without it, just less accurate)
PINECONE_API_KEY=...
PINECONE_INDEX=...

# Email delivery for contact form (optional — messages saved locally without it)
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=you@email.com
```

To get keys:
- **OpenAI:** https://platform.openai.com/api-keys
- **Pinecone:** https://app.pinecone.io
- **Resend:** https://resend.com (free tier: 100 emails/day)

---

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel
vercel
```

Or connect your GitHub repo on https://vercel.com and it auto-deploys on every push.

**Add your environment variables in Vercel → Project → Settings → Environment Variables.**  
Never paste real keys into the repo itself.

---

## 📝 Adding a blog post

Create a new file in `content/blog/my-post.md`:

```markdown
---
title: "My Post Title"
date: "2026-05-15"
tags: ["AI", "Python"]
category: "Engineering"
excerpt: "Short preview shown on the blog listing page."
---

Your full post content here in Markdown...
```

---

## 🏗️ Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · OpenAI GPT-4o · Pinecone · Resend · ReportLab (PDF)

