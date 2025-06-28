# 🕘 Employee Attendance & Leave Management System

A full-stack Node.js + MySQL application to manage employee attendance (check-in, lunch, check-out with geolocation) and leave requests with admin-level approval capabilities.

---

## 🚀 Features

- ✅ JWT-based Authentication
- 🕐 Daily Attendance (Check-In, Lunch-Out, Lunch-In, Check-Out)
- 🌍 Geolocation capture during check-in
- 📅 Leave Request (Single and Range)
- 👨‍💼 Admin Panel for approving/declining leaves
- 📊 Employee calendar and leave viewing
- 🔐 Role-based Authorization (Admin & Employee)
- 📂 Sequelize ORM + MySQL

---

## 📁 Project Structure

```
/employee-attendance-system
│
├── controllers/            # Business logic for APIs
├── middleware/             # Auth and validation middleware
│   ├── auth/
│   └── validators/
├── models/                 # Sequelize models
├── routes/                 # Route definitions
├── config/                 # Database and environment config
├── utils/                  # Helper functions
├── .env                    # Environment variables
├── package.json            # Node.js dependencies
└── server.js               # Entry point
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/employee-attendance-system.git
cd employee-attendance-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=attendance_system
JWT_SECRET=your_jwt_secret
```

### 4. Setup MySQL Database

Make sure your MySQL server is running and create the database:

```sql
CREATE DATABASE attendance_system;
```

### 5. Run the Application

```bash
npm run dev
```

> Server will start at: `http://localhost:5000`

---

## 📮 API Endpoints

### 🔐 Auth

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/auth/signup`  | Register a new employee  |
| POST   | `/api/auth/login`   | Login and get token      |

### 🕐 Attendance

| Method | Endpoint                      | Description             |
|--------|-------------------------------|-------------------------|
| POST   | `/api/attendance/check-in`    | Mark check-in with location |
| PUT    | `/api/attendance/lunch-out`   | Mark lunch out          |
| PUT    | `/api/attendance/lunch-in`    | Mark lunch in           |
| PUT    | `/api/attendance/check-out`   | Mark check-out          |
| GET    | `/api/attendance`             | Admin: Filter by user/date |

### 🗓️ Leave Management

| Method | Endpoint                      | Description             |
|--------|-------------------------------|-------------------------|
| POST   | `/api/leave/request`          | Employee requests leave |
| GET    | `/api/leave`                  | Admin views all requests |
| PUT    | `/api/leave/:id/approve`      | Admin approves leave    |
| PUT    | `/api/leave/:id/decline`      | Admin declines leave    |

> ⚠️ All protected routes require the JWT in headers:
> ```
> Authorization: Bearer <your_token>
> ```

---

## 📦 Dependencies

The backend uses the following major packages:

```
bcrypt
cors
dotenv
express
express-validator
jsonwebtoken
moment
mysql2
sequelize
nodemon (dev)
```

You can also find them listed in `package.json`.

---

## 📌 Notes

- Geolocation is passed in the request body during check-in.
- Time entries are date-specific; duplicate entries for the same day are restricted.
- The attendance calendar highlights days with attendance and displays leave requests in the admin panel.

---

## 👨‍💻 Developer Info

**Monir Alam**  
📧 monirrza0641@gmail.com  
🎓 BCA, Tripura University (NIELIT Agartala)  
🌐 Full Stack Developer – React, Node.js, PHP, MySQL

---

## 🧪 Testing Tips

Use Postman to simulate:

- Signup/Login → Capture JWT
- Make authenticated attendance and leave requests
- Admin test: View all attendance and leave logs

---

## 🏁 Done!

You're ready to use and expand the **Employee Attendance & Leave Management System** 🎉