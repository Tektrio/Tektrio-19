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
            "flex items-center py-2.5 pl-3 pr-4 my-0.5 text-sm transition-all duration-300",
            active 
              ? "text-white bg-gray-900/60" 
              : "text-gray-400 hover:text-white"
          )}
        >
          {active && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          )}
          <span className={cn(
            "mr-3 transition-all duration-300",
            active 
              ? "text-white" 
              : "text-gray-500 group-hover:text-white"
          )}>{icon}</span>
          <span className={active ? "font-medium" : ""}>{children}</span>
        </div>
      </Link>
    </div>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { currentTenant } = useTenant();
  
  return (
    <div className="w-64 h-full bg-black flex flex-col shadow-lg tech-grid-bg">
      <div className="p-5 border-b border-gray-800 relative">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
            <span className="text-lg">TK</span>
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">TEKTRIO</h2>
            <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">Multi-tenant Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 pt-4 overflow-y-auto">
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
        
        <div className="py-3 px-5">
          <div className="text-xs font-medium text-blue-400 uppercase tracking-wider">
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
          Servidores
        </NavItem>
        
        <NavItem 
          href="/developer" 
          icon={<Code className="h-5 w-5" />} 
          active={location.startsWith("/developer")}
        >
          Desenvolvimento
        </NavItem>
        
        <div className="py-3 px-5">
          <div className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            Configuração
          </div>
        </div>
        
        <NavItem 
          href="/settings" 
          icon={<Settings className="h-5 w-5" />} 
          active={location.startsWith("/settings")}
        >
          Configurações
        </NavItem>
        
        {/* Espaço em branco para separar o último item do rodapé */}
        <div className="py-8"></div>
      </nav>
      
      {currentTenant && (
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-medium">
              <span>{currentTenant.name.charAt(0)}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">{currentTenant.name}</div>
              <div className="text-xs text-gray-500 font-mono">{currentTenant.schemaName}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
