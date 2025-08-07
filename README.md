# LumaSkin - Complete Authentication System

A comprehensive skincare application with full authentication system built with Next.js, MongoDB, and Cloudinary.

## Features

### Authentication System
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password reset via email
- ✅ Token refresh mechanism
- ✅ Protected routes with authentication guard
- ✅ User profile management
- ✅ Avatar upload with Cloudinary
- ✅ Complete error handling

### Security Features
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Refresh token rotation
- ✅ Secure password reset tokens
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Rate limiting ready

### Email System
- ✅ Password reset emails
- ✅ Welcome emails
- ✅ Professional email templates
- ✅ SMTP configuration (Gmail support)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Styling**: Tailwind CSS, shadcn/ui
- **Password Hashing**: bcryptjs

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lumaskin
# For production: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumaskin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@lumaskin.com

# App Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Password Reset
PASSWORD_RESET_EXPIRES_IN=1h
```

### 3. MongoDB Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `lumaskin`

#### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 4. Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary variables in `.env`

### 5. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update the email variables in `.env`

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Authentication Flow

1. **Registration**: User creates account → JWT token generated → User logged in
2. **Login**: User provides credentials → JWT token generated → User logged in
3. **Token Refresh**: Automatic token refresh every 14 minutes
4. **Password Reset**: User requests reset → Email sent → User clicks link → Password reset
5. **Logout**: Refresh token invalidated → User logged out

## Security Features

- **Password Security**: 12-round bcrypt hashing
- **Token Security**: JWT with refresh token rotation
- **Email Security**: Secure password reset tokens with expiration
- **Input Validation**: Comprehensive validation on all inputs
- **Error Handling**: Secure error messages without information leakage

## File Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── refresh/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   └── reset-password/route.ts
│   │   └── user/
│   │       └── profile/route.ts
│   ├── auth/
│   │   ├── page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── layout.tsx
├── components/
│   ├── auth-guard.tsx
│   └── ui/
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── email.ts
│   ├── mongodb.ts
│   └── models/
│       └── User.ts
└── package.json
```

## Usage Examples

### Protected Route
```tsx
import AuthGuard from '@/components/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  )
}
```

### Using Authentication Hook
```tsx
import { useAuth } from '@/hooks/useAuth'

export default function MyComponent() {
  const { user, login, logout } = useAuth()

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password')
    if (result.success) {
      console.log('Login successful')
    } else {
      console.error('Login failed:', result.error)
    }
  }

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Clear messages for invalid inputs
- **Authentication Errors**: Secure error messages
- **Network Errors**: Graceful fallbacks
- **Database Errors**: Proper error logging
- **File Upload Errors**: User-friendly error messages

## Production Deployment

1. Set up environment variables for production
2. Use MongoDB Atlas for database
3. Configure Cloudinary for file storage
4. Set up email service (Gmail or other SMTP provider)
5. Deploy to Vercel, Netlify, or your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications.
