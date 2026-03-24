# 🚀 PrepMate – AI-Powered Interview Preparation Platform

PrepMate is a full-stack AI-driven interview preparation platform that helps users generate personalized interview questions, explore detailed concept explanations, and organize their learning through structured sessions.

Built with a focus on real-world usability, PrepMate transforms scattered preparation into a **guided, interactive, and AI-assisted learning experience**.

---

## ✨ Key Features

### 🔐 Authentication & User Management

* Secure login & signup using JWT authentication
* Profile image upload support
* Persistent user sessions using local storage

### 🧠 AI-Powered Interview Preparation

* Generate interview questions based on:

  * Role
  * Experience level
  * Topics of focus
* AI-generated **model answers** for each question
* Dynamic **“Load More Questions”** functionality

### 📚 Deep Concept Learning

* “Learn More” feature for each question
* AI-generated:

  * Detailed explanations
  * Answering strategies
  * Quick revision notes
* Clean UI using a side **Drawer panel**

### 📌 Smart Organization

* Pin/unpin important questions
* Structured session-based learning
* Save and revisit multiple interview sessions

### 📝 Rich Content Rendering

* Markdown-based AI responses
* Syntax-highlighted code blocks
* Copy-to-clipboard for code snippets

### 🎯 User Experience Enhancements

* Skeleton loaders & spinners for async operations
* Toast notifications for feedback
* Smooth animations using Framer Motion
* Expandable Q&A cards

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios
* Framer Motion
* React Markdown + Prism (code highlighting)
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* OpenRouter API (AI integration)

---

## 📁 Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── Cards/
│   │   ├── Inputs/
│   │   ├── layouts/
│   │   ├── Loader/
│   │   ├── Modal.jsx
│   │   └── Drawer.jsx
│   │
│   ├── context/
│   │   └── userContext.jsx
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Home/
│   │   ├── InterviewPrep/
│   │   └── LandingPage.jsx
│   │
│   ├── utils/
│   │   ├── axiosInstance.js
│   │   ├── apiPath.js
│   │   ├── helper.js
│   │   └── uploadImage.js
│   │
│   ├── App.jsx
│   └── index.css
│
backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
```

---

## 🔌 API Endpoints Summary

### 🔐 Auth

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login user
* `GET /api/auth/profile` → Get logged-in user

### 🖼️ Image

* `POST /api/auth/upload-image` → Upload profile image

### 🤖 AI

* `POST /api/ai/generate-questions` → Generate interview Q&A
* `POST /api/ai/generate-explanation` → Generate concept explanation

### 📦 Sessions

* `POST /api/sessions/create` → Create session
* `GET /api/sessions/my-sessions` → Get all sessions
* `GET /api/sessions/:id` → Get session details
* `DELETE /api/sessions/:id` → Delete session

### ❓ Questions

* `POST /api/questions/add` → Add questions to session
* `POST /api/questions/:id/pin` → Pin/unpin question
* `POST /api/questions/:id/note` → Add/update note

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend `.env`

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Frontend

No sensitive keys required (uses backend APIs)

---





