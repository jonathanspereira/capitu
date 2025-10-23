import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no .env");
}

export interface JwtPayload {
  id: string | number;
}

class JwtUtil {
  static sign(payload: JwtPayload, expiresIn: string = '1h'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  static verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }
}

export default JwtUtil;
