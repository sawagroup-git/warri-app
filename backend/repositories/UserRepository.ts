import { db } from '../config/database';
import { User } from '../../src/types';

export class UserRepository {
  private readonly tableName = 'users';

  async findByPhone(phone: string): Promise<User | null> {
    const user = await db(this.tableName).where({ phone }).first();
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await db(this.tableName).where({ id }).first();
    return user || null;
  }

  async create(userData: Partial<User> & { passwordHash: string }): Promise<User> {
    const [user] = await db(this.tableName)
      .insert({
        ...userData,
        updatedAt: db.fn.now(),
      })
      .returning('*');
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const [user] = await db(this.tableName)
      .where({ id })
      .update({
        ...userData,
        updatedAt: db.fn.now(),
      })
      .returning('*');
    return user || null;
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    await db(this.tableName).where({ id }).increment('loginAttempts', 1);
  }

  async resetLoginAttempts(id: string): Promise<void> {
    await db(this.tableName).where({ id }).update({ loginAttempts: 0, lockedUntil: null });
  }

  async lockUser(id: string, lockedUntil: Date): Promise<void> {
    await db(this.tableName).where({ id }).update({ lockedUntil });
  }
}

export const userRepository = new UserRepository();
