'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function TestAuth() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      setError(null)
      console.log('🔄 Attempting to sign in...')
      const result = await signIn('google', { redirect: false })
      console.log('✅ Sign in result:', result)
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error('❌ Sign in error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleSignOut = async () => {
    try {
      setError(null)
      console.log('🔄 Attempting to sign out...')
      const result = await signOut({ redirect: false })
      console.log('✅ Sign out result:', result)
    } catch (err) {
      console.error('❌ Sign out error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Authentication Test</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Session Status:</h2>
            <p className="text-sm">Status: <span className="font-mono">{status}</span></p>
            {session ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm">User ID: <span className="font-mono">{session.user?.id || 'undefined'}</span></p>
                <p className="text-sm">Name: <span className="font-mono">{session.user?.name || 'N/A'}</span></p>
                <p className="text-sm">Email: <span className="font-mono">{session.user?.email || 'N/A'}</span></p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No session data</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-1">Error:</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            {!session ? (
              <button
                onClick={handleSignIn}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In with Google
              </button>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>

          <div className="text-center">
            <a 
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 