# 🔐 Login Implementation Guide

## ✅ What's Been Created

### 1. **LoginScreen Component** (`src/screens/LoginScreen.tsx`)
- Email and password input fields
- Login button with loading state
- Form validation
- AsyncStorage for token persistence
- Error handling with alerts

### 2. **API Configuration** (`src/config/api.ts`)
- Centralized API endpoints
- Environment-based URL switching (dev/prod)
- Easy configuration for different environments

### 3. **App Navigation Updated** (`App.tsx`)
- Login screen set as initial route
- Navigation flow: Login → Home → Products

## 🚀 How to Use

### 1. **Configure Backend URL**

Edit `src/config/api.ts`:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000'  // For Android Emulator
  : 'https://your-ec2-domain.com';  // For Production
```

**Environment-specific URLs:**
- **Android Emulator**: `http://10.0.2.2:3000`
- **iOS Simulator**: `http://localhost:3000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:3000` (e.g., `http://192.168.1.100:3000`)
- **EC2 Production**: `https://your-ec2-domain.com` or `http://your-ec2-ip:3000`

### 2. **Test Credentials**

Use your backend's existing users or create test credentials:

```bash
# Using your backend's register endpoint
POST http://localhost:3000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "admin"
}
```

### 3. **Run the App**

```bash
# Start Metro
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## 🔧 How It Works

### Authentication Flow

1. **User enters credentials** → Email & Password
2. **App sends request** → `POST /api/auth/login`
3. **Backend validates** → Returns `{ token, user }`
4. **App saves data** → AsyncStorage stores token and user info
5. **Navigation** → Redirects to Home screen

### Token Storage

```typescript
// Token is saved for future API calls
await AsyncStorage.setItem('token', data.token);
await AsyncStorage.setItem('user', JSON.stringify(data.user));
```

### Making Authenticated Requests

```typescript
// Get token from storage
const token = await AsyncStorage.getItem('token');

// Use in API calls
fetch(API_ENDPOINTS.PRODUCTS, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
```

## 📱 Features Implemented

- ✅ Email/password login
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Token persistence
- ✅ Auto-navigation after login
- ✅ Forgot password button (placeholder)

## 🎨 Customization

### Change Colors

Edit `LoginScreen.tsx` styles:

```typescript
const styles = StyleSheet.create({
  title: {
    color: '#14b8a6',  // Change brand color
  },
  button: {
    backgroundColor: '#14b8a6',  // Change button color
  },
});
```

### Add Features

1. **Remember Me**: Add checkbox to skip login
2. **Biometric Auth**: Add fingerprint/face ID
3. **Social Login**: Add Google/Facebook OAuth
4. **Password Reset**: Implement forgot password flow

## 🐛 Troubleshooting

### "Network request failed"

**Android Emulator can't reach localhost:**
```typescript
// Use 10.0.2.2 instead of localhost
const API_BASE_URL = 'http://10.0.2.2:3000';
```

**Physical device can't connect:**
- Ensure device is on same WiFi network
- Use your computer's IP address
- Check firewall settings

### Backend Returns 401

- Verify credentials are correct
- Check backend is running (`npm start` in backend folder)
- Verify API endpoint matches backend route

### "Invalid email or password"

- Check that the user exists in your database
- Verify password is correct (case-sensitive)
- Check backend console for errors

## 🔒 Security Notes

1. **Never commit production URLs** with credentials
2. **Use HTTPS in production**
3. **Implement token refresh** for better security
4. **Add rate limiting** on backend login endpoint
5. **Validate on backend**, not just frontend

## 📚 Next Steps

1. **Implement logout**: Clear AsyncStorage and navigate to Login
2. **Add token expiration**: Check JWT expiry
3. **Protected routes**: Add auth middleware to check token
4. **User profile**: Display logged-in user info
5. **Auto-login**: Check token on app start

## 🔗 Backend Integration

Your backend endpoints being used:

- **Login**: `POST /api/auth/login`
  ```json
  Request: { "email": "user@example.com", "password": "pass123" }
  Response: { "token": "jwt-token", "user": { "id": 1, "name": "User", "email": "...", "role": "admin" } }
  ```

- **Register**: `POST /api/auth/register` (ready to implement)
- **Reset Password**: `POST /api/auth/reset-password` (ready to implement)
