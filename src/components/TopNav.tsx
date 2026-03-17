import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuthStatus } from "@/hooks/useAuthStatus"
import { useAuth } from "@/hooks/useAuth"

const TopNav = () => {
  const location = useLocation()
  const { isSignedUp, isLoading } = useAuthStatus()
  const { signOut } = useAuth()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
 
  // Dynamic navigation items based on signup status
  const navItems = [
    { to: "/", icon: "🏠", label: "Home" },
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/game", icon: "🎮", label: "Game" },
    { to: "/chat", icon: "💬", label: "Chat" },
    { to: "/glossary", icon: "📚", label: "Glossary" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <nav className="sticky top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-40">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img 
            src="/mali2.png" 
            alt="MaliGo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-primary hidden sm:inline">MaliGo</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            const isHovered = hoveredItem === item.to
            
            return (
              <Link key={item.to} to={item.to}>
                <div className="relative">
                  <Button
                    variant="ghost"
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/20 text-primary shadow-md"
                        : isHovered
                        ? "bg-gray-100 text-gray-700"
                        : "text-gray-600 hover:text-primary"
                    }`}
                    onMouseEnter={() => setHoveredItem(item.to)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className={`text-lg transition-transform duration-200 ${
                      isActive || isHovered ? 'scale-110' : 'scale-100'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </Button>
                </div>
              </Link>
            )
          })}
          
          {/* Sign Out Button - Only show when signed up */}
          {isSignedUp && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default TopNav
