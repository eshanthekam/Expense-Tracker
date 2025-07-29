# Firebase Setup Guide for Expense Tracker

## 🔧 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `expense-tracker-web`
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 🔧 Step 2: Add Web App

1. In your Firebase project, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Enter app nickname: `expense-tracker-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"

## 🔧 Step 3: Get Configuration

1. After registering, you'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
}
```

2. **Copy this entire config object**

## 🔧 Step 4: Update Your Code

1. Open `src/firebase/config.js`
2. Replace the current `firebaseConfig` object with your actual config
3. Save the file

## 🔧 Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click on "Email/Password"
3. Enable it and click "Save"
4. Also enable "Anonymous" for testing

## 🔧 Step 6: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Done"

## 🔧 Step 7: Test the Application

1. Refresh your browser at `http://localhost:5173`
2. Look for the Firebase Debug component
3. It should show "✅ Firebase Connection Test" if everything is working

## 🚨 Common Error Messages & Solutions

### "Invalid API key"
- **Solution**: Make sure you copied the correct API key from Firebase Console

### "auth/operation-not-allowed"
- **Solution**: Enable Email/Password authentication in Firebase Console

### "auth/network-request-failed"
- **Solution**: Check your internet connection

### "auth/too-many-requests"
- **Solution**: Wait a few minutes and try again

### "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Double-check your Firebase configuration

## 📝 Current Configuration (Replace This)

Your current `src/firebase/config.js` has placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC51YoKwQahCb0wl4rF_ft75i5ASYTTFHY",
  authDomain: "expense-tracker-web-24c1c.firebaseapp.com",
  projectId: "expense-tracker-web-24c1c",
  storageBucket: "expense-tracker-web-24c1c.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
}
```

**You need to replace this with your actual Firebase configuration from the Firebase Console.**

## 🔍 Debugging Steps

1. **Check the Firebase Debug component** on your app
2. **Open browser console** (F12) and look for error messages
3. **Try the steps above** to set up Firebase properly
4. **Let me know what specific error you see** and I'll help you fix it 