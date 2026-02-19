# BullshitDetector

**A real-time claim validation and public sentiment analysis tool powered by xAI's Grok API and Supabase.**

Detect bullshit. Fast. Accurately.

[Live Demo](https://bullshit-detector.vercel.app) | [GitHub](https://github.com/BullshitDetector/BullshitDetector)

---

## Features

| Feature | Description |
|-------|-----------|
| **Claim Validation** | Enter any claim → get a verdict: **Bullshit**, **Mostly True**, or **Neutral** with confidence score |
| **Sentiment Dashboard** | Analyze public opinion on any topic across X, Reddit, and news |
| **Professional Mode** | Deep analysis with quotes, sources, and methodology |
| **Supabase Backend** | Secure, persistent history with user authentication |
| **Responsive UI** | Works on desktop, tablet, and mobile |
| **Dark Mode** | Clean, modern Tailwind CSS design |
| **Export Ready** | PDF export coming soon |

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **AI Backend**: xAI Grok API (`grok-3`, `grok-4`)
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel / StackBlitz

---

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context (Model, UserMode)
├── lib/            # Supabase client, history utils
├── pages/          # Route pages
│   ├── Validator.tsx
│   ├── SentimentPage.tsx
│   ├── SentimentDetail.tsx
│   ├── HistoryPage.tsx
│   ├── SettingsPage.tsx
│   └── AuthPage.tsx
├── routes.tsx      # App routes
└── main.tsx        # Entry point
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/BullshitDetector/BullshitDetector.git
cd BullshitDetector
pnpm install
```

### 2. Environment Variables

Create `.env` in root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> Get from: [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/hinzcotdeuszvvyidbqe/settings/api)

### 3. Run Locally

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Admin Demo Login

For development and testing, a demo admin account is available:

- **Email**: `admin@bullshitdetector.com`
- **Demo OTP**: `123456`

**How to use:**
1. Click **Admin Login** on the home page
2. The email is pre-filled with the admin account
3. Click **Send OTP** → Shows demo OTP code (no email needed)
4. Enter `123456` in the OTP field
5. Click **Verify OTP** → You're logged in as admin

This demo account provides full access to admin features without requiring email infrastructure setup during development.

---

## Supabase Setup

### 1. Create Table (SQL Editor)

```sql
create table validation_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  claim text not null,
  verdict text check (verdict in ('bullshit', 'mostly true', 'neutral')),
  score double precision check (score >= 0 and score <= 1),
  mode text check (mode in ('voter', 'professional')),
  created_at timestamp with time zone default now()
);

alter table validation_history enable row level security;

create policy "Users can manage their history"
  on validation_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 2. Enable Auth

Go to **Authentication → Providers → Email** → Enable

---

## Usage

### Validate a Claim

1. Go to **Home**
2. Enter: `"The moon is made of cheese"`
3. Click **Validate**
4. See verdict + confidence score

### Analyze Sentiment

1. Go to **Sentiment**
2. Enter: `"AI will replace programmers"`
3. Click **Analyze**
4. Click **Positive / Neutral / Negative** cards → see detailed methodology

### View History

1. Sign up / log in at **/auth**
2. Go to **History**
3. All past validations are saved

---

## User Modes

| Mode | Features |
|------|---------|
| **Voter** | Fast, simple verdicts |
| **Professional** | Quotes, sources, methodology, deep analysis |

Toggle in **Settings**

---

## API Integration

### xAI Grok API

- Uses `grok-3` (free) or `grok-4` (premium)
- Add your key in **Settings**
- Get key: [https://x.ai/api](https://x.ai/api)

---

## Development

### Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm preview    # Preview build
```

### StackBlitz

Open in [StackBlitz](https://stackblitz.com/edit/bullshit-detector) for instant editing.

---

## Deployment

### Deploy to Vercel

```bash
vercel
```

> Auto-deploys on push to `main`

---

## Roadmap

- [ ] Export results to PDF
- [ ] Real-time sentiment trends
- [ ] Chrome extension
- [ ] Shareable validation links
- [ ] Fact-checker mode (auto-validate claims in articles)

---

## Contributing

1. Fork the repo
2. Create a branch: `feat/your-feature`
3. Commit: `git commit -m "feat: add pdf export"`
4. Push & PR

---

## License

MIT © [BullshitDetector](https://github.com/BullshitDetector)

---

**Built to cut through the noise. No bullshit.**