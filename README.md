# MindMesh Employee Onboarding Platform

A modern HR operations and employee onboarding platform built with React, TypeScript, Vite, and Supabase.

## 📋 Overview

MindMesh is a comprehensive employee onboarding and HR management system that streamlines the onboarding process, attendance tracking, leave management, and administrative workflows.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Form Handling**: React Hook Form + Yup
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📦 Prerequisites

- Node.js >= 16.x
- npm or yarn
- Supabase account (for backend services)

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Employee-Onboarding
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Never commit `.env` or `.env.local` files to version control.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5 Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

## 📁 Project Structure

```
src/
├── lib/                 # Core utilities & configuration
│   ├── supabase.ts     # Centralized Supabase client
│   ├── constants.ts    # App-wide constants
│   └── utils.ts        # Helper functions
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── forms/          # Form components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── hr/             # HR management components
│   └── onboarding/     # Onboarding flow components
├── pages/              # Route pages
│   ├── auth/           # Login, signup pages
│   ├── dashboard/      # Dashboard pages
│   ├── hr/             # HR management pages
│   └── onboarding/     # Onboarding pages
├── services/           # API layer
│   ├── api.ts          # Supabase API calls
│   └── authService.ts  # Authentication service
├── store/              # Zustand state stores
│   ├── authStore.ts    # Authentication state
│   ├── onboardingStore.ts
│   └── taskStore.ts
├── types/              # TypeScript type definitions
│   ├── mindmesh.d.ts   # Core types
│   ├── supabase.ts     # Generated Supabase types
│   └── onboarding.d.ts
├── hooks/              # Custom React hooks
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🌐 Deployment to Vercel

### Quick Deployment

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Connect to Vercel**:
   - Push your code to GitHub
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect the framework

3. **Configure Environment Variables**:
   In Vercel dashboard, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Environment Configuration

The project includes a `vercel.json` configuration:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite (auto-detected)

## 🔐 Authentication & Authorization

The app uses Supabase Auth with role-based access control (RBAC):
- **Admin**: Full system access
- **HR**: Employee management, onboarding, attendance
- **Manager**: Team oversight, approvals
- **Employee**: Self-service portal
- **Field Officer**: Mobile field operations
- **Guest**: Limited access

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `roles` - Role-based permissions
- `attendance` - Attendance records
- `leave_requests` - Leave management
- `tasks` - Task assignments
- `onboarding_submissions` - Employee onboarding data
- `organizations` - Organization management

## 📱 Features

- ✅ Employee Onboarding Workflow
- ✅ Attendance Tracking (Check-in/Check-out)
- ✅ Leave Management System
- ✅ Task Assignment & Tracking
- ✅ Role-Based Access Control
- ✅ Document Upload & Management
- ✅ Organization Management
- ✅ Real-time Notifications
- ✅ Responsive Design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 💬 Support

For issues and questions, please contact the development team.

---

Built with ❤️ by the MindMesh Team
