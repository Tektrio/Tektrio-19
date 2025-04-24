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
        <header className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-800 transition-all duration-300 bg-black/90 text-white">
          <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-white"
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
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  <span className="text-lg">TK</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">TEKTRIO</h1>
                  <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
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
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <Input 
                      placeholder="Pesquisar..." 
                      className="w-full pl-10 pr-4 py-2 border-none focus-visible:ring-2 focus-visible:ring-blue-500 bg-gray-900 text-white border-gray-700"
                      autoFocus
                      onBlur={() => setSearchOpen(false)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-3">
              {/* Search button */}
              <Button 
                variant="ghost"
                size="icon" 
                className="rounded-full text-white hover:text-gray-300"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Tech badges for desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black border border-gray-700 text-white shadow-sm"
                >
                  <Github className="h-3 w-3 mr-1" />
                  Replit
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black border border-gray-700 text-white shadow-sm"
                >
                  <DbIcon className="h-3 w-3 mr-1" />
                  NeonDB
                </motion.div>
              </div>
              
              {/* Dark mode toggle */}
              <Button 
                variant="ghost"
                size="icon" 
                className="rounded-full text-white hover:text-gray-300"
                onClick={() => setDarkMode(!darkMode)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </Button>
              
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="icon" 
                    className="rounded-full text-white hover:text-gray-300"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-black" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 p-0 overflow-hidden bg-black border border-gray-700 text-white"
                >
                  <div className="p-4 bg-gray-900/50 border-b border-gray-800">
                    <h3 className="font-semibold text-lg text-white">Notificações</h3>
                    <p className="text-sm text-gray-400">
                      Você tem 2 novas notificações
                    </p>
                  </div>
                  
                  <div className="bg-black">
                    <DropdownMenuItem className="cursor-pointer p-4 focus:bg-opacity-40 border-t border-gray-800 hover:bg-gray-900/50 focus:bg-gray-900/50">
                      <div className="flex space-x-3 items-start w-full">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-white">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Novo tenant criado</div>
                          <div className="text-sm text-gray-400">
                            Tenant "Development" foi criado com sucesso
                          </div>
                          <div className="text-xs mt-1 text-gray-500">
                            há 10 minutos
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="cursor-pointer p-4 focus:bg-opacity-40 border-t border-gray-800 hover:bg-gray-900/50 focus:bg-gray-900/50">
                      <div className="flex space-x-3 items-start w-full">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-white">
                          <DbIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Atualização do sistema</div>
                          <div className="text-sm text-gray-400">
                            Nova versão do TEKTRIO disponível
                          </div>
                          <div className="text-xs mt-1 text-gray-500">
                            há 2 horas
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    
                    <div className="p-2 text-center border-t border-gray-800">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs w-full justify-center text-white hover:bg-gray-900/50"
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
                className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer shadow-sm"
              >
                <span className="text-sm font-medium">U</span>
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
          <main className="flex-1 overflow-y-auto p-6 transition-all duration-300 bg-black text-white">
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
