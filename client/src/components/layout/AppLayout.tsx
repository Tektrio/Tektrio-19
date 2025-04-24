import { useState, useEffect } from "react";
import { TenantProvider } from "@/hooks/use-tenant";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Bell, 
  Search, 
  Github, 
  Database as DbIcon,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Check if we're on mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, location.pathname]);
  
  return (
    <TenantProvider>
      <div className={cn(
        "min-h-screen bg-slate-50 flex flex-col",
        darkMode && "bg-slate-900"
      )}>
        {/* Header */}
        <header className={cn(
          "bg-white border-b border-slate-200 sticky top-0 z-10",
          darkMode && "bg-slate-800 border-slate-700"
        )}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden hover:bg-slate-100 text-slate-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
                  TK
                </div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">TEKTRIO</h1>
              </div>
            </div>
            
            {/* Search Bar */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 min-w-[300px]"
                >
                  <Input 
                    placeholder="Pesquisar..." 
                    className="w-full pl-10 shadow-md focus:ring-2 focus:ring-primary" 
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-3">
              {/* Search button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Tech badges for desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                  <Github className="h-3 w-3 mr-1" />
                  Replit
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm">
                  <DbIcon className="h-3 w-3 mr-1" />
                  NeonDB
                </div>
              </div>
              
              {/* Dark mode toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-medium text-lg">Notificações</h3>
                    <p className="text-sm text-slate-500">Você tem 2 novas notificações</p>
                  </div>
                  <DropdownMenuItem className="cursor-pointer p-4 border-t">
                    <div>
                      <div className="font-medium">Novo tenant criado</div>
                      <div className="text-sm text-slate-500">Tenant "Development" foi criado com sucesso</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer p-4 border-t">
                    <div>
                      <div className="font-medium">Atualização do sistema</div>
                      <div className="text-sm text-slate-500">Nova versão do TEKTRIO disponível</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User avatar */}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white cursor-pointer shadow-md shadow-primary/20 hover:shadow-lg transition-shadow">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area with sidebar */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Overlay for mobile */}
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 bg-black/20 z-10 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - conditionally shown on mobile */}
          <AnimatePresence>
            {(sidebarOpen || !isMobile) && (
              <motion.div 
                initial={isMobile ? { x: -300 } : false}
                animate={{ x: 0 }}
                exit={isMobile ? { x: -300 } : false}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed md:relative z-20 h-[calc(100vh-4rem)]"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content */}
          <main className={cn(
            "flex-1 overflow-y-auto p-6 transition-all duration-300",
            darkMode && "bg-slate-900 text-white"
          )}>
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
