import { pool } from '../server/db';
import dotenv from 'dotenv';
import { hash } from 'bcrypt';

// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Sample data for seeding
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'Admin@123', // Will be hashed
  email: 'admin@tektrio.example',
};

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create admin user if it doesn't exist
    const hashedPassword = await hash(DEFAULT_ADMIN.password, 10);
    
    // Check if user exists
    const userExists = await client.query(
      'SELECT id FROM public.users WHERE username = $1',
      [DEFAULT_ADMIN.username]
    );
    
    let userId;
    if (userExists.rows.length === 0) {
      // Create user
      const userResult = await client.query(
        `INSERT INTO public.users (username, password, email) 
         VALUES ($1, $2, $3) RETURNING id`,
        [DEFAULT_ADMIN.username, hashedPassword, DEFAULT_ADMIN.email]
      );
      userId = userResult.rows[0].id;
      console.log(`Created admin user with ID: ${userId}`);
    } else {
      userId = userExists.rows[0].id;
      console.log(`Admin user already exists with ID: ${userId}`);
    }
    
    // Get all tenants
    const tenants = await client.query('SELECT id, schema_name FROM public.tenants');
    
    // Associate admin with all tenants as admin
    for (const tenant of tenants.rows) {
      // Check if association exists
      const relationExists = await client.query(
        'SELECT id FROM public.user_tenants WHERE user_id = $1 AND tenant_id = $2',
        [userId, tenant.id]
      );
      
      if (relationExists.rows.length === 0) {
        await client.query(
          `INSERT INTO public.user_tenants (user_id, tenant_id, role) 
           VALUES ($1, $2, $3)`,
          [userId, tenant.id, 'admin']
        );
        console.log(`Associated admin user with tenant: ${tenant.schema_name} (role: admin)`);
      } else {
        console.log(`Admin user already associated with tenant: ${tenant.schema_name}`);
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Database seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during database seeding:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Execute the seeding
seedDatabase().catch(error => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});
