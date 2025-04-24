import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTenant } from "@/hooks/use-tenant";
import { 
  Home, 
  Users, 
  Settings, 
  Database,
  Layers,
  Server,
  Code,
  AlertCircle
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
          active 
            ? "bg-primary/10 text-primary" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        <span className="mr-3">{icon}</span>
        {children}
      </a>
    </Link>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { currentTenant } = useTenant();
  
  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-medium text-slate-800">TEKTRIO Project</h2>
        <p className="text-xs text-slate-500 mt-1">Monorepo + Multi-tenant</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem href="/" icon={<Home className="h-5 w-5" />} active={location === "/"}>
          Dashboard
        </NavItem>
        
        <NavItem 
          href="/users" 
          icon={<Users className="h-5 w-5" />} 
          active={location.startsWith("/users")}
        >
          Users
        </NavItem>
        
        <NavItem 
          href="/database" 
          icon={<Database className="h-5 w-5" />} 
          active={location.startsWith("/database")}
        >
          Database
        </NavItem>
        
        <div className="pt-4 pb-2">
          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System Management
          </div>
        </div>
        
        <NavItem 
          href="/tenants" 
          icon={<Layers className="h-5 w-5" />} 
          active={location.startsWith("/tenants")}
        >
          Tenants
        </NavItem>
        
        <NavItem 
          href="/servers" 
          icon={<Server className="h-5 w-5" />} 
          active={location.startsWith("/servers")}
        >
          Servers
        </NavItem>
        
        <NavItem 
          href="/developer" 
          icon={<Code className="h-5 w-5" />} 
          active={location.startsWith("/developer")}
        >
          Developer
        </NavItem>
        
        <div className="pt-4 pb-2">
          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Configuration
          </div>
        </div>
        
        <NavItem 
          href="/settings" 
          icon={<Settings className="h-5 w-5" />} 
          active={location.startsWith("/settings")}
        >
          Settings
        </NavItem>
      </nav>
      
      {currentTenant && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-700 font-medium">
              {currentTenant.name.charAt(0)}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-slate-700">{currentTenant.name}</div>
              <div className="text-xs text-slate-500">{currentTenant.schemaName}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
