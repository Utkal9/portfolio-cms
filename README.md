```markdown
# Utkal Behera - Dynamic Personal Portfolio

A highly interactive, full-stack personal portfolio built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). This portfolio goes beyond a static site by featuring a complete custom Admin Dashboard, allowing real-time content management without touching the codebase.

## 🚀 Features

* **Dynamic Content Management**: Manage Projects, Skills, Experiences, Education, Certifications, and Semesters directly from a protected Admin Dashboard.
* **Immersive UI/UX**: Features smooth page transitions, GSAP animations, Framer Motion, and a custom Three.js/Canvas particle cursor for a premium feel.
* **Live Coding Stats**: Real-time LeetCode statistics integration via a custom GraphQL proxy.
* **Site Configuration System**: Toggle visibility of specific sections, reorder sections, and update hero text, themes, and SEO metadata directly from the admin panel.
* **Integrated Contact System**: Messages sent via the contact form are stored in the database and forwarded using Nodemailer/Resend and SendGrid.
* **Secure Authentication**: JWT-based authentication and Bcrypt password hashing for the admin portal.
* **Cloud Storage Integration**: Direct integration with Cloudinary for uploading and managing project images, certificates, and resumes.

## 💻 Tech Stack

**Frontend**
* **Framework:** React 18 (with Vite)
* **Styling:** Tailwind CSS, PostCSS
* **Animations:** Framer Motion, GSAP, @react-three/fiber, @react-three/drei
* **State Management:** Zustand
* **Routing:** React Router DOM
* **Icons & Typography:** Lucide React, React Icons

**Backend**
* **Environment:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
* **File Uploads:** Multer, Cloudinary, Streamifier
* **Email Services:** Nodemailer, Resend, @sendgrid/mail

## 🛠️ Installation & Setup

### Prerequisites
* Node.js installed on your machine
* A MongoDB database URI
* A Cloudinary account for media storage
* A Gmail/Resend account for contact form emails

### 1. Clone the repository
```bash
git clone [https://github.com/utkal9/My-Portfolio.git](https://github.com/utkal9/My-Portfolio.git)
cd My-Portfolio

```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory based on the `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
MAIL_USER=utkalbehera59@gmail.com
MAIL_PASS=your_app_password
ADMIN_EMAIL=utkalbehera59@gmail.com

# Admin Default Credentials (Change upon first login)
ADMIN_EMAIL_DEFAULT=utkalbehera59@gmail.com
ADMIN_PASSWORD_DEFAULT=Admin@123

```

Run the backend server:

```bash
npm run dev

```

*Note: Upon the first successful database connection, an initial admin user is automatically seeded using the credentials provided in your `.env` file.*

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and run the development server.

```bash
cd frontend
npm install

```

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api

```

Run the frontend server:

```bash
npm run dev

```

## 📁 Project Structure

```text
├── backend/
│   ├── config/         # Database and Cloudinary configurations
│   ├── controllers/    # Route controllers logic
│   ├── middleware/     # JWT verification and upload middlewares
│   ├── models/         # Mongoose schemas (User, Project, SiteConfig, etc.)
│   ├── routes/         # Express API routes
│   └── server.js       # Entry point for the Node.js server
│
└── frontend/
    ├── public/         # Static assets, SVG logos, favicons
    ├── src/
    │   ├── components/ # Reusable UI components & Admin panels
    │   ├── pages/      # Top-level route pages (Portfolio, Login, AdminDashboard)
    │   ├── services/   # Axios API configurations
    │   ├── store/      # Zustand state management
    │   ├── App.jsx     # Main React component with routing and Particle setup
    │   └── main.jsx    # React DOM rendering entry
    └── tailwind.config.js # Tailwind styling rules

```

## 📜 License

© 2026 Utkal Behera. All rights reserved.
