#  Fitness Tracker (MERN Stack)

A full-stack Fitness Tracker web application built using **MongoDB, Express, React (Vite), and Node.js**. This app allows users to track workouts, nutrition, and fitness progress with secure authentication and an admin dashboard.

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Role-based access (Admin & User)

### 👤 User Features

* View & update profile
* Track workouts
* Log nutrition data
* Monitor fitness progress (weight, body fat)

### 🧑‍💼 Admin Features

* View all users
* Delete users
* Manage blogs
* Manage exercise guides
* View system statistics

### 📝 Blogs & Exercises

* Public blog system
* Exercise guide with categories and instructions

---

## 🛠️ Tech Stack

**Frontend:**

* React (Vite)
* Tailwind CSS

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Authentication:**

* JSON Web Tokens (JWT)
* bcryptjs (password hashing)

---

## 📁 Project Structure

```
Fitness-Tracker/
│
├── server.js
├── .env
├── package.json
├── index.html
├── Readme.md
├── tsconfig.json
└── vite.config.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/abdullah2309/fitness-tracker.git
cd fitness-tracker
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/fitness_tracker
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## ▶️ Run the Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### Auth

* `POST /api/signup`
* `POST /api/login`

### User

* `GET /api/user`
* `PUT /api/user`

### Workouts

* `GET /api/workouts`
* `POST /api/workouts`
* `DELETE /api/workouts/:id`

### Nutrition

* `GET /api/nutrition`
* `POST /api/nutrition`
* `DELETE /api/nutrition/:id`

### Progress

* `GET /api/progress`
* `POST /api/progress`
* `DELETE /api/progress/:id`

### Blogs

* `GET /api/blogs`
* `POST /api/blogs`

### Admin

* `GET /api/admin/users`
* `DELETE /api/admin/users/:id`
* `GET /api/admin/stats`
* `POST /api/admin/blogs`
* `DELETE /api/admin/blogs/:id`
* `POST /api/admin/exercises`
* `DELETE /api/admin/exercises/:id`

---

## 🔒 Security

* Passwords are hashed using **bcrypt**
* Protected routes using **JWT middleware**
* Role-based authorization for admin routes

---

## 📸 Screenshots (Optional)

###  User Dashboard  
<img src="https://github.com/abdullah2309/Fitness-Tracker/blob/main/assets/dash.png">

###  Admin Panel  
<img src="https://github.com/abdullah2309/Fitness-Tracker/blob/main/assets/Admin.png">


---

## 📌 Future Improvements

* Email verification system
* Password reset functionality
* File upload for profile pictures
* Advanced analytics dashboard
* Mobile app integration (Flutter)

---

## 👨‍💻 Author

**Abdullah**
Software Engineering Student | MERN Stack Developer

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
