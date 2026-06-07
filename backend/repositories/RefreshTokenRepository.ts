import { db } from '../config/database';

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

export class RefreshTokenRepository {
  private readonly tableName = 'refresh_tokens';

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await db(this.tableName).where({ token }).first();
    return refreshToken || null;
  }

  async create(data: { userId: string; token: string; expiresAt: Date }): Promise<RefreshToken> {
    const [refreshToken] = await db(this.tableName)
      .insert({
        ...data,
        revoked: false,
      })
      .returning('*');
    return refreshToken;
  }

  async revoke(token: string): Promise<void> {
    await db(this.tableName).where({ token }).update({ revoked: true });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await db(this.tableName).where({ userId }).update({ revoked: true });
  }

  async deleteExpired(): Promise<number> {
    return db(this.tableName).where('expiresAt', '<', db.fn.now()).delete();
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
