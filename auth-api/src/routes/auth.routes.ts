import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.get("/validate", authenticateToken, authController.validateToken);
router.get("/protected", authenticateToken, (req: any, res) => {
  res.json({ message: "Protected route", user: req.user });
});

export default router;
