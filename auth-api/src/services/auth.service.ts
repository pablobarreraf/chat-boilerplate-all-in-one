import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserLogin, UserRegistration, User } from "../types/user";
import { dbService } from "./database.service";

export class AuthService {
  public async login(credentials: UserLogin): Promise<string> {
    const user = await dbService.findUserByEmail(credentials.email);

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    return token;
  }
}

export const authService = new AuthService();
