import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const BottomNav = () => {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)
  
  const navItems = [
    { to: "/", icon: "🏠", label: "Home" },
    { to: "/signup", icon: "👤", label: "Sign Up" },
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/game", icon: "🎮", label: "Game" },
    { to: "/chat", icon: "💬", label: "Chat" },
  ]

  const resetAutoHideTimer = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
    }
    
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000) // Auto-hide after 5 seconds

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

  // Auto-hide on scroll
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout
    
    const handleScroll = () => {
      setIsVisible(false)
      
      // Show again after scroll stops
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        setIsVisible(true)
        resetAutoHideTimer()
      }, 1000)
    }

    window.addEventListener('scroll', handleScroll)
    
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
      {/* Toggle Button */}
      <button
        onClick={toggleNav}
        className={`fixed bottom-4 right-4 z-50 bg-maligo-green hover:bg-maligo-green-dark text-white rounded-full w-12 h-12 shadow-lg transition-all duration-300 ${
          isVisible ? 'translate-y-16 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onMouseEnter={handleNavClick}
      >
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to} onClick={handleNavClick}>
                <Button
                  variant="ghost"
                  className={`flex flex-col items-center p-2 h-auto rounded-lg transition-all ${
                    isActive
                      ? "text-maligo-green bg-maligo-green/10"
                      : "text-gray-600 hover:text-maligo-green"
                  }`}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
        
        {/* Auto-hide indicator */}
        {isVisible && (
          <div className="text-center text-xs text-gray-500 pb-1">
            Auto-hides in 5s
          </div>
        )}
      </div>
    </>
  )
}

export default BottomNav
