import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-cbc'; // Algoritmo de criptografia
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY || 'your_secret_key'; // A chave secreta usada para criptografar
const IV = randomBytes(16); // Vetor de inicialização (IV)

function encryptPassword(password: string): string {
  const cipher = createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf-8'), IV);
  let encrypted = cipher.update(password, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return `${IV.toString('hex')}:${encrypted}`; // Armazenamos o IV junto com a senha criptografada
}

function decryptPassword(encryptedPassword: string): string {
  const [ivHex, encrypted] = encryptedPassword.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf-8'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
