// Script para verificar se as variáveis de ambiente estão definidas
// Atenção: Este script não deve ser commitado em um ambiente real!

console.log('Database URL definida?', process.env.DATABASE_URL ? 'Sim' : 'Não');
// Não exibe o valor real da DATABASE_URL por segurança
console.log('DATABASE_URL começa com:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'N/A');

// Verifica outras variáveis de ambiente que possam ser necessárias
console.log('JWT_SECRET definida?', process.env.JWT_SECRET ? 'Sim' : 'Não');
console.log('NODE_ENV:', process.env.NODE_ENV || 'não definido');