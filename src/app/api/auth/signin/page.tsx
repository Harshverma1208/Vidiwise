'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession, getProviders } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/legacy/image'
import { Github, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Provider = {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [providersLoading, setProvidersLoading] = useState(true)
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const errorParam = searchParams.get('error')

  useEffect(() => {
    // Redirect if already signed in
    if (session) {
      router.push(callbackUrl)
      return
    }
  }, [session, router, callbackUrl])

  useEffect(() => {
    // Fetch available providers
    const fetchProviders = async () => {
      try {
        const providerData = await getProviders()
        setProviders(providerData)
      } catch (err) {
        console.error('Failed to fetch providers:', err)
        setError('Failed to load sign-in options')
      } finally {
        setProvidersLoading(false)
      }
    }
    
    fetchProviders()
  }, [])

  const handleSignIn = async (providerId: string) => {
    try {
      setError(null)
      setLoading(true)
      console.log(`🔄 Signing in with ${providerId}...`)
      await signIn(providerId, { callbackUrl })
    } catch (err) {
      console.error(`❌ Sign in error with ${providerId}:`, err)
      setError(`Failed to sign in with ${providerId}`)
      setLoading(false)
    }
  }

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )

  const renderProviderButton = (provider: Provider) => {
    if (provider.id === 'google') {
      return (
        <button
          key={provider.id}
          onClick={() => handleSignIn(provider.id)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          <span>Continue with {provider.name}</span>
        </button>
      )
    } else if (provider.id === 'github') {
      return (
        <button
          key={provider.id}
          onClick={() => handleSignIn(provider.id)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Github className="w-5 h-5" />
          <span>Continue with {provider.name}</span>
        </button>
      )
    } else {
      // Generic provider button
      return (
        <button
          key={provider.id}
          onClick={() => handleSignIn(provider.id)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue with {provider.name}</span>
        </button>
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.svg" 
              alt="Vidiwise" 
              width={64} 
              height={64}
              className="rounded-lg"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Vidiwise</h2>
          <p className="mt-2 text-gray-600">
            Sign in to start transforming videos into smart knowledge
          </p>
        </div>

        {/* Error Display */}
        {(error || errorParam) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Sign-in Error</h3>
              <p className="text-sm text-red-700 mt-1">
                {error || errorParam || 'An unexpected error occurred during sign-in'}
              </p>
            </div>
          </div>
        )}

        {/* Provider Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 text-center">
            Choose your preferred sign-in method
          </h3>
          
          {providersLoading ? (
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading sign-in options...</p>
            </div>
          ) : providers && Object.keys(providers).length > 0 ? (
            <div className="space-y-3">
              {Object.values(providers).map((provider) => renderProviderButton(provider))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Sign-in Options Available</h3>
              <p className="text-gray-600 mb-4">
                Authentication providers are not configured properly.
              </p>
              <Link 
                href="/"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Go back to homepage
              </Link>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Redirecting to sign-in...</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>By signing in, you agree to our{' '}
            <a className="text-purple-600 hover:text-purple-700" href="/terms">Terms of Service</a>
            {' '}and{' '}
            <a className="text-purple-600 hover:text-purple-700" href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
} 