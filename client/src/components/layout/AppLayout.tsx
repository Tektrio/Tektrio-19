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
  Moon,
  Layers
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
      <div className="min-h-screen flex flex-col bg-black tech-grid-bg">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md border-b border-cyan-900/30 transition-all duration-300 bg-black/80 text-slate-100 relative overflow-hidden">
          {/* Linha de neon animada */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"></div>
          
          <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden tech-glow text-cyan-400"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex items-center space-x-3"
              >
                <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 text-white flex items-center justify-center font-bold shadow-md">
                  <span className="z-10 text-lg">TK</span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-cyan-500/20 blur-sm"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold neon-blue tracking-tight">TEKTRIO</h1>
                  <div className="text-[10px] font-medium text-cyan-700 uppercase tracking-wider">
                    Multi-tenant Platform
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Search Bar */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 min-w-[300px]"
                >
                  <div className={cn(
                    "relative rounded-lg overflow-hidden",
                    darkMode ? "shadow-lg shadow-blue-500/10" : "shadow-md"
                  )}>
                    <Input 
                      placeholder="Pesquisar..." 
                      className={cn(
                        "w-full pl-10 pr-4 py-2 border-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        darkMode ? "bg-slate-800 text-white" : "bg-white"
                      )}
                      autoFocus
                      onBlur={() => setSearchOpen(false)}
                    />
                    <Search className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                      darkMode ? "text-slate-400" : "text-slate-400"
                    )} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-3">
              {/* Search button */}
              <Button 
                variant="ghost"
                size="icon" 
                className="rounded-full tech-glow text-cyan-400 hover:text-cyan-300"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Tech badges for desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  <Github className="h-3 w-3 mr-1" />
                  Replit
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black border border-fuchsia-500/40 text-fuchsia-400 shadow-md shadow-fuchsia-500/20"
                >
                  <DbIcon className="h-3 w-3 mr-1" />
                  NeonDB
                </motion.div>
              </div>
              
              {/* Dark mode toggle */}
              <Button 
                variant="ghost"
                size="icon" 
                className="rounded-full relative tech-glow transition-all duration-300 text-yellow-300 hover:text-yellow-200"
                onClick={() => setDarkMode(!darkMode)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
                
                {/* Pulse effect when toggled */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0], 
                    opacity: [0, 0.5, 0] 
                  }}
                  transition={{ duration: 0.5, times: [0, 0.5, 1] }}
                  key={darkMode ? "dark" : "light"}
                  className="absolute inset-0 rounded-full bg-yellow-300"
                />
              </Button>
              
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="icon" 
                    className="rounded-full relative tech-glow text-red-400 hover:text-red-300"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-black" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 p-0 overflow-hidden bg-black border border-cyan-900/40 text-slate-100 shadow-lg shadow-cyan-500/10"
                >
                  <div className="p-4 bg-gradient-to-r from-black to-cyan-950/20 border-b border-cyan-900/30 relative overflow-hidden">
                    {/* Linha de neon animada */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"></div>
                    
                    <h3 className="font-semibold text-lg neon-blue">Notificações</h3>
                    <p className="text-sm text-cyan-600">
                      Você tem 2 novas notificações
                    </p>
                  </div>
                  
                  <div className="bg-black">
                    <DropdownMenuItem className="cursor-pointer p-4 focus:bg-opacity-40 border-t border-cyan-900/20 hover:bg-cyan-950/30 focus:bg-cyan-950/30">
                      <div className="flex space-x-3 items-start w-full">
                        <div className="relative h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          {/* Background com efeito neon */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700"></div>
                          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-sm"></div>
                          <Layers className="h-4 w-4 text-white relative z-10" />
                        </div>
                        <div>
                          <div className="font-medium text-cyan-300">Novo tenant criado</div>
                          <div className="text-sm text-slate-400">
                            Tenant "Development" foi criado com sucesso
                          </div>
                          <div className="text-xs mt-1 text-cyan-700">
                            há 10 minutos
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="cursor-pointer p-4 focus:bg-opacity-40 border-t border-cyan-900/20 hover:bg-cyan-950/30 focus:bg-cyan-950/30">
                      <div className="flex space-x-3 items-start w-full">
                        <div className="relative h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          {/* Background com efeito neon */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700"></div>
                          <div className="absolute inset-0 rounded-full bg-fuchsia-500/20 blur-sm"></div>
                          <DbIcon className="h-4 w-4 text-white relative z-10" />
                        </div>
                        <div>
                          <div className="font-medium text-fuchsia-300">Atualização do sistema</div>
                          <div className="text-sm text-slate-400">
                            Nova versão do TEKTRIO disponível
                          </div>
                          <div className="text-xs mt-1 text-fuchsia-700">
                            há 2 horas
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <div className="p-2 text-center border-t border-cyan-900/30 relative overflow-hidden">
                      {/* Linha de neon animada */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"></div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs w-full justify-center neon-blue hover:bg-cyan-950/30"
                      >
                        Ver todas notificações
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User avatar */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-9 w-9 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg shadow-fuchsia-600/20"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700 blur-sm opacity-80"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-700"></div>
                <span className="z-10 text-sm font-medium">U</span>
              </motion.div>
            </div>
          </div>
        </header>
        
        {/* Main content area with sidebar */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Overlay for mobile */}
          {sidebarOpen && isMobile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - conditionally shown on mobile */}
          <AnimatePresence>
            {(sidebarOpen || !isMobile) && (
              <motion.div 
                initial={isMobile ? { x: -300, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                exit={isMobile ? { x: -300, opacity: 0 } : undefined}
                transition={{ 
                  type: "spring", 
                  damping: 25, 
                  stiffness: 200,
                  opacity: { duration: 0.2 }
                }}
                className="fixed md:relative z-40 h-[calc(100vh-4rem)]"
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content */}
          <main className={cn(
            "flex-1 overflow-y-auto p-6 transition-all duration-300",
            darkMode && "bg-slate-900/50 text-slate-200"
          )}>
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
