import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  GraduationCap, BookOpen, FlaskConical, Route,
  LayoutDashboard, LogOut, Menu, X, Sun, Moon, User, ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/tests', label: 'Mock Tests', icon: FlaskConical },
  { to: '/paths', label: 'Cert Paths', icon: Route },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <GraduationCap className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold text-gradient">ExamPrep</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === to || location.pathname.startsWith(to + '/')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors",
                  "hover:bg-secondary border border-transparent",
                  dropdownOpen && "bg-secondary border-border"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {userInitial}
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", dropdownOpen && "rotate-180")} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card shadow-lg py-1 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>

                  {/* Dashboard */}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {/* Theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full text-left"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  <hr className="border-border my-1" />

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Theme toggle for non-auth users */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <hr className="border-border" />

          {/* Theme toggle in mobile */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary w-full"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 w-full">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full" size="sm">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button className="w-full" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
