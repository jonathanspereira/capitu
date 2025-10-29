import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/isAuthenticated";
import UserController from "../controllers/user.controller";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/profile", authMiddleware, (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Não autorizado" });

  userController.getProfile(req, res);
});

export default userRoutes;
