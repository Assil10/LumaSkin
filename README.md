# 🌟 LumaSkin - Your Personal Skincare Journey

<div align="center">

![LumaSkin Logo](https://img.shields.io/badge/LumaSkin-Skincare%20AI-blue?style=for-the-badge&logo=sparkles)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-blue?style=for-the-badge&logo=cloudinary)

*Track your skincare routine, get personalized recommendations, and monitor your skin progress with AI-powered analysis*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- **Secure User Registration & Login** with JWT tokens
- **Password Reset** via email with secure token validation
- **Profile Management** with avatar uploads
- **Protected Routes** with authentication guards
- **Auto Token Refresh** for seamless user experience

### 🧠 **AI-Powered Analysis**
- **Skin Condition Analysis** using advanced AI algorithms
- **Personalized Recommendations** based on your skin type
- **Progress Tracking** with visual charts and insights
- **Smart Product Suggestions** tailored to your needs

### 📱 **Modern User Experience**
- **Responsive Design** that works on all devices
- **Beautiful UI** built with Tailwind CSS and shadcn/ui
- **Real-time Updates** with instant feedback
- **Intuitive Navigation** with smooth transitions

### 🛠 **Technical Excellence**
- **Full-Stack Next.js** with TypeScript
- **MongoDB Database** with Mongoose ODM
- **Cloudinary Integration** for image management
- **Email Notifications** with professional templates
- **Production Ready** with comprehensive error handling

---

## 🛠 Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Radix UI |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT, bcryptjs, Custom Auth System |
| **File Storage** | Cloudinary CDN |
| **Email** | Nodemailer, SMTP |
| **Deployment** | Vercel Ready |

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email)

### 1. Clone the Repository
```bash
git clone https://github.com/Assil10/LumaSkin.git
cd LumaSkin
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# 🌐 MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lumaskin
# For production: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumaskin

# 🔐 JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# ☁️ Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# 📧 Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@lumaskin.com

# ⚙️ App Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# 🔄 Password Reset
PASSWORD_RESET_EXPIRES_IN=1h
```

### 4. Run the Application
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application!

---

## 📁 Project Structure

```
LumaSkin/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API Routes
│   │   ├── 📁 auth/          # Authentication endpoints
│   │   └── 📁 user/          # User management endpoints
│   ├── 📁 auth/              # Authentication pages
│   ├── 📁 profile/           # User profile pages
│   └── 📁 analyze/           # Skin analysis pages
├── 📁 components/            # Reusable UI components
│   ├── 📁 ui/               # shadcn/ui components
│   └── auth-guard.tsx       # Route protection
├── 📁 hooks/                # Custom React hooks
├── 📁 lib/                  # Utility libraries
│   ├── 📁 models/           # MongoDB schemas
│   ├── auth.ts              # Authentication utilities
│   ├── cloudinary.ts        # Image upload utilities
│   ├── email.ts             # Email utilities
│   └── mongodb.ts           # Database connection
├── 📁 public/               # Static assets
└── 📁 styles/               # Global styles
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `POST` | `/api/auth/refresh` | Token refresh |
| `POST` | `/api/auth/forgot-password` | Password reset request |
| `POST` | `/api/auth/reset-password` | Password reset completion |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/profile` | Get user profile |
| `PUT` | `/api/user/profile` | Update user profile |

---

## 🔐 Authentication Flow

```mermaid
graph TD
    A[User Registration] --> B[Email Verification]
    B --> C[Login]
    C --> D[JWT Token Generation]
    D --> E[Protected Routes Access]
    E --> F[Token Refresh]
    F --> G[Logout & Token Invalidation]
```

---

## 🎨 Features Showcase

### 🔐 Secure Authentication
- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs (12 rounds)
- Email verification and password reset
- Protected routes with authentication guards

### 📊 Skin Analysis Dashboard
- AI-powered skin condition analysis
- Progress tracking with visual charts
- Personalized product recommendations
- Historical data comparison

### 👤 User Profile Management
- Avatar upload with Cloudinary
- Profile information editing
- Account settings management
- Data export capabilities

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Use the provided Dockerfile
- **AWS**: Deploy using AWS Amplify or EC2

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for image management

---

<div align="center">

**Made with ❤️ by [Your Name]**

[⭐ Star this repo](#) • [📧 Contact](#) • [🌐 Website](#)

</div>
