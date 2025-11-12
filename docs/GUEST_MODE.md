# 👋 Guest Mode Implementation

## ✅ What's Been Added

### 1. **Guest Access Button** (`LoginScreen.tsx`)
- Added "Continue as Guest" button below login
- Allows users to skip authentication
- Styled with outlined button design

### 2. **Guest Header** (`HomeScreen.tsx`)
- Shows "👋 Guest Mode" banner when not logged in
- Displays "Sign In" button to go back to login
- Different styling (orange/amber theme) to distinguish from logged-in users

### 3. **ProtectedFeature Component** (`src/components/ProtectedFeature.tsx`)
- Reusable component to protect features
- Shows lock icon and message for guests
- Provides "Sign In" button to authenticate

## 🎨 User Experience

### Login Screen
```
┌─────────────────────────┐
│     Smart Ops           │
│  Sign in to continue    │
│                         │
│  [Email Input]          │
│  [Password Input]       │
│                         │
│  [    Login    ]        │ ← Primary button (teal)
│  [ Continue as Guest ]  │ ← New: Outlined button
│                         │
│  Forgot Password?       │
└─────────────────────────┘
```

### Home Screen - Logged In
```
┌─────────────────────────┐
│ Welcome, John! [Logout] │ ← User info (gray bg)
│                         │
│   [Product Content]     │
└─────────────────────────┘
```

### Home Screen - Guest Mode
```
┌─────────────────────────┐
│ 👋 Guest Mode [Sign In] │ ← Guest banner (amber bg)
│                         │
│   [Product Content]     │
└─────────────────────────┘
```

## 💡 How to Use ProtectedFeature Component

### Example 1: Protect entire section
```tsx
import ProtectedFeature from '../components/ProtectedFeature';

function MyScreen() {
  return (
    <View>
      <ProtectedFeature guestMessage="Sign in to manage your orders">
        <OrdersList />
        <CreateOrderButton />
      </ProtectedFeature>
    </View>
  );
}
```

### Example 2: Protect specific button
```tsx
function ProductScreen() {
  const { isAuthenticated } = useAuth();
  
  return (
    <View>
      <ProductDetails />
      
      {isAuthenticated ? (
        <Button title="Add to Cart" />
      ) : (
        <ProtectedFeature guestMessage="Sign in to add items to cart">
          <></>
        </ProtectedFeature>
      )}
    </View>
  );
}
```

### Example 3: Conditional features
```tsx
function HomeScreen() {
  const { user } = useAuth();
  
  return (
    <View>
      {/* Everyone can see products */}
      <ProductList />
      
      {/* Only logged-in users can create proposals */}
      {user ? (
        <CreateProposalButton />
      ) : (
        <Text>Sign in to create proposals</Text>
      )}
    </View>
  );
}
```

## 🔒 Access Levels

### Guest Users CAN:
- ✅ Browse products
- ✅ View company information
- ✅ See contact information
- ✅ Navigate all public screens
- ✅ Sign in anytime from header

### Guest Users CANNOT:
- ❌ Create/edit proposals
- ❌ Manage invoices
- ❌ Access user settings
- ❌ Save favorites
- ❌ Make purchases (if implemented)

### Authenticated Users CAN:
- ✅ Everything guests can do
- ✅ Create and manage proposals
- ✅ View/manage invoices
- ✅ Access protected features
- ✅ Save preferences
- ✅ Logout and return to guest mode

## 🎯 Navigation Flow

```
App Start
    ↓
LoginScreen
    ├─→ [Login] → Authenticated → HomeScreen (with user info)
    └─→ [Continue as Guest] → Guest Mode → HomeScreen (guest banner)
                                              ↓
                                     [Sign In] → Back to LoginScreen
```

## 🛠️ Implementation Details

### LoginScreen Changes
```tsx
// New handler
const handleGuestAccess = () => {
  navigation.navigate('Home' as never);
};

// New button
<TouchableOpacity 
  style={styles.guestButton}
  onPress={handleGuestAccess}>
  <Text style={styles.guestButtonText}>Continue as Guest</Text>
</TouchableOpacity>
```

### HomeScreen Changes
```tsx
const { user } = useAuth();

// Conditional header
{user ? (
  <View style={styles.userHeader}>
    <Text>Welcome, {user.name}!</Text>
    <Button onPress={logout}>Logout</Button>
  </View>
) : (
  <View style={styles.guestHeader}>
    <Text>👋 Guest Mode</Text>
    <Button onPress={() => navigation.navigate('Login')}>Sign In</Button>
  </View>
)}
```

## 🎨 Styling

### Guest Mode Colors
- **Background**: `#fff7ed` (light amber)
- **Border**: `#fed7aa` (amber-200)
- **Text**: `#9a3412` (dark amber)
- **Button**: `#14b8a6` (teal)

### Logged-in User Colors
- **Background**: `#f9fafb` (light gray)
- **Border**: `#e5e7eb` (gray-200)
- **Text**: `#1f2937` (dark gray)
- **Logout button**: `#ef4444` (red)

## 📱 Testing

### Test Guest Flow
1. Open app → See LoginScreen
2. Tap "Continue as Guest"
3. Should navigate to HomeScreen
4. Should see "👋 Guest Mode" banner
5. Should see "Sign In" button in header
6. Tap "Sign In" → Return to LoginScreen

### Test Authenticated Flow
1. Open app → LoginScreen
2. Enter credentials and login
3. Should navigate to HomeScreen
4. Should see "Welcome, [Name]!" banner
5. Should see "Logout" button
6. Tap "Logout" → Return to LoginScreen

## 🔄 Future Enhancements

### Possible additions:
- [ ] Remember guest preference (don't show login again)
- [ ] Limited-time guest sessions
- [ ] Guest → User conversion tracking
- [ ] Guest activity analytics
- [ ] Quick registration for guests
- [ ] Social login options
- [ ] Guest checkout (for e-commerce)

## 📚 Related Files

**Modified:**
- `src/screens/LoginScreen.tsx` - Added guest button
- `src/screens/HomeScreen.tsx` - Added guest/user conditional headers

**New:**
- `src/components/ProtectedFeature.tsx` - Reusable protected content wrapper

**Unchanged:**
- `src/hooks/useAuth.ts` - Works with or without authentication
- `App.tsx` - Login still as initial route
- `src/config/api.ts` - API configuration

---

**Guest mode is ready! 🎉** Users can now explore your app without signing in!
