import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/mali2.png" 
              alt="MaliGo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-maligo-green">MaliGo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-700 hover:text-maligo-green">
                Dashboard
              </Button>
            </Link>
            <Link to="/game">
              <Button variant="ghost" className="text-gray-700 hover:text-maligo-green">
                Budget Game
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" className="text-gray-700 hover:text-maligo-green">
                Chat with Mali
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navigation;
