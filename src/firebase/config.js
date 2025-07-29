import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC51YoKwQahCb0wl4rF_ft75i5ASYTTFHY",
  authDomain: "expense-tracker-web-24c1c.firebaseapp.com",
  projectId: "expense-tracker-web-24c1c",
  storageBucket: "expense-tracker-web-24c1c.firebasestorage.app",
  messagingSenderId: "514276983098",
  appId: "1:514276983098:web:f4b494c1b06c44784c5003",
  measurementId: "G-JP6YB77HCS"
}

// Initialize Firebase
let app
let auth
let db
let analytics

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  analytics = getAnalytics(app)
  
  console.log('✅ Firebase initialized successfully with config:', {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  })
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  throw error
}

export { auth, db, analytics }
export default app 