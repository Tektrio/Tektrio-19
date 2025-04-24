import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TenantSelector from "@/components/dashboard/TenantSelector";
import { useTenant } from "@/hooks/use-tenant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Layers, 
  Database, 
  Shield, 
  Settings, 
  Users, 
  BarChart3,
  Terminal,
  Server,
  CloudCog,
  ArrowRight,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { currentTenant, isLoading: tenantLoading } = useTenant();
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(42);
  
  // Simulando progresso animado
  useEffect(() => {
    const timer = setTimeout(() => setProgress(82), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats", currentTenant?.schemaName],
    enabled: !!currentTenant,
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">
            TEKTRIO Dashboard
          </h1>
          <p className="text-white/70 mt-1">
            Sistema multi-tenant com isolamento por schema
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <TenantSelector />
        </div>
      </div>
      
      {tenantLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 rounded-xl bg-black border border-gray-800"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-blue-500" />
          </motion.div>
          <span className="mt-4 text-lg font-medium text-blue-500">
            Carregando dados do tenant...
          </span>
          <p className="text-white/50 mt-2">Estabelecendo conexão com o banco de dados</p>
        </motion.div>
      ) : currentTenant ? (
        <div className="space-y-8">
          {/* Resumo geral em cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border-t-4 border-primary shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="px-5 pb-2 pt-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium text-slate-700">Total de Usuários</CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-baseline space-x-1">
                    <div className="text-3xl font-bold">
                      {statsLoading ? "..." : systemStats?.users || 24}
                    </div>
                    <Badge variant="outline" className="text-emerald-500 border-emerald-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Último 30 dias</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-t-4 border-teal-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="px-5 pb-2 pt-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium text-slate-700">Tamanho do DB</CardTitle>
                    <Database className="h-5 w-5 text-teal-500" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-baseline space-x-1">
                    <div className="text-3xl font-bold">
                      {statsLoading ? "..." : systemStats?.dbSize || "156 MB"}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Uso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-t-4 border-amber-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="px-5 pb-2 pt-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium text-slate-700">Tabelas</CardTitle>
                    <Server className="h-5 w-5 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="text-3xl font-bold">
                    {statsLoading ? "..." : systemStats?.tables || 8}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">users</Badge>
                    <Badge variant="secondary" className="text-xs">settings</Badge>
                    <Badge variant="secondary" className="text-xs">logs</Badge>
                    <Badge variant="secondary" className="text-xs">+5</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="overflow-hidden border-t-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="px-5 pb-2 pt-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium text-slate-700">Status</CardTitle>
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-semibold text-green-600">
                      {statsLoading ? "Verificando..." : "Ativo"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Conexão</span>
                      <span className="text-xs font-medium text-green-600">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Migrations</span>
                      <span className="text-xs font-medium text-green-600">Atualizado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Informações do Tenant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/10">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b px-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
                    {currentTenant.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-primary">
                      {currentTenant.name}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Schema: <span className="font-mono">{currentTenant.schemaName}</span>
                    </CardDescription>
                  </div>
                  <Badge className="ml-auto px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    {currentTenant.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-6 p-1 bg-slate-100 rounded-lg">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md transition-all"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Visão Geral
                    </TabsTrigger>
                    <TabsTrigger 
                      value="database"
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md transition-all"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Banco de Dados
                    </TabsTrigger>
                    <TabsTrigger 
                      value="permissions"
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md transition-all"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Permissões
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings"
                      className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md transition-all"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border border-slate-200 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">Atividade Recente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                {item === 1 && <Users className="h-4 w-4 text-primary" />}
                                {item === 2 && <Database className="h-4 w-4 text-teal-500" />}
                                {item === 3 && <Terminal className="h-4 w-4 text-amber-500" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item === 1 && "Usuário adicionado"}
                                  {item === 2 && "Migration executada"}
                                  {item === 3 && "Backup agendado"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {item === 1 && "Novo usuário admin@tektrio.dev criado"}
                                  {item === 2 && "Alterações no schema users aplicadas"}
                                  {item === 3 && "Backup automático configurado para 2h00"}
                                </p>
                              </div>
                              <div className="text-xs text-slate-400">
                                {item === 1 && "10 min atrás"}
                                {item === 2 && "2h atrás"}
                                {item === 3 && "5h atrás"}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                        <CardFooter className="flex justify-center border-t">
                          <Button variant="ghost" size="sm" className="text-primary">
                            Ver todo histórico
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      <Card className="border border-slate-200 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">Informações do Sistema</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Tenant ID</span>
                            <span className="text-sm font-medium">{currentTenant.id}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Data de Criação</span>
                            <span className="text-sm font-medium">
                              {currentTenant.createdAt 
                                ? new Date(currentTenant.createdAt).toLocaleDateString('pt-BR') 
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Última Atualização</span>
                            <span className="text-sm font-medium">
                              {currentTenant.updatedAt 
                                ? new Date(currentTenant.updatedAt).toLocaleDateString('pt-BR') 
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Descrição</span>
                            <span className="text-sm font-medium">
                              {currentTenant.description || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-600">Status</span>
                            <Badge variant={currentTenant.active ? "success" : "destructive"}>
                              {currentTenant.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="database">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 shadow-inner">
                      <div className="max-w-xl mx-auto text-center">
                        <Database className="h-14 w-14 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                          Gerenciamento de Schema
                        </h3>
                        <p className="text-slate-600 mb-6">
                          Gerencie tabelas, índices e realize migrações para o schema deste tenant. 
                          Todas as operações são isoladas e não afetam outros tenants.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <Server className="h-8 w-8 text-teal-500 mb-2" />
                            <h4 className="font-medium">Tabelas</h4>
                            <p className="text-sm text-slate-500 mt-1">Visualize e gerencie tabelas</p>
                          </div>
                          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <Terminal className="h-8 w-8 text-amber-500 mb-2" />
                            <h4 className="font-medium">Migrações</h4>
                            <p className="text-sm text-slate-500 mt-1">Execute scripts e migrações</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                          <Button variant="outline" className="group">
                            Ver Schema
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                            Executar Migração
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="permissions">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 shadow-inner">
                      <div className="max-w-xl mx-auto text-center">
                        <Shield className="h-14 w-14 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                          Permissões de Usuários
                        </h3>
                        <p className="text-slate-600 mb-6">
                          Gerencie papéis e permissões para os usuários deste tenant. 
                          Configure acessos granulares e mantenha a segurança do sistema.
                        </p>
                        
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6">
                          <h4 className="font-medium mb-2">Papéis disponíveis</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Badge variant="secondary" className="px-3 py-1">Administrador</Badge>
                            <Badge variant="secondary" className="px-3 py-1">Usuário</Badge>
                            <Badge variant="secondary" className="px-3 py-1">Visitante</Badge>
                            <Badge variant="secondary" className="px-3 py-1">Editor</Badge>
                            <Badge variant="outline" className="px-3 py-1">+ Adicionar</Badge>
                          </div>
                        </div>
                        
                        <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                          Gerenciar Permissões
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 shadow-inner">
                      <div className="max-w-xl mx-auto">
                        <div className="text-center">
                          <CloudCog className="h-14 w-14 mx-auto text-primary mb-4" />
                          <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                            Configurações do Sistema
                          </h3>
                          <p className="text-slate-600 mb-6">
                            Configure ajustes específicos para este tenant.
                            Personalize o comportamento e funcionalidades do sistema.
                          </p>
                        </div>
                        
                        <div className="space-y-6 bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                          <div className="space-y-4">
                            <h4 className="font-medium border-b pb-2">Configurações gerais</h4>
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">Nome do tenant</div>
                                <div className="text-sm text-slate-500">Nome de exibição do tenant</div>
                              </div>
                              <Button variant="outline" size="sm">Editar</Button>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">Timezone</div>
                                <div className="text-sm text-slate-500">Configuração de fuso horário</div>
                              </div>
                              <Button variant="outline" size="sm">Configurar</Button>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">Modo de manutenção</div>
                                <div className="text-sm text-slate-500">Ativar/desativar acesso ao tenant</div>
                              </div>
                              <Button variant="outline" size="sm">Gerenciar</Button>
                            </div>
                          </div>
                          
                          <div className="text-center pt-4">
                            <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                              Salvar Configurações
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="border border-slate-200 shadow-xl shadow-slate-200/10">
            <CardContent className="pt-10 pb-8 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                className="mb-6"
              >
                <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-white">
                  <Layers className="h-10 w-10" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  Nenhum Tenant Selecionado
                </h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Por favor, selecione um tenant para gerenciar seu schema e dados. 
                  Cada tenant possui seu próprio esquema isolado no banco de dados.
                </p>
                
                <TenantSelector />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
