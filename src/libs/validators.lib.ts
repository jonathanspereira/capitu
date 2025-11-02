export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const isValidResetToken = (token: string): boolean => {
  const tokenRegex = /^[A-Za-z0-9-_]{20,}$/;
  return tokenRegex.test(token);
};

export const isValidOtpCode = (otp: string): boolean => {
  const otpRegex = /^[0-9]{4,8}$/;
  return otpRegex.test(otp);
};

