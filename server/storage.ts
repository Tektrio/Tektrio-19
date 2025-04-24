import { users, tenants, type User, type InsertUser, type Tenant, type InsertTenant } from "@shared/schema";
import { db, withSchemaTransaction } from "./db";
import { eq } from "drizzle-orm";

// Interface defines storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tenant operations
  getTenants(): Promise<Tenant[]>;
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenantBySchemaName(schemaName: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  
  // Schema-specific operations
  withTenantSchema<T>(schemaName: string, callback: () => Promise<T>): Promise<T>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getTenants(): Promise<Tenant[]> {
    return await db.select().from(tenants);
  }
  
  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }
  
  async getTenantBySchemaName(schemaName: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.schemaName, schemaName));
    return tenant;
  }
  
  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db
      .insert(tenants)
      .values(tenant)
      .returning();
    return newTenant;
  }
  
  async withTenantSchema<T>(schemaName: string, callback: () => Promise<T>): Promise<T> {
    return withSchemaTransaction(schemaName, async () => {
      return callback();
    });
  }
}

// Use database storage
export const storage = new DatabaseStorage();
