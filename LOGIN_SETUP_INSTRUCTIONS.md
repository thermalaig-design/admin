# Login System Setup Guide

This guide explains how to set up the login system with username/password authentication and forgot password functionality for the hospital management system.

## Features Implemented

1. **Login Form** - Secure username/password login
2. **Forgot Password** - Password reset functionality
3. **User Management** - Custom users table in Supabase
4. **Protected Routes** - Admin panel access control

## Setup Instructions

### 1. Create Users Table in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com)
2. Navigate to your project
3. Go to the **SQL Editor** section
4. Copy and paste the contents of `backend/create_users_table.sql`
5. Click **Run** to execute

### 2. Environment Variables

Ensure your `.env` file contains:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Available Routes

- `/` - Home page (public)
- `/login` - Login page
- `/admin` - Admin panel (protected)
- `/admin/appointments` - Appointments page (protected)
- `/admin/referrals` - Referrals page (protected)

### 4. Sample Credentials

After setting up the users table, you'll have these sample accounts:

- Username: `admin`, Password: `admin123`
- Username: `doctor1`, Password: `doctor123`
- Username: `staff1`, Password: `staff123`

## How to Use

1. Visit your application
2. Click on the login link or navigate to `/login`
3. Enter your username and password
4. After successful login, you'll be redirected to the admin panel
5. Use the logout button in the admin panel to sign out

## Security Notes

⚠️ **Important**: This implementation uses basic password handling for demonstration purposes. In a production environment:

- Always hash passwords using bcrypt or similar
- Implement proper password reset tokens
- Use stronger authentication mechanisms
- Add rate limiting for login attempts
- Implement session management

## Files Created

- `src/components/LoginForm.jsx` - Login form component
- `src/services/authService.js` - Authentication service
- `backend/create_users_table.sql` - SQL for users table
- `backend/setup_users_table.js` - Setup script
- Updated `src/App.jsx` - Added authentication routes
- Updated `src/admin/AdminPanel.jsx` - Added logout functionality

## Troubleshooting

### Login doesn't work
- Verify the users table exists in Supabase
- Check that environment variables are correctly set
- Ensure the service role key has proper permissions

### Forgot password not working
- The current implementation shows a message but doesn't send actual emails
- In production, implement email sending with reset tokens

### Protected routes accessible without login
- Verify that the authentication logic in App.jsx is working
- Check that localStorage session is being properly managed