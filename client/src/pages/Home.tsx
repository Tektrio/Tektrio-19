import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TenantSelector from "@/components/dashboard/TenantSelector";
import { useTenant } from "@/hooks/use-tenant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Layers, Database, Shield, Settings } from "lucide-react";

export default function Home() {
  const { currentTenant, isLoading: tenantLoading } = useTenant();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats", currentTenant?.schemaName],
    enabled: !!currentTenant,
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">TEKTRIO Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Monorepo + Multi-tenant system management
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <TenantSelector />
        </div>
      </div>
      
      {tenantLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg text-slate-600">Loading tenant data...</span>
        </div>
      ) : currentTenant ? (
        <div className="space-y-6">
          {/* Tenant Info */}
          <Card>
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle>
                <span className="text-primary">System: {currentTenant.name}</span>
              </CardTitle>
              <CardDescription>Schema: {currentTenant.schemaName}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">
                    <Layers className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="database">
                    <Database className="h-4 w-4 mr-2" />
                    Database
                  </TabsTrigger>
                  <TabsTrigger value="permissions">
                    <Shield className="h-4 w-4 mr-2" />
                    Permissions
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {statsLoading ? "-" : systemStats?.users || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {statsLoading ? "-" : systemStats?.dbSize || "0 MB"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Schema Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="font-medium">
                            {statsLoading ? "Checking..." : "Active"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="database">
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <Database className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Database Schema Management</h3>
                    <p className="text-slate-600 mb-4">
                      Manage tables, indexes, and perform migrations for this tenant's schema.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="outline">View Schema</Button>
                      <Button>Run Migration</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions">
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">User Permissions</h3>
                    <p className="text-slate-600 mb-4">
                      Manage roles and permissions for users in this tenant.
                    </p>
                    <Button>Manage Permissions</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <Settings className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">System Settings</h3>
                    <p className="text-slate-600 mb-4">
                      Configure settings specific to this tenant.
                    </p>
                    <Button>Edit Settings</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-amber-500 mb-4">
              <Layers className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Tenant Selected</h2>
            <p className="text-slate-600 mb-4">
              Please select a tenant to manage its schema and data.
            </p>
            <TenantSelector />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
