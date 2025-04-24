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
    <div className="group relative">
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-102",
            active 
              ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-sm" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <span className={cn(
            "mr-3 transition-transform duration-200 group-hover:scale-110",
            active ? "text-primary" : "text-slate-500 group-hover:text-primary/80"
          )}>{icon}</span>
          <span className="font-medium">{children}</span>
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-primary rounded-r-md" />
          )}
        </div>
      </Link>
    </div>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { currentTenant } = useTenant();
  
  return (
    <div className="w-64 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 flex flex-col shadow-lg shadow-blue-900/30 tech-grid-bg">
      <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-transparent backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/30">
            <span className="z-10 relative">TK</span>
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 blur opacity-70"></div>
          </div>
          <div>
            <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-lg">TEKTRIO</h2>
            <p className="text-xs text-slate-400 mt-0.5">Multi-tenant Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem href="/" icon={<Home className="h-5 w-5" />} active={location === "/"}>
          Dashboard
        </NavItem>
        
        <NavItem 
          href="/users" 
          icon={<Users className="h-5 w-5" />} 
          active={location.startsWith("/users")}
        >
          Usuários
        </NavItem>
        
        <NavItem 
          href="/database" 
          icon={<Database className="h-5 w-5" />} 
          active={location.startsWith("/database")}
        >
          Banco de Dados
        </NavItem>
        
        <div className="pt-5 pb-3 px-3">
          <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase tracking-wider flex items-center">
            <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-transparent mr-2"></div>
            System Management
            <div className="h-px flex-grow bg-gradient-to-r from-transparent to-purple-500/20 ml-2"></div>
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
          Servidores
        </NavItem>
        
        <NavItem 
          href="/developer" 
          icon={<Code className="h-5 w-5" />} 
          active={location.startsWith("/developer")}
        >
          Desenvolvimento
        </NavItem>
        
        <div className="pt-5 pb-3 px-3">
          <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase tracking-wider flex items-center">
            <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-transparent mr-2"></div>
            Configuração
            <div className="h-px flex-grow bg-gradient-to-r from-transparent to-purple-500/20 ml-2"></div>
          </div>
        </div>
        
        <NavItem 
          href="/settings" 
          icon={<Settings className="h-5 w-5" />} 
          active={location.startsWith("/settings")}
        >
          Configurações
        </NavItem>
      </nav>
      
      {currentTenant && (
        <div className="p-4 border-t border-slate-700/50 backdrop-blur-sm bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-xl flex items-center justify-center text-white font-medium">
              {/* Background with glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur opacity-70"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500"></div>
              <span className="z-10 relative">{currentTenant.name.charAt(0)}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">{currentTenant.name}</div>
              <div className="text-xs text-slate-400 font-mono">{currentTenant.schemaName}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
