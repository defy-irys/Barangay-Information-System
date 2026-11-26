import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const SALT_BYTES = 16;
const KEY_BYTES = 64;
const MAX_PASSWORD_LENGTH = 256;
const SCRYPT_OPTIONS = { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, KEY_BYTES, SCRYPT_OPTIONS, (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key as Buffer);
      }
    });
  });
}

export async function hashAdminPassword(password: string): Promise<string> {
  if (!password || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("Password must contain 1 to 256 characters.");
  }

  const salt = randomBytes(SALT_BYTES);
  const key = await deriveKey(password, salt);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyAdminPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  if (!password || password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  const match = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{128})$/i.exec(encodedHash);
  if (!match) {
    return false;
  }

  const salt = Buffer.from(match[1], "hex");
  const expectedKey = Buffer.from(match[2], "hex");
  const actualKey = await deriveKey(password, salt);

  return timingSafeEqual(actualKey, expectedKey);
}
