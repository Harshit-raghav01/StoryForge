# 📚 StoryForge — Digital Publishing Platform

StoryForge is a modern **full-stack digital publishing platform** inspired by platforms like **GoodNovel** and **WebNovel**. It enables writers to publish serialized stories, readers to discover immersive novels, and administrators to manage the complete publishing workflow through a scalable moderation system.

Built with a production-oriented architecture, StoryForge separates business logic, authentication, editorial workflows, and future monetization features while delivering a fast, responsive, and intuitive user experience.

## 🌐 Live Demo

**Website:** https://story-forge-dev.vercel.app/

---

## ✨ Features

### 👤 Authentication & User Management

* Email Registration & Login
* Google OAuth Authentication
* Secure JWT Authentication
* HTTP-only Cookie Sessions
* Protected Routes
* Email Verification Architecture
* Role-Based Access Control (Reader / Author / Admin)

### ✍️ Author Workspace

* Become an Author Workflow
* Author Profile Creation
* SEO-Friendly Author URLs
* Author Dashboard
* Book Management
* Publishing Workflow
* Earnings Dashboard
* Analytics Dashboard

### 📖 Reader Experience

* Browse Stories
* Genre-based Discovery
* Book Detail Pages
* Continue Reading
* Personal Library
* Bookmarks
* Reading History
* Wallet Interface
* Coin Purchase Interface
* Transaction History
* Dark & Light Theme

### 📚 Publishing Workflow

* Create Books
* Draft Management
* Edit Books
* Soft Delete
* SEO Slug Generation
* Editorial Review Workflow
* Publishing Approval System
* Version History
* Review Notes
* Audit Trail

### 🛡️ Admin Panel

* Dashboard Overview
* Book Moderation Queue
* Author Management
* Publishing Approval Workflow
* Review Notes
* Role-Based Authorization
* Event-driven Notification Architecture

---

## 🚀 Publishing Lifecycle

```text
Reader
      │
      ▼
Become Author
      │
      ▼
Create Book
      │
      ▼
Save Draft
      │
      ▼
Submit For Review
      │
      ▼
Admin Review
 │             │
 ▼             ▼
Approve     Reject
 │             │
 ▼             ▼
Published    Draft
      │
      ▼
Create Chapters
      │
      ▼
Readers Read
      │
      ▼
Future Coin Unlock System
```

---

## 🛠️ Built With

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Zustand
* React Hook Form
* Zod

### Backend

* Next.js Route Handlers
* MongoDB
* Mongoose
* JWT Authentication
* HTTP-only Cookies
* Google OAuth
* Nodemailer

### Database

* MongoDB Atlas
* VPS Hosted MongoDB (Production Ready)

---

## 🏗️ Architecture

StoryForge follows a modular layered architecture designed for scalability and maintainability.

```text
Frontend
      │
      ▼
Route Handlers
      │
      ▼
Service Layer
      │
      ▼
Database Models
      │
      ▼
MongoDB
```

Business logic is separated from API routes, making the project easier to maintain, extend, and test.

---

## 📂 Project Structure

```text
StoryForge/

├── app/
│   ├── (public)/
│   ├── (dashboard)/
│   ├── (admin)/
│   └── api/
│
├── components/
├── models/
├── services/
├── lib/
├── middleware/
├── store/
├── types/
├── utils/
└── public/
```

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/Harshit-raghav01/StoryForge.git
```

Navigate to the project:

```bash
cd StoryForge/frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

## 📌 Development Progress

### ✅ Completed

* Authentication System
* Google OAuth
* User Onboarding
* Author Onboarding
* MongoDB Database Models
* Book Publishing Workflow
* Editorial Moderation Workflow
* Notification Architecture
* Book Version History
* Dashboard UI
* Public Reader UI

### 🚧 In Progress

* Frontend API Integration
* Book Cover Upload
* Chapter Editorial Workflow
* Rich Text Chapter Editor
* Reading Engine
* Library Integration

### 📅 Planned

* Wallet & Coin System
* Chapter Unlocking
* Author Earnings
* Reader Reviews
* Follow Authors
* Global Search
* Advanced Analytics
* Real-time Notifications
* VPS Deployment
* Object Storage Integration

---

## 📚 Application Modules

### Public

* Home
* Browse
* Book Details
* Reader Profile
* Author Profile
* Search

### Reader Dashboard

* Overview
* Personal Library
* Wallet
* Buy Coins
* Reading History
* Bookmarks
* Transactions
* Settings

### Author Dashboard

* My Books
* Create Book
* Chapter Editor
* Earnings
* Analytics

### Admin Dashboard

* Overview
* Books
* Authors
* Users
* Moderation
* Reports
* Analytics

---

## 🎯 Key Highlights

* 📚 Digital Publishing Platform
* ✍️ Multi-author Ecosystem
* 🔐 Secure Authentication
* 📖 Serialized Reading Experience
* 🧾 Editorial Approval Workflow
* 📚 Personal Reader Library
* 🔖 Bookmarks & Reading History
* 💰 Digital Wallet
* 🪙 Coin Economy (Upcoming)
* 📊 Author Analytics
* ⚙️ Admin Moderation Panel
* 🌙 Dark Mode
* 📱 Fully Responsive Design
* 🚀 Scalable Production Architecture

---

## 🔮 Project Vision

StoryForge aims to create a complete digital publishing ecosystem where writers can build audiences around their stories, readers can enjoy immersive serialized fiction, and administrators can efficiently manage editorial workflows through a scalable, production-ready platform.

The long-term vision includes introducing digital wallets, premium chapter unlocking, creator monetization, reader communities, analytics, and intelligent recommendation systems.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## 👨‍💻 Author

**Harshit Raghav**

GitHub: https://github.com/Harshit-raghav01

---

## ⭐ Show Your Support

If you found this project interesting, consider giving it a ⭐ on GitHub.

---

**Building the future of digital storytelling—one chapter at a time.**
