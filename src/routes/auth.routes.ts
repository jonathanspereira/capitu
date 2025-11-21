import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/isAuthenticated";
    
const authRoutes = Router();

authRoutes.post('/register', new AuthController().register);
authRoutes.post('/login', new AuthController().login);
authRoutes.post('/forgot-password', new AuthController().requestPasswordReset);
authRoutes.post('/verify-reset-token', new AuthController().verifyResetToken);
authRoutes.post('/reset-password', new AuthController().resetPassword);
authRoutes.delete('/delete-account', authMiddleware, new AuthController().deleteUser);

export default authRoutes;