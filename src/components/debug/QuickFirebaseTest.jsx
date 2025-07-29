import { useState } from 'react'
import { auth } from '../../firebase/config'
import { signInAnonymously } from 'firebase/auth'

const QuickFirebaseTest = () => {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const testConnection = async () => {
    setStatus('testing')
    setError(null)
    
    try {
      // Test 1: Check if auth object exists
      if (!auth) {
        throw new Error('Firebase auth object is null')
      }
      
      // Test 2: Try anonymous sign-in
      const result = await signInAnonymously(auth)
      console.log('✅ Firebase test successful:', result.user.uid)
      
      // Sign out immediately
      await auth.signOut()
      
      setStatus('success')
    } catch (err) {
      console.error('❌ Firebase test failed:', err)
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div style={{ 
      padding: '1rem', 
      margin: '1rem 0',
      border: '2px solid #ccc',
      borderRadius: '8px',
      background: '#f9f9f9'
    }}>
      <h3>🔍 Quick Firebase Test</h3>
      
      {status === 'idle' && (
        <div>
          <p>Click the button below to test Firebase connection:</p>
          <button 
            onClick={testConnection}
            style={{
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Firebase Connection
          </button>
        </div>
      )}
      
      {status === 'testing' && (
        <div style={{ color: '#856404' }}>
          <p>🔄 Testing Firebase connection...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div style={{ color: '#155724', background: '#d4edda', padding: '0.5rem', borderRadius: '4px' }}>
          <p>✅ Firebase connection is working!</p>
          <button 
            onClick={() => setStatus('idle')}
            style={{
              padding: '0.25rem 0.5rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Test Again
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div style={{ color: '#721c24', background: '#f8d7da', padding: '0.5rem', borderRadius: '4px' }}>
          <p>❌ Firebase connection failed:</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{error}</p>
          
          <div style={{ marginTop: '0.5rem' }}>
            <h4>Common Solutions:</h4>
            <ul style={{ fontSize: '0.8rem', marginLeft: '1rem' }}>
              <li>Check if you have a Firebase project set up</li>
              <li>Verify your Firebase configuration in <code>src/firebase/config.js</code></li>
              <li>Enable Anonymous authentication in Firebase Console</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
          
          <button 
            onClick={() => setStatus('idle')}
            style={{
              padding: '0.25rem 0.5rem',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              marginTop: '0.5rem'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default QuickFirebaseTest 