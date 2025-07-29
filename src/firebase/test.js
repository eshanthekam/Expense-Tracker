import { auth } from './config'
import { signInAnonymously } from 'firebase/auth'

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing Firebase connection...')
    console.log('Auth object:', auth)
    
    // Check if auth is properly initialized
    if (!auth) {
      throw new Error('Auth object is null or undefined')
    }
    
    // Try to sign in anonymously to test the connection
    console.log('Attempting anonymous sign-in...')
    const result = await signInAnonymously(auth)
    console.log('✅ Firebase connection successful:', result.user.uid)

    // Sign out immediately
    await auth.signOut()
    console.log('✅ Test completed successfully')

    return { 
      success: true,
      message: 'Firebase connection is working properly'
    }
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error)
    
    // Provide specific error messages based on error codes
    let errorMessage = error.message
    if (error.code === 'auth/invalid-api-key') {
      errorMessage = 'Invalid API key. Please check your Firebase configuration.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.'
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Anonymous authentication is not enabled in your Firebase project.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.'
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
      details: error.message
    }
  }
} 