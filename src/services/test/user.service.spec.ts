import { test, expect, vi } from 'vitest'
import { getProfile } from '../../services/user.service'
import { UserDto } from '../../view/dto/users.dto'
import prisma from '../../libs/prisma.lib';

vi.mock('../../libs/prisma.lib', () => ({
  default: {
    users: {
      findUnique: vi.fn(),
    },
  },
}));


test('deve retornar o perfil do usuário quando existir', async () => {

    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password',
      resetToken: 'any_token',
      resetTokenExpiry: new Date(),
    };

    (prisma.users.findUnique as any).mockResolvedValue(mockUser);

    const result = await getProfile(1);

    expect(result).toEqual(UserDto.fromEntity(mockUser));
    expect(prisma.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
});

test('deve lançar um erro quando o usuário não for encontrado', async () => {
    (prisma.users.findUnique as any).mockResolvedValue(null);

    await expect(getProfile(999)).rejects.toThrow('Usuário não encontrado.');
    expect(prisma.users.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
});

test('deve lançar um erro quando ocorrer um problema no banco de dados', async () => {
    (prisma.users.findUnique as any).mockRejectedValue(new Error('Database error'));

    await expect(getProfile(1)).rejects.toThrow('Database error');
    expect(prisma.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
});
