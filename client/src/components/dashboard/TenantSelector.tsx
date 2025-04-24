import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTenant } from "@/hooks/use-tenant";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function TenantSelector() {
  const { currentTenant, setCurrentTenant, tenants, isLoading } = useTenant();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[220px] justify-start" disabled>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 mr-2" />
        Loading tenants...
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
          className="w-[220px] justify-between"
        >
          {currentTenant ? currentTenant.name : "Select system..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search system..." />
          <CommandEmpty>No system found.</CommandEmpty>
          <CommandGroup>
            {tenants.map((tenant) => (
              <CommandItem
                key={tenant.id}
                value={tenant.schemaName}
                onSelect={() => {
                  setCurrentTenant(tenant);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {tenant.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
