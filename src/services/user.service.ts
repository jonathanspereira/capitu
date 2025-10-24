import prisma from '../libs/prisma.lib';
import { UserDto } from '../view/dto/users.dto';

export const getProfile = async (userId: number): Promise<UserDto> => {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return UserDto.fromEntity(user);
};