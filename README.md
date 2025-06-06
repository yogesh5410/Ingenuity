# 🧠 Ingenuity – Competitive Programming Club Website

Welcome to the official platform of **Ingenuity**, the Competitive Programming Club of **IIT Bhilai**!  
This full-stack web application streamlines CP event management, daily problem tracking, leaderboards, and community engagement to promote consistent practice and coding excellence.

---

## 🌐 Live Website

🔗 **[Visit Now → ingenuity-3.vercel.app](https://ingenuity-3.vercel.app/)**

---

## 📸 Screenshots

| Home Page | Leaderboard | Admin Panel |
|-----------|-------------|-------------|
| ![Home](./assets/home.png) | ![Leaderboard](./assets/leaderboard.png) | ![Admin](./assets/admin.png) |


---

## 🚀 Features

### 👤 User Panel
- 🔐 Secure login using college Gmail IDs
- 📩 OTP verification via Gmail (Nodemailer)
- 📚 Store user details: Name, Email, LeetCode ID, Codeforces ID
- 📊 Personalized dashboard showing:
  - Current points
  - Rank
  - Streak (with GitHub-style heatmap)

### 📆 Problem of the Day (POTD)
- 🧠 Curated daily DSA problems with:
  - Title, link, difficulty
- ✅ "Mark as Solved" to auto-update score
- 💡 Hints (optional) with custom point deductions
- 🔥 Streak tracking + leaderboard

### 🗓️ Event Calendar
- 🧭 Fetch contests from 4 platforms:
  - Codeforces, LeetCode, GeeksforGeeks, CodeChef
- 🌐 Auto timezone conversion
- 🗂 Responsive and sorted by date/time

### 🛠️ Admin Panel
- ➕ Add new POTDs
- 💬 Add/edit hints with dynamic deduction
- 🔎 View users, submissions, stats
- 🧮 Point resets and streak management

### 📚 Informational Pages
- 🏢 About Us
- 🎉 Events 
- 📘 Resources
- ✍️ Blog
- 📬 Contact Us

---

## ⚙️ Tech Stack

| Area             | Tools / Libraries                              |
|------------------|------------------------------------------------|
| **Frontend**     | React, Tailwind CSS, React Router              |
| **Backend**      | Node.js, Express                               |
| **Database**     | MongoDB (via Mongoose)                         |
| **Authentication**| JWT + Gmail OTP (via Nodemailer)             |
| **APIs Used**    | Codeforces, LeetCode, GeeksforGeeks, CodeChef |
| **Deployment**   | Vercel (Frontend), Render (Backend)     |

---

## 🧑‍💻 Getting Started Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/ingenuity-cp-club.git
cd ingenuity-cp-club
```

### 2️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev  # or npm start
```

Runs the React client on localhost:5173 (or specified port)

### 3️⃣ Setup Backend

```bash
cd server
npm install
npm run dev  # or: node server.js
```

Runs Express backend on localhost:5000 (or specified port)

### 4️⃣ Environment Variables

Create a `.env` file in `server/` directory:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_id
EMAIL_PASS=your_gmail_app_password
```

---

## 🤝 Contributing

We welcome contributions from developers and club members!

**Steps:**

```bash
# 1. Fork this repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit changes
git commit -m "✨ Add: new feature"

# 4. Push to GitHub
git push origin feature/your-feature-name

# 5. Open a pull request 🚀
```

---

## 🧩 Future Features (Ideas)

- 🧪 Codeforces API OAuth Integration (auto-verify submissions)
- 📬 Notifications via Email or Telegram Bot
- 📈 Club-wide analytics dashboard
- 🗂️ Topic-wise problem archives
- 🎖️ Custom badges based on milestones (streaks, rank jumps)
- 🧠 AI-powered problem recommendations based on history

---

## 📝 License

This project is licensed under the MIT License.

---

## 📬 Contact Us

📧 ingenuity@iitbhilai.ac.in  
🌐 https://ingenuity-3.vercel.app

---

**Made with ❤️ by Yogesh**
