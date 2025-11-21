import * as bcrypt from "bcrypt";
import JwtUtil from "../utils/jwt.util";
import prisma from "../libs/prisma.lib";
import EmailService from "./mail.service";
import { BadRequestError } from "../helpers/api-errors";
import { generateOtpCode } from "../utils/otp.util";
import { UserDto } from "../view/dto/users.dto";
import {
  AuthResponseDto,
  LoginUserDto,
  RegisterUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyTokenDto,
  DeleteUserDto,
} from "../view/dto/auth.dto";

class AuthService {
  // 1  Register
  public async register(dto: RegisterUserDto): Promise<UserDto> {
    const { name, email, password } = dto;

    const userExists = await prisma.users.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestError("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });

    return UserDto.fromEntity(newUser);
  }

  // 2 Login
  public async login(dto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestError("E-mail e senha são obrigatórios");
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestError("Email ou senha inválidos");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Email ou senha inválidos");
    }

    const token = JwtUtil.sign({ id: user.id }, "1h");

    return {
      user: UserDto.fromEntity(user),
      token,
    };
  }

  // 3️ Request password reset
  public async requestPasswordReset(dto: RequestPasswordResetDto): Promise<void> {
    const { email } = dto;
    if (!email) throw new BadRequestError("E-mail é obrigatório");

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return;

    const resetToken = generateOtpCode();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await prisma.users.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    try {
      await EmailService.sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Erro interno ao enviar e-mail. Tente novamente mais tarde.");
    }
  }

  // 4 Verify reset token
  public async verifyResetToken(dto: VerifyTokenDto): Promise<void> {
    const { token } = dto;
    if (!token) throw new BadRequestError("O código é obrigatório.");

    const user = await prisma.users.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) throw new BadRequestError("Código inválido ou expirado. Solicite um novo.");
  }

  // 5 Reset password
  public async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = dto;
    if (!token || !newPassword) throw new BadRequestError("O código e a nova senha são obrigatórios.");

    const user = await prisma.users.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) throw new BadRequestError("Código inválido ou expirado.");

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });
  }

  // 6 Delete user
  public async deleteUser(dto: DeleteUserDto): Promise<void> {
    const { userId, password } = dto;
    
    if (!userId || !password) {
      throw new BadRequestError("ID do usuário e senha são obrigatórios.");
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestError("Usuário não encontrado.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Senha incorreta.");
    }

    // Deletar dados relacionados primeiro (livros e favoritos)
    await prisma.book.deleteMany({ where: { userId } });
    
    // Quando o modelo FavoriteBook estiver ativo, descomentar:
    // await prisma.favoriteBook.deleteMany({ where: { userId } });

    // Deletar o usuário
    await prisma.users.delete({ where: { id: userId } });
  }
}

export default new AuthService();
