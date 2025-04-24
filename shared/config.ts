// Central configuration management
const config = {
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '20', 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'tektrio-dev-secret-key-change-in-production',
    tokenExpiry: process.env.TOKEN_EXPIRY || '24h',
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  // Default schemas for multi-tenant setup
  schemas: {
    public: 'public',
    systems: ['system_a', 'system_b', 'system_c']
  }
};

// Validate required environment variables in production
if (config.server.env === 'production') {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is required in production!`);
    }
  }
}

export default config;
