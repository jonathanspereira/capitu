import { UserDto } from './users.dto';

// --- Input DTOs ---
export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface VerifyTokenDto {
  token: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// --- Output DTO ---
export interface AuthResponseDto {
  user: UserDto;
  token: string;
}