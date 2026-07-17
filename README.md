# Inkveil — Digital Publications Platform

> A Phase 0 frontend prototype for **Inkveil**, a coin-gated web novel platform for Indian readers and independent authors. Built with Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, and Zustand.

---

## ✨ Live Features

| Area | Routes |
|---|---|
| 🏠 Public | `/` · `/browse` · `/book/[id]` · `/book/[id]/read/[chapterId]` |
| 🔐 Auth | `/login` · `/register` (with demo role bypass) |
| 📖 Reader | `/reader/dashboard` · `/reader/wallet` · `/reader/coins` · `/reader/history` · `/reader/bookmarks` |
| ✍️ Author | `/author/dashboard` · `/author/books` · `/author/books/create` · `/author/books/[id]/editor` · `/author/earnings` |
| 🛡️ Admin | `/admin/dashboard` · `/admin/users` · `/admin/authors` · `/admin/books` · `/admin/coinpacks` · `/admin/transactions` · `/admin/reports` · `/admin/offers` · `/admin/settings` |

## 🎭 Demo Login

On `/login` or `/register`, scroll to the **✦ Demo Login** section and click any role:

- **📖 Reader** → `/reader/dashboard`
- **✍️ Author** → `/author/dashboard`
- **🛡️ Admin** → `/admin/dashboard`

No account needed — all data is mock/fake.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first) |
| Animation | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Editor | Tiptap |
| Slider | Swiper.js |

## 🎨 Design System

- **Primary:** Gold amber `#C9952A`
- **Accent:** Pure gold `#D4AF37`
- **Fonts:** Fraunces (display) · Public Sans (body) · Space Mono (numbers)
- **Themes:** Light (warm cream) · Dark (dark ink)

---

## 🚀 Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (public)/          # Home, Browse, Book detail, Login, Register
│   ├── (reader)/reader/   # Reader dashboard & sub-pages
│   ├── (author)/author/   # Author dashboard & sub-pages
│   └── (admin)/admin/     # Admin dashboard & sub-pages
├── components/            # Shared UI components
├── lib/
│   └── mockData.ts        # All fake data (no backend)
└── store/                 # Zustand stores
```

---

> **Phase 0 — Frontend only. No backend, no real auth, no payments.**
