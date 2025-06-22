# NCQ Platform Frontend Demo Credentials

## 🔐 Admin Dashboard (http://localhost:3001)

**Admin Account:**
- Email: `admin@ncq.sa`
- Password: `admin123`

This gives you access to:
- User management
- Tenant management
- Payment monitoring
- System analytics
- All admin features

## 👤 User Portal (http://localhost:3002)

**User Account:**
- Email: `user@ncq.sa`
- Password: `user123`

This gives you access to:
- File management dashboard
- Upload functionality
- Storage tracking
- API key management
- Team collaboration
- Premium plan features

## 🎯 Features to Explore

### Admin Dashboard
1. **Dashboard**: View platform statistics and recent activity
2. **Dark Mode**: Toggle between light/dark themes (top-right)
3. **Responsive Design**: Resize browser to see mobile layout
4. **Navigation**: Explore different sections in the sidebar
5. **User Menu**: Click on user avatar for profile options

### User Portal
1. **Dashboard**: See file statistics and quick actions
2. **Storage Meter**: Check storage usage in sidebar
3. **Profile**: View user profile with avatar gradient
4. **Notifications**: Check notification bell icon
5. **Registration**: Try creating a new account

## 📝 Notes

- Authentication is mocked - no backend required
- All data is simulated for demo purposes
- Forms have proper validation
- Both apps are fully responsive
- Dark mode preference is saved locally

## 🚀 Getting Started

1. Make sure both servers are running:
   ```bash
   # Terminal 1 - Admin Dashboard
   cd frontend/admin-dashboard
   npm run dev

   # Terminal 2 - User Portal  
   cd frontend/user-portal
   npm run dev
   ```

2. Open in your browser:
   - Admin: http://localhost:3001
   - User: http://localhost:3002

3. Use the credentials above to log in

4. Explore all features!

The mock authentication will work even without backend services running, allowing you to fully explore the UI/UX of both applications.