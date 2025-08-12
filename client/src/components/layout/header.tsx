import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/workouts", label: "Treinos" },
    { href: "/calendar", label: "Calendário" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/progress", label: "Progresso" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">FitTrain</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium pb-1 ${
                    location === item.href || (location === "/" && item.href === "/")
                      ? "text-gray-900 border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face" 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full"
              />
              <span className="text-gray-900 font-medium">João Silva</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
