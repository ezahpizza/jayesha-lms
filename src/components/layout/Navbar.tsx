import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (profile?.role === 'teacher') return '/dashboard/teacher';
    if (profile?.role === 'student') return '/dashboard/student';
    return '/';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-4 z-50 px-4">
      <div className={`bg-white shadow-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all duration-200 ${
        isMobileMenuOpen ? 'rounded-t-2xl' : 'rounded-2xl'
      }`}>
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-tanBlack">JayaLearn</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-tanBlack hover:text-majorelle px-3 py-2 rounded-md text-lg font-semibold"
              >
                Home
              </Link>
              <Link
                to="/portfolio"
                className="text-tanBlack hover:text-majorelle px-3 py-2 rounded-md text-lg font-semibold"
              >
                Portfolio
              </Link>
              <Link
                to="/contact"
                className="text-tanBlack hover:text-majorelle px-3 py-2 rounded-md text-lg font-semibold"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 min-w-[120px]">
            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-md text-tanBlack hover:text-majorelle hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* User Actions */}
            <div
              className={`transition-all duration-500 flex items-center ${
                loading
                  ? 'opacity-0 scale-75 pointer-events-none w-0'
                  : 'opacity-100 scale-100 w-auto'
              }`}
              style={{ minWidth: loading ? 0 : 120 }}
            >
              {user ? (
                <>
                  <Link to={getDashboardLink()}>
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:block">
                          {profile?.name && profile.name.trim() ? profile.name : 'User'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : !loading ? (
                <Link to="/login">
                  <Button>Sign In</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 py-4 rounded-b-2xl shadow-lg">
            <div className="flex flex-col space-y-2 px-4">
              <Link
                to="/"
                className="text-tanBlack hover:text-majorelle hover:bg-gray-50 px-3 py-2 rounded-md text-lg font-semibold block"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/portfolio"
                className="text-tanBlack hover:text-majorelle hover:bg-gray-50 px-3 py-2 rounded-md text-lg font-semibold block"
                onClick={closeMobileMenu}
              >
                Portfolio
              </Link>
              <Link
                to="/contact"
                className="text-tanBlack hover:text-majorelle hover:bg-gray-50 px-3 py-2 rounded-md text-lg font-semibold block"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};