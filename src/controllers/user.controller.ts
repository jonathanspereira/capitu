import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { BadRequestError } from '../helpers/api-errors';
import { UserDto } from '../view/dto/users.dto';

export interface AuthenticatedRequest extends Request {
  user: UserDto;
}

export class UserController {

    async getProfile(req: AuthenticatedRequest, res: Response) {
    try {

      const { id } = req.user;

      const userProfileDto = await UserService.getProfile(id);

      return res.status(200).json(userProfileDto);

    } catch (error) {
      if (error instanceof BadRequestError) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  } 
}