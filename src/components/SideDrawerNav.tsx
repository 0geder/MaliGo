import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface NavItem {
  to: string
  icon: string
  label: string
  color: string
}

const SideDrawerNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null)

  const navItems: NavItem[] = [
    { to: "/dashboard", icon: "📊", label: "Dashboard", color: "bg-maligo-green hover:bg-maligo-green-dark" },
    { to: "/game", icon: "🎮", label: "Budget Game", color: "bg-maligo-orange hover:bg-maligo-orange-dark" },
    { to: "/chat", icon: "💬", label: "Chat with Mali", color: "bg-maligo-purple hover:bg-maligo-purple-dark" },
    { to: "/", icon: "🏠", label: "Home", color: "border-maligo-green text-maligo-green hover:bg-maligo-green hover:text-white" },
  ]

  // Auto-close timer
  const resetAutoCloseTimer = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
    
    const timer = setTimeout(() => {
      setIsOpen(false)
    }, 10000) // 10 seconds

    setAutoCloseTimer(timer)
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      resetAutoCloseTimer()
    } else {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    }
  }

  const handleItemClick = () => {
    // Close drawer after navigation
    setIsOpen(false)
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
  }

  const handleMouseEnter = () => {
    if (!isOpen) {
      setIsOpen(true)
      resetAutoCloseTimer()
    }
  }

  const handleMouseLeave = () => {
    // Don't close on mouse leave, let the timer handle it
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    }
  }, [autoCloseTimer])

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
      {/* Drawer Container */}
      <div
        className={`relative transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-12"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation Items */}
        <div className="bg-white/95 backdrop-blur-sm border-l border-t border-b border-gray-200 rounded-l-2xl shadow-2xl p-4 space-y-3">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={handleItemClick}>
              <div
                className="flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                onMouseEnter={() => setHoveredItem(item.to)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  className={`${item.color} rounded-full w-10 h-10 shadow-md transition-all duration-300 ${
                    hoveredItem === item.to ? "scale-110" : "scale-100"
                  }`}
                >
                  {item.icon}
                </Button>
                <span
                  className={`text-sm font-medium text-gray-700 transition-all duration-300 ${
                    hoveredItem === item.to ? "text-maligo-green translate-x-1" : "translate-x-0"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
          
          {/* Timer Indicator */}
          {isOpen && (
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Auto-closes in 10s
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div className="bg-maligo-green h-1 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button (always visible) */}
      <button
        onClick={toggleDrawer}
        className="absolute top-1/2 -translate-y-1/2 -left-12 bg-maligo-green hover:bg-maligo-green-dark text-white rounded-l-full w-12 h-24 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        <span className="text-lg font-bold">
          {isOpen ? "→" : "←"}
        </span>
      </button>
    </div>
  )
}

export default SideDrawerNav
