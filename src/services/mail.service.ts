import EmailGateway from '../gateway/resend.gateway';
import { getPasswordResetEmail } from '../view/templates/passwordReset.template';
import { isValidEmail, isValidResetToken } from '../libs/validators.lib';

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  name: string
): Promise<void> => {
  if (!isValidEmail(email)) throw new Error("E-mail inválido");
  if (!isValidResetToken(resetToken)) throw new Error("Token inválido");

  try {
    const { subject, html } = getPasswordResetEmail(name, resetToken);
    await EmailGateway.sendEmail(email, subject, html);
  } catch (error) {
    console.error("Erro ao enviar e-mail de reset:", error);
    throw new Error("Não foi possível enviar o e-mail de reset de senha.");
  }
};

export default { sendPasswordResetEmail };
