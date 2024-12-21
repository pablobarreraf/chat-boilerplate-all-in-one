import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { UserLogin, UserRegistration } from '../types/user';

export class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: UserLogin = req.body;
      const token = await authService.login(credentials);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  public async validateToken(req: Request, res: Response): Promise<void> {
    try {
      // The user object is attached by the authenticateToken middleware
      const user = (req as any).user;
      res.json({
        valid: true,
        user: {
          userId: user.userId,
          email: user.email
        }
      });
    } catch (error) {
      res.status(401).json({ 
        valid: false,
        error: (error as Error).message 
      });
    }
  }
}

export const authController = new AuthController();