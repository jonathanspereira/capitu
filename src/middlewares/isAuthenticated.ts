import { NextFunction, Request, Response } from "express";
import prisma from "../libs/prisma.lib";
import JwtUtil, { JwtPayload } from "../utils/jwt.util";
import { UnauthorizedError } from "../helpers/api-errors";
import { UserDto } from "../view/dto/users.dto";

declare global {
  namespace Express {
    interface Request {
      user?: UserDto;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError("Não autorizado");
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Não autorizado");
    }

    const decoded = JwtUtil.verify(token) as JwtPayload;

    const user = await prisma.users.findUnique({ where: { id: Number(decoded.id) } });

    if (!user) {
      throw new UnauthorizedError("Não autorizado");
    }

    req.user = UserDto.fromEntity(user);

    next();
  } catch (error) {
    next(error);
  }
};
