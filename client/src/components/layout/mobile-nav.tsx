import { Home, Dumbbell, Calendar, Store, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/workouts", icon: Dumbbell, label: "Treinos" },
    { href: "/calendar", icon: Calendar, label: "Agenda" },
    { href: "/marketplace", icon: Store, label: "Loja" },
    { href: "/progress", icon: TrendingUp, label: "Progresso" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (location === "/" && item.href === "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
