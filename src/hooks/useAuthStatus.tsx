import { useState, useEffect } from 'react'

export const useAuthStatus = () => {
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has signed up
    const checkSignupStatus = () => {
      try {
        const signupData = localStorage.getItem('maligo_signup')
        const profileData = localStorage.getItem('maligo:mvp:profile:demo-user-001')
        
        // Consider user signed up if they have signup data or profile data
        const hasSignedUp = !!(signupData || profileData)
        setIsSignedUp(hasSignedUp)
      } catch (error) {
        console.error('Error checking signup status:', error)
        setIsSignedUp(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkSignupStatus()
    
    // Listen for storage changes (in case user signs up in another tab)
    const handleStorageChange = () => {
      checkSignupStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return { isSignedUp, isLoading }
}
