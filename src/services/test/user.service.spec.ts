import { test, expect, vi } from 'vitest';
import { getProfile } from '../../services/user.service';
import { UserDto } from '../../view/dto/users.dto';
import prismaMock from '../../libs/__mocks__/prisma.lib';

vi.mock('../../libs/prisma.lib');

test('deve retornar o perfil do usuário quando existir', async () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    resetToken: 'any_token',
    resetTokenExpiry: new Date(),
  };

  prismaMock.users.findUnique.mockResolvedValue(mockUser);

  const result = await getProfile(1);

  expect(result).toEqual(UserDto.fromEntity(mockUser));
  expect(prismaMock.users.findUnique).toHaveBeenCalledWith({ where: { id: 1} });
});

test('deve lançar um erro quando o usuário não for encontrado', async () => {
  prismaMock.users.findUnique.mockResolvedValue(null);

  await expect(getProfile(999)).rejects.toThrow('Usuário não encontrado.');
  expect(prismaMock.users.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
});

test('deve lançar um erro quando ocorrer um problema no banco de dados', async () => {
  prismaMock.users.findUnique.mockRejectedValue(new Error('Database error'));

  await expect(getProfile(1)).rejects.toThrow('Database error');
  expect(prismaMock.users.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
});
