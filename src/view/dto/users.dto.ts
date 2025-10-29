import { Users } from '@prisma/client';

export class UserDto {
    id!: number;
    name!: string;
    email!: string;

  public static fromEntity(user: Users): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    return dto;
  }
}
