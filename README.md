# 🌱 Echoes - AI-Powered Emotional Growth Companion

## Project Overview

Echoes is a comprehensive AI platform that empowers youth to face mental health stigma through safe, technology-enabled emotional growth experiences. The application combines journaling, roleplay practice, and growth tracking to create a holistic mental health support system.

## 🎯 Core Features

### 1. Expression Mode (Journaling & Healing)
- **Voice Journaling**: Record thoughts and feelings with AI transcription
- **Text Journaling**: Write entries with sentiment analysis
- **Doodle Mode**: Draw emotions with AI interpretation
- **AI-Generated Narratives**: Transform entries into healing stories and art
- **Crisis Detection**: Automatic detection of crisis indicators with immediate support

### 2. Practice Mode (Roleplay Simulator)
- **Realistic Scenarios**: Practice difficult conversations with AI personas
- **Multiple Personas**: Parent, friend, teacher, counselor, sibling
- **Real-time Feedback**: Tone analysis and conversation coaching
- **Confidence Tracking**: Monitor improvement over time
- **Guided Practice**: Step-by-step conversation building

### 3. Growth Dashboard
- **Mood Timeline**: Visual tracking of emotional patterns
- **Confidence Progression**: Monitor conversation skills development
- **Personalized Insights**: AI-generated growth stories and recommendations
- **Milestone Tracking**: Celebrate achievements and progress
- **Export Capabilities**: Download growth reports as PDF/JSON

### 4. Privacy & Safety
- **End-to-End Encryption**: All sensitive data encrypted
- **Anonymous Guest Mode**: Use without creating an account
- **Crisis Support**: Immediate access to helpline resources
- **Data Retention Controls**: User-controlled data deletion
- **No Third-Party Sharing**: Privacy-first design

# 🛠️ Technical Architecture

---

### 🖥️ Frontend
- **Framework:** Next.js (React) with App Router
- **UI Library:** Radix UI, Tailwind CSS (or similar)
- **State Management:** React Context, useState/useReducer, possibly Zustand or Redux for complex flows
- **Audio/Voice:** Web Audio API & Web Speech API for recording and transcription (client-side)
- **API Communication:** RESTful calls to Next.js API routes via a typed API client
- **Authentication:** JWT or session tokens (anonymous & registered users)
- **Progressive Web App:** Mobile-friendly, offline support for journaling

---

### 🖲️ Backend (API Layer)
- **Platform:** Next.js API routes (serverless functions on Vercel)
- **Endpoints:**
	- `/api/journal` – CRUD for journal entries (voice, text, doodle)
	- `/api/roleplay` – Roleplay session management and AI conversation
	- `/api/narrative` – AI narrative generation from journal entries
	- `/api/feedback` – AI feedback/coaching for conversations
	- `/api/mood` – Mood tracking endpoints
	- `/api/user` – User preferences, authentication, and settings
	- `/api/crisis` – Crisis detection and support triggers
- **Security:** API key validation for AI services, user authentication middleware

---

### 🤖 AI/ML Integration
- **AI Provider:** Anthropic Claude (via `@anthropic-ai/sdk`)
	- **Narrative Generation:** Converts journal entries to healing stories
	- **Roleplay Partner:** Simulates realistic personas for conversation practice
	- **Tone & Sentiment Analysis:** Analyzes user input for feedback and crisis detection
	- **Feedback Generation:** Provides coaching and confidence-building suggestions
- **Prompt Engineering:** Dynamic system prompts based on scenario, persona, and conversation history
- **Fallbacks:** Mock responses if API key is missing (for dev/demo)

---

### 🗄️ Database Schema (Example, using Prisma/PostgreSQL)
- **User**
	- `id` (UUID, PK)
	- `email` (nullable, unique)
	- `name`
	- `isAnonymous` (boolean)
	- `preferences` (JSON)
	- `createdAt`, `updatedAt`
- **JournalEntry**
	- `id` (UUID, PK)
	- `userId` (FK)
	- `type` (`voice` | `text` | `doodle`)
	- `content` (text or JSON)
	- `aiNarrative` (text)
	- `mood` (int)
	- `emotions` (string[])
	- `createdAt`
- **RoleplaySession**
	- `id` (UUID, PK)
	- `userId` (FK)
	- `scenario` (text)
	- `roleType` (string)
	- `conversation` (JSON: [{sender, content, timestamp}])
	- `aiFeedback` (text)
	- `confidenceScore` (float)
	- `createdAt`
- **MoodEntry**
	- `id` (UUID, PK)
	- `userId` (FK)
	- `mood` (int)
	- `emotions` (string[])
	- `createdAt`
- **CrisisAlert**
	- `id` (UUID, PK)
	- `userId` (FK)
	- `trigger` (text)
	- `detectedAt`
	- `resolved` (boolean)

---

**Other Notes:**
- **Storage:** Audio files (voice journals) will be stored in cloud storage (e.g., S3, Vercel Blob) with DB reference.
- **Encryption:** Sensitive fields encrypted at rest.
- **Deployment:** Vercel (serverless), with environment variables for API keys and DB connection.

---

# 🚀 Deployment

## Production Deployment
- [*Echoes*](https://v0-ai-emotional-companion-eight.vercel.app/)
- **Platform:** Vercel (recommended for serverless Next.js apps)
- **Environment Variables:**
	- `ANTHROPIC_API_KEY` – API key for Anthropic Claude
	- `DATABASE_URL` – Connection string for PostgreSQL (or your DB)
	- `SESSION_SECRET` – Secret for session encryption
	- `CRISIS_ALERT_WEBHOOK` – (optional) Webhook for crisis alert notifications
- **Build & Deploy:**
	1. Push to `main` branch (or your production branch)
	2. Vercel auto-builds and deploys the app
	3. Set environment variables in Vercel dashboard
	4. Configure custom domain and SSL (optional)
- **Storage:**
	- Audio files (voice journals) will be stored in Vercel Blob, S3, or similar, with DB reference
- **Monitoring:**
	- Use Vercel Analytics, Sentry, or similar for error and performance monitoring

---

# 🛡️ Crisis Safety

- **Crisis Detection:**
	- All journal and roleplay entries are scanned for crisis indicators using AI/ML
	- If a crisis is detected, the user is shown immediate support resources (helplines, chat, etc.)
	- Optionally, a crisis alert can be sent to a configured webhook for escalation
- **Privacy:**
	- Crisis detection runs locally or server-side; no third-party sharing of sensitive data
	- Users can opt out of crisis detection in preferences
- **Immediate Support:**
	- Prominent access to helplines and support resources throughout the app
	- Anonymous guest mode ensures users can seek help without registration
- **Data Retention:**
	- Users can delete their data at any time, including crisis-related records

## 🏆 Innovation Highlights

### Novel Approaches
1. **Dual System**: Combines internal healing (journaling) with external practice (roleplay)
2. **Multimodal AI**: Processes voice, text, and visual inputs for comprehensive understanding
3. **Longitudinal Tracking**: Tracks emotional growth over time with personalized insights
4. **Cultural Sensitivity**: Designed with Indian youth in mind, adaptable to other cultures
5. **Crisis Integration**: Seamless safety net without compromising user experience

### Technical Innovation
- **Real-time Crisis Detection**: Immediate intervention without human oversight
- **Persona-based AI**: Realistic conversation partners with consistent personalities
- **Growth Story Generation**: AI creates personalized narratives from user data
- **Privacy-by-Design**: Encryption and anonymity built into core architecture
