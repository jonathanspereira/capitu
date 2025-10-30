import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no .env");
}

export interface JwtPayload {
  id: string | number;
}

class JwtUtil {
  static sign(payload: JwtPayload, expiresIn: `${number}${'s' | 'm' | 'h' | 'd'}` = '1h'): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
        throw new Error("Token inválido");
      }

      return decoded as JwtPayload;
    } catch {
      throw new Error("Token inválido ou expirado");
    }
  }
}

export default JwtUtil;
