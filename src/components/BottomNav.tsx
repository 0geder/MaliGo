import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuthStatus } from "@/hooks/useAuthStatus"
import { useAuth } from "@/hooks/useAuth"

const BottomNav = () => {
  const location = useLocation()
  const { isSignedUp, isLoading } = useAuthStatus()
  const { signOut } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
 
  // Dynamic navigation items based on signup status
  const navItems = [
    { to: "/", icon: "🏠", label: "Home", color: "text-blue-500" },
    { to: "/dashboard", icon: "📊", label: "Dashboard", color: "text-green-500" },
    { to: "/game", icon: "🎮", label: "Game", color: "text-orange-500" },
    { to: "/chat", icon: "💬", label: "Chat", color: "text-pink-500" },
    { to: "/glossary", icon: "📚", label: "Glossary", color: "text-blue-500" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetAutoHideTimer = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
    }
    
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 8000) // Increased to 8 seconds

    setAutoHideTimer(timer)
  }

  const toggleNav = () => {
    setIsVisible(!isVisible)
    if (!isVisible) {
      resetAutoHideTimer()
    } else {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
    }
  }

  const handleNavClick = () => {
    resetAutoHideTimer()
  }

  // Auto-hide on scroll (smarter behavior)
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout
    let lastScrollY = window.scrollY
    let scrollDirection: 'up' | 'down' = 'down'
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      
      // Only change direction if it's different
      if (currentDirection !== scrollDirection) {
        scrollDirection = currentDirection
      }
      
      // Hide when scrolling down and past 100px
      if (scrollDirection === 'down' && currentScrollY > 100) {
        setIsVisible(false)
      } 
      // Show when scrolling up
      else if (scrollDirection === 'up') {
        setIsVisible(true)
        resetAutoHideTimer()
      }
      
      lastScrollY = currentScrollY
      
      // Show again after scroll stops
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        setIsVisible(true)
        resetAutoHideTimer()
      }, 1500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
    }
  }, [autoHideTimer])

  // Show on route change
  useEffect(() => {
    setIsVisible(true)
    resetAutoHideTimer()
  }, [location.pathname])

  return (
    <>
      {/* Enhanced Toggle Button */}
      <button
        onClick={toggleNav}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-maligo-green to-maligo-green-dark hover:from-maligo-green-dark hover:to-maligo-green text-white rounded-full w-14 h-14 shadow-2xl transition-all duration-500 flex items-center justify-center ${
          isVisible ? 'translate-y-20 opacity-0 scale-75' : 'translate-y-0 opacity-100 scale-100'
        }`}
      >
        <span className="text-xl transform transition-transform duration-300">☰</span>
      </button>

      {/* Enhanced Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-40 transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        onMouseEnter={handleNavClick}
      >
        {/* Navigation Items */}
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to
            const isHovered = hoveredItem === item.to
            
            return (
              <Link key={item.to} to={item.to} onClick={handleNavClick}>
                <div className="relative">
                  <Button
                    variant="ghost"
                    className={`flex flex-col items-center p-3 h-auto rounded-2xl transition-all duration-300 relative ${
                      isActive
                        ? "bg-gradient-to-r from-maligo-green/20 to-maligo-green/10 text-maligo-green shadow-lg scale-110"
                        : isHovered
                        ? "bg-gray-100 text-gray-700 shadow-md scale-105"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onMouseEnter={() => setHoveredItem(item.to)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative">
                      <span className={`text-2xl mb-1 block transition-transform duration-300 ${
                        isActive || isHovered ? 'scale-125' : 'scale-100'
                      }`}>
                        {item.icon}
                      </span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-maligo-green rounded-full animate-pulse" />
                      )}
                    </div>
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      isActive ? 'text-maligo-green font-bold' : isHovered ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                  </Button>
                  
                  {/* Hover tooltip */}
                  {isHovered && !isActive && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                      {item.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
          
          {/* Sign Out Button - Only show when signed up */}
          {isSignedUp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex flex-col items-center p-3 h-auto rounded-2xl text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <span className="text-2xl mb-1">🚪</span>
              <span className="text-xs font-medium">Sign Out</span>
            </Button>
          )}
        </div>
        
        {/* Enhanced Auto-hide Indicator */}
        {isVisible && (
          <div className="text-center py-1 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-maligo-green rounded-full animate-pulse" />
              <span>Auto-hides in 8s</span>
              <div className="w-2 h-2 bg-maligo-green rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default BottomNav
