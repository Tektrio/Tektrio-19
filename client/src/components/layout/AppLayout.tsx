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
      <div className={cn(
        "min-h-screen flex flex-col tech-grid-bg",
        darkMode ? "tech-layout" : "bg-slate-50"
      )}>
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300",
          darkMode 
            ? "bg-slate-900/80 border-slate-700/50 text-slate-100" 
            : "bg-white/90 border-slate-200"
        )}>
          <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={cn(
                    "md:hidden tech-glow",
                    darkMode ? "text-slate-300" : "text-slate-700"
                  )}
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
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                  <span className="z-10">TK</span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 blur-md opacity-70"></div>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tech-gradient-text tracking-tight">TEKTRIO</h1>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
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
                variant={darkMode ? "ghost" : "ghost"}
                size="icon" 
                className={cn(
                  "rounded-full tech-glow",
                  darkMode ? "text-slate-300 hover:text-white hover:bg-slate-800" : ""
                )}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Tech badges for desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20"
                >
                  <Github className="h-3 w-3 mr-1" />
                  Replit
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-green-500/20"
                >
                  <DbIcon className="h-3 w-3 mr-1" />
                  NeonDB
                </motion.div>
              </div>
              
              {/* Dark mode toggle */}
              <Button 
                variant={darkMode ? "ghost" : "ghost"}
                size="icon" 
                className={cn(
                  "rounded-full relative tech-glow transition-all duration-300",
                  darkMode ? "text-yellow-300 hover:text-yellow-200" : "text-slate-700"
                )}
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
                  className={cn(
                    "absolute inset-0 rounded-full",
                    darkMode ? "bg-yellow-300" : "bg-slate-700"
                  )}
                />
              </Button>
              
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={darkMode ? "ghost" : "ghost"}
                    size="icon" 
                    className={cn(
                      "rounded-full relative tech-glow",
                      darkMode ? "text-slate-300 hover:text-white hover:bg-slate-800" : ""
                    )}
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className={cn(
                    "w-80 p-0 overflow-hidden",
                    darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "",
                    "shadow-lg shadow-blue-500/5"
                  )}
                >
                  <div className={cn(
                    "p-4 bg-gradient-to-r",
                    darkMode 
                      ? "from-slate-700 to-slate-800 border-b border-slate-700" 
                      : "from-slate-50 to-white border-b border-slate-100"
                  )}>
                    <h3 className="font-semibold text-lg tech-gradient-text">Notificações</h3>
                    <p className={cn(
                      "text-sm",
                      darkMode ? "text-slate-400" : "text-slate-500"
                    )}>
                      Você tem 2 novas notificações
                    </p>
                  </div>
                  
                  <div className={cn(
                    darkMode ? "bg-slate-800" : "bg-white"
                  )}>
                    <DropdownMenuItem className={cn(
                      "cursor-pointer p-4 focus:bg-opacity-40",
                      darkMode 
                        ? "border-t border-slate-700 hover:bg-slate-700 focus:bg-slate-700" 
                        : "border-t border-slate-100 hover:bg-slate-50 focus:bg-slate-50"
                    )}>
                      <div className="flex space-x-3 items-start w-full">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                        )}>
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Novo tenant criado</div>
                          <div className={cn(
                            "text-sm",
                            darkMode ? "text-slate-400" : "text-slate-500"
                          )}>
                            Tenant "Development" foi criado com sucesso
                          </div>
                          <div className={cn(
                            "text-xs mt-1",
                            darkMode ? "text-slate-500" : "text-slate-400"
                          )}>
                            há 10 minutos
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className={cn(
                      "cursor-pointer p-4 focus:bg-opacity-40",
                      darkMode 
                        ? "border-t border-slate-700 hover:bg-slate-700 focus:bg-slate-700" 
                        : "border-t border-slate-100 hover:bg-slate-50 focus:bg-slate-50"
                    )}>
                      <div className="flex space-x-3 items-start w-full">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                        )}>
                          <DbIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Atualização do sistema</div>
                          <div className={cn(
                            "text-sm",
                            darkMode ? "text-slate-400" : "text-slate-500"
                          )}>
                            Nova versão do TEKTRIO disponível
                          </div>
                          <div className={cn(
                            "text-xs mt-1",
                            darkMode ? "text-slate-500" : "text-slate-400"
                          )}>
                            há 2 horas
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <div className={cn(
                      "p-2 text-center",
                      darkMode ? "border-t border-slate-700" : "border-t border-slate-100"
                    )}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "text-xs w-full justify-center tech-gradient-text",
                          darkMode ? "hover:bg-slate-700" : ""
                        )}
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
                className="relative h-9 w-9 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-sm opacity-80"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
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
