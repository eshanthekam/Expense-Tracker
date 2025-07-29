import { useState, useEffect } from 'react'
import { testFirebaseConnection } from '../../firebase/test'

const FirebaseDebug = () => {
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    const result = await testFirebaseConnection()
    setTestResult(result)
    setIsLoading(false)
  }

  useEffect(() => {
    runTest()
  }, [])

  if (isLoading) {
    return (
      <div style={{ padding: '1rem', background: '#f0f0f0', margin: '1rem 0' }}>
        <h4>Testing Firebase Connection...</h4>
      </div>
    )
  }

  if (!testResult) {
    return null
  }

  return (
    <div style={{ 
      padding: '1rem', 
      margin: '1rem 0',
      background: testResult.success ? '#d4edda' : '#f8d7da',
      border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '4px'
    }}>
      <h4 style={{ color: testResult.success ? '#155724' : '#721c24' }}>
        {testResult.success ? '✅ Firebase Connection Test' : '❌ Firebase Connection Test'}
      </h4>
      <p style={{ color: testResult.success ? '#155724' : '#721c24' }}>
        {testResult.success ? testResult.message : testResult.error}
      </p>
      {!testResult.success && testResult.code && (
        <p style={{ color: '#721c24', fontSize: '0.9rem' }}>
          Error Code: {testResult.code}
        </p>
      )}
      {!testResult.success && testResult.details && (
        <details style={{ marginTop: '0.5rem' }}>
          <summary style={{ cursor: 'pointer', color: '#721c24' }}>
            Technical Details
          </summary>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '0.5rem', 
            borderRadius: '3px',
            fontSize: '0.8rem',
            marginTop: '0.5rem'
          }}>
            {testResult.details}
          </pre>
        </details>
      )}
      <button 
        onClick={runTest}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Run Test Again
      </button>
    </div>
  )
}

export default FirebaseDebug 