📚 StoryForge — Digital Publishing Platform

StoryForge is a modern full-stack digital publishing platform inspired by platforms like GoodNovel and WebNovel. It enables writers to publish serialized stories, readers to discover engaging novels, and administrators to manage the complete publishing workflow through a scalable moderation system.

The platform is designed with a production-ready architecture, separating business logic, editorial workflows, authentication, and future monetization features while maintaining a clean and responsive user experience.

🌐 Live Demo

Website: https://story-forge-dev.vercel.app

✨ Current Features
👤 Authentication & User Management
Email Registration & Login
Google OAuth Login
Email Verification Architecture
Secure JWT Authentication
HTTP-only Cookie Sessions
Protected Routes
Role Based Access Control (User / Admin)
✍️ Author Workspace
Become an Author Workflow
Author Profile Creation
SEO-friendly Author URLs
Author Dashboard
Book Management
Publishing Workflow
Earnings Dashboard UI
Analytics Dashboard UI
📖 Reader Experience
Browse Stories
Advanced Genre Filters
Book Detail Pages
Continue Reading
Personal Library
Bookmarks
Reading History
Wallet UI
Coin Purchase UI
Transaction History
Dark / Light Theme
📚 Publishing Workflow
Create Books
Draft Management
Edit Books
Soft Delete
SEO Slug Generation
Editorial Review Workflow
Admin Approval Process
Publishing Status Management
Version History
Review Notes
Audit Trail
🛡️ Admin Panel
Dashboard Overview
Book Moderation Queue
Author Management
Publishing Approval Workflow
Review Notes
Role-based Authorization
Event-driven Notification Architecture
🚀 Publishing Lifecycle
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
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Approve   Reject
 │          │
 ▼          ▼
Published  Draft
 │
 ▼
Create Chapters
 │
 ▼
Readers Read
 │
 ▼
Future Coin Unlock System
🛠️ Built With
Frontend
Next.js (App Router)
React
TypeScript
Tailwind CSS
Framer Motion
Zustand
React Hook Form
Zod
Backend
Next.js Route Handlers
MongoDB
Mongoose
JWT Authentication
HTTP-only Cookies
Google OAuth
Nodemailer
Database
MongoDB Atlas (Development)
VPS Hosted MongoDB (Production Ready)
🧱 Architecture

StoryForge follows a layered architecture to keep business logic maintainable and scalable.

Frontend

↓

Route Handlers

↓

Service Layer

↓

Database Models

↓

MongoDB

Business logic is separated from API routes, making the project easier to extend and maintain.

📂 Project Structure
StoryForge/

├── app/
│   ├── (public)/
│   ├── (dashboard)/
│   ├── (admin)/
│   └── api/
│
├── components/
│
├── models/
│
├── services/
│
├── lib/
│
├── middleware/
│
├── store/
│
├── types/
│
├── utils/
│
└── public/
📌 Current Development Progress
✅ Completed
Authentication System
Google OAuth
User Onboarding
Author Onboarding
MongoDB Database Models
Book Publishing Workflow
Editorial Moderation Workflow
Notification Architecture
Book Version History
Dashboard UI
Public Reader UI
🚧 In Progress
Frontend API Integration
Book Cover Upload
Chapter Editorial Workflow
Rich Text Chapter Editor
Reading Engine
Library Integration
📅 Planned
Wallet & Coin System
Chapter Unlocking
Author Earnings
Reader Reviews
Follow Authors
Search Engine
Analytics
Notifications
VPS Deployment
Object Storage Integration
🎯 Key Features
📚 Digital Book Publishing
✍️ Multi-author Platform
🔒 Secure Authentication
🧾 Editorial Approval Workflow
📖 Reading Progress
📚 Personal Library
🔖 Bookmarks
💰 Digital Wallet
🪙 Coin Economy (Upcoming)
📊 Author Analytics
⚙️ Admin Moderation
🌙 Dark Mode
📱 Responsive Design
🚀 Getting Started

Clone the repository:

git clone https://github.com/Harshit-raghav01/StoryForge.git

Navigate into the project:

cd StoryForge/frontend

Install dependencies:

npm install

Run the development server:

npm run dev

Visit:

http://localhost:3000
📸 Application Modules
Public
Home
Browse
Book Details
Reader Profile
Author Profile
Search
Reader Dashboard
Overview
Library
Wallet
Buy Coins
Reading History
Bookmarks
Transactions
Settings
Author Dashboard
My Books
Create Book
Chapter Editor
Earnings
Analytics
Admin Dashboard
Overview
Books
Authors
Users
Moderation
Reports
Analytics
📖 Development Status

StoryForge is actively being developed following a modular, production-oriented architecture.

Each major feature (Authentication, Publishing Workflow, Chapters, Reading Engine, Wallet, Administration) is implemented as an independent module to ensure scalability, maintainability, and future extensibility.

🤝 Contributing

Contributions are welcome.

Fork the repository.
Create a feature branch.
git checkout -b feature/your-feature
Commit your changes.
git commit -m "Add new feature"
Push your branch.
git push origin feature/your-feature
Open a Pull Request.
👨‍💻 Author

Harshit Raghav

GitHub: https://github.com/Harshit-raghav01

⭐ Show Your Support

If you found this project interesting, consider giving it a ⭐ on GitHub.

📌 Project Vision

StoryForge aims to provide an immersive digital publishing ecosystem where writers can build communities around their stories, readers can enjoy high-quality serialized fiction, and publishers can efficiently manage editorial workflows—all through a modern, scalable full-stack platform.
