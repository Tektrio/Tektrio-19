import { Check, ChevronsUpDown, Database, Shield, Server, Layout, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTenant } from "@/hooks/use-tenant";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function TenantSelector() {
  const { currentTenant, setCurrentTenant, tenants, isLoading } = useTenant();
  const [open, setOpen] = useState(false);

  // Obtém um ícone baseado no nome do tenant
  const getTenantIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('dev') || lowerName.includes('development')) {
      return <Layout className="h-4 w-4 text-blue-500" />;
    } else if (lowerName.includes('prod') || lowerName.includes('production')) {
      return <Server className="h-4 w-4 text-emerald-500" />;
    } else if (lowerName.includes('test') || lowerName.includes('staging')) {
      return <Shield className="h-4 w-4 text-amber-500" />;
    } else {
      return <Database className="h-4 w-4 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[250px] justify-start bg-black/50 backdrop-blur-sm border border-gray-800" disabled>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="mr-2"
        >
          <Loader2 className="h-4 w-4 text-blue-500" />
        </motion.div>
        <span className="text-white/50">Carregando tenants...</span>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[250px] justify-between border border-gray-800 transition-all",
            "bg-black text-white hover:bg-gray-900",
            "data-[state=open]:bg-gray-900 data-[state=open]:ring-2 data-[state=open]:ring-gray-700"
          )}
        >
          <div className="flex items-center">
            {currentTenant ? (
              <>
                <div className="h-6 w-6 rounded-full bg-blue-600 mr-2 flex items-center justify-center text-white text-xs font-medium">
                  {currentTenant.name.charAt(0)}
                </div>
                <span className="font-medium">{currentTenant.name}</span>
                {currentTenant.active && (
                  <Badge variant="outline" className="ml-2 bg-black text-blue-500 text-[10px] font-medium border-blue-800">
                    Ativo
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-white/70">Selecionar sistema...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 border border-gray-800 bg-black shadow-lg">
        <Command className="rounded-lg bg-black">
          <CommandInput placeholder="Buscar sistema..." className="h-9 bg-black text-white border-b border-gray-800" />
          <CommandList className="bg-black text-white">
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                <div className="text-white/50">Nenhum tenant encontrado</div>
                <Button size="sm" variant="outline" className="mt-4 text-white border-gray-700">
                  Criar novo tenant
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup className="py-1.5">
              {tenants.map((tenant) => (
                <CommandItem
                  key={tenant.id}
                  value={tenant.schemaName}
                  onSelect={() => {
                    setCurrentTenant(tenant);
                    setOpen(false);
                  }}
                  className={cn(
                    "py-2 px-2 my-0.5 mx-1 rounded-md cursor-pointer transition-colors text-white",
                    currentTenant?.id === tenant.id && "bg-gray-900"
                  )}
                >
                  <div className="flex items-center w-full">
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center mr-2", 
                      currentTenant?.id === tenant.id 
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white"
                    )}>
                      {tenant.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-white">{tenant.name}</span>
                      <span className="text-xs text-white/50 font-mono">{tenant.schemaName}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-blue-500",
                        currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
