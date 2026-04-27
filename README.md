#  FowCraft — Project Management SaaS
---

## 🖼️ Preview
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset2.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset3.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset4.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset5.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset6.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset7.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset8.png)
![image alt](https://github.com/M-tech-cmd/FowCraft/blob/5422e4e7b2e454212fee18ccb666142da5dd07f1/client/src/assets/img/preset9.png)

---

## ✨ Why FowCraft Exists
FowCraft is a full-stack SaaS-style project management platform built to simulate real-world enterprise workflows.
It enables teams to:
* Manage multiple workspaces & organizations
* Collaborate on projects and tasks
* Track progress with analytics
* Automate workflows via background jobs
* Scale collaboration using modern architecture
This project focuses on **real SaaS engineering patterns**, not just CRUD operations.

---

## 🧠 Key Features
### 🏢 Workspace & Organization System
* Multiple workspaces
* Team member invitations
* Role-based access

### 📋 Project & Task Management
* Task assignment & due dates
* Status tracking
* Team collaboration tools

### 📊 Analytics Dashboard
* Project progress tracking
* Completion rates
* Team insights

###  Authentication & Security
* Clerk authentication
* Organization management
* Secure session handling

### 📧 Automation & Background Jobs

* Email notifications on task assignment
* Due-date reminders
* Background workflows via Inngest

---

## 🏗️ Architecture

```
Frontend (React + Redux)
        ↓
Express API Server
        ↓
PostgreSQL (Neon)
        ↓
Background Jobs (Inngest)
        ↓
Authentication (Clerk)

```

This architecture mirrors real-world SaaS platforms.

---

## 🛠️ Tech Stack
### Frontend

* React.js
* Tailwind CSS
* Redux Toolkit
* Lucide React

### Backend

* Node.js
* Express.js
* PostgreSQL (Neon)

### SaaS Infrastructure

* Clerk Authentication
* Inngest Background Jobs
* Vercel Deployment

---

## ⚡ Getting Started

### 1️⃣ Clone Repo

```
git clone https://github.com/fowcraft.git
cd fowcraft

```

### 2️⃣ Install Dependencies

```
npm install

```

### 3️⃣ Run Development Server

```
npm run dev

```

Open:

```
http://localhost:5173
---

## 📂 Project Structure
```
fowcraft/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ redux/
│  ├─ hooks/
│  └─ App.jsx
├─ server/
├─ public/
└─ README.md
---

## Production-Level Concepts Demonstrated
This project showcases:
* SaaS-style architecture
* Organization-based data structure
* Scalable state management
* Background event workflows
* Email automation systems
* Deployment-ready backend patterns

---

## 🤝 Contributing
PRs are welcome.
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Open Pull Request

---

## 📜 License
MIT License
