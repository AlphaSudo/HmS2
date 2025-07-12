# Hospital Management System - Frontend Setup Guide

This guide will help you run the frontend of the Hospital Management System on your machine.

## Prerequisites

Before you start, make sure you have the following installed on your machine:

### 1. Node.js (Required)
- **Version**: 18.x or higher
- **Download**: https://nodejs.org/
- **Verify**: Run `node --version` and `npm --version` in your terminal

### 2. Git (Required)
- **Download**: https://git-scm.com/
- **Verify**: Run `git --version` in your terminal

## Step-by-Step Setup Instructions

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone <your-repository-url>
cd "Hospital Management System"
```

### Step 2: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 3: Install Dependencies
```bash
# Install all required packages
npm install
```

**Note**: This might take a few minutes as it installs all the dependencies listed in `package.json`.

### Step 4: Environment Setup (Optional)
The frontend can run without a database connection for development purposes. However, if you want full functionality, you'll need to set up environment variables.

Create a `.env` file in the `frontend` directory:
```bash
# Create .env file (optional for basic frontend demo)
touch .env
```

Add the following to your `.env` file (optional):
```env
# Database URL (optional - frontend will work without this for demo)
DATABASE_URL=your_database_url_here

# Server configuration
PORT=5000
HOST=127.0.0.1
NODE_ENV=development
```

### Step 5: Start the Development Server
```bash
# Start the development server
npm run dev
```

### Step 6: Access the Application
Once the server starts successfully, you should see output like:
```
Server running on http://127.0.0.1:5000
Environment: development
```

Open your web browser and navigate to:
- **Local**: http://localhost:5000
- **Network**: http://127.0.0.1:5000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema (requires DATABASE_URL)

## Troubleshooting

### Common Issues and Solutions

#### 1. **Vite Error Page with Flower Icon** ⚠️
**Problem**: You see a Vite error page with a flower/plant icon instead of your application.

**Solutions**:

**Option A: Clear Cache and Reinstall**
```bash
# Stop the server (Ctrl+C)
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Start server again
npm run dev
```

**Option B: Use Alternative Port**
```bash
# Try a different port
set PORT=3000 && npm run dev
# Then visit http://localhost:3000
```

**Option C: Check for Missing Files**
```bash
# Verify these files exist:
ls client/public/index.html
ls client/src/main.tsx
ls client/src/App.tsx
```

**Option D: Manual Vite Start (Alternative)**
```bash
# Navigate to client directory
cd client

# Install dependencies in client directory
npm install

# Start Vite directly
npx vite --port 3000
```

#### 2. Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**: 
```bash
# Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use a different port
set PORT=3000 && npm run dev
```

#### 3. Node Modules Issues
**Error**: `Cannot find module` or similar

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
**Error**: TypeScript compilation errors

**Solution**:
```bash
# Check TypeScript
npm run check

# If there are errors, they might be related to missing backend services
# The frontend should still run in demo mode
```

#### 5. Permission Denied (Windows)
**Error**: Permission denied when running npm commands

**Solution**:
- Run PowerShell as Administrator
- Or use Command Prompt as Administrator

#### 6. **Browser Console Errors**
**Problem**: Check browser console (F12) for specific error messages

**Common Fixes**:
```bash
# If you see module resolution errors:
npm install --legacy-peer-deps

# If you see TypeScript errors:
npm run check

# If you see build errors:
npm run build
```

### Frontend-Only Mode

Since you're running only the frontend, some features might not work:
- **Authentication**: Login/logout functionality
- **Data Persistence**: Saving data to database
- **Real-time Updates**: WebSocket connections
- **File Uploads**: Backend file handling

The frontend will still display the UI and demonstrate the interface design.

## Project Structure

```
frontend/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── ...
├── server/                # Express server
├── shared/                # Shared schemas
├── package.json           # Dependencies
└── vite.config.ts         # Vite configuration
```

## Features Available in Frontend-Only Mode

✅ **UI Components**: All React components and pages
✅ **Routing**: Navigation between pages
✅ **Styling**: Tailwind CSS and custom styles
✅ **Internationalization**: Multi-language support
✅ **Theme**: Dark/light mode switching
✅ **Responsive Design**: Mobile-friendly interface
✅ **Charts and Visualizations**: Using Recharts
✅ **Form Validation**: Client-side validation

## Next Steps

If you want to run the full application with backend services:

1. Set up the database (PostgreSQL)
2. Configure environment variables
3. Run backend microservices
4. Set up API Gateway

For now, enjoy exploring the frontend interface! 🎉

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify Node.js version is 18+ 
3. Ensure all dependencies are installed
4. Check console for error messages
5. Try the alternative solutions for Vite errors

Happy coding! 🚀 