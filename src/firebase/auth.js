import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from './config'

// Register a new user
export const registerUser = async (email, password) => {
  try {
    console.log('Attempting to register user:', email)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log('User registered successfully:', userCredential.user.uid)
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Registration error:', error.code, error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting to login user:', email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('User logged in successfully:', userCredential.user.uid)
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: userCredential.user.metadata.creationTime
      }
    }
  } catch (error) {
    console.error('Login error:', error.code, error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        createdAt: user.metadata.creationTime
      })
    } else {
      callback(null)
    }
  })
} 