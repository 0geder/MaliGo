import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NavItem {
  to: string
  icon: string
  label: string
  color: string
}

const FloatingNav = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems: NavItem[] = [
    { to: "/dashboard", icon: "📊", label: "Dashboard", color: "bg-maligo-green hover:bg-maligo-green-dark" },
    { to: "/game", icon: "🎮", label: "Budget Game", color: "bg-maligo-orange hover:bg-maligo-orange-dark" },
    { to: "/chat", icon: "💬", label: "Chat with Mali", color: "bg-maligo-purple hover:bg-maligo-purple-dark" },
    { to: "/", icon: "🏠", label: "Home", color: "border-maligo-green text-maligo-green hover:bg-maligo-green hover:text-white" },
  ]

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {navItems.map((item) => (
        <div
          key={item.to}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.to)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link to={item.to}>
            <Button
              className={`${item.color} rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
                hoveredItem === item.to ? "scale-110" : "scale-100"
              }`}
            >
              {item.icon}
            </Button>
          </Link>
          
          {/* Hover Label */}
          <div
            className={`absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-all duration-300 ${
              hoveredItem === item.to
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }`}
          >
            {item.label}
            {/* Arrow */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FloatingNav
