import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import { User } from '../types/user';
import bcrypt from 'bcryptjs';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database;

  private constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.initializeDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeDatabase(): void {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT UNIQUE,
          password TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add test users if they don't exist
      this.createTestUsers();
    });
  }

  private async createTestUsers(): Promise<void> {
    try {
        // Delete only test users
        await new Promise<void>((resolve, reject) => {
            this.db.run('DELETE FROM users WHERE email IN (?, ?)', 
                ['test1@example.com', 'test2@example.com'], 
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        // First hash the password to get the correct hash
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const testUsers = [
            {
                username: 'testuser1',
                email: 'test1@example.com',
                password: hashedPassword
            },
            {
                username: 'testuser2',
                email: 'test2@example.com',
                password: hashedPassword
            }
        ];

        // Insert new test users
        for (const user of testUsers) {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [user.username, user.email, user.password],
                    (err) => {
                        if (err) reject(err);
                        resolve();
                    }
                );
            });
        }
    } catch (error) {
        console.error('Error recreating test users:', error);
    }
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row: User) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }
}

export const dbService = DatabaseService.getInstance();