import { compare, hash } from 'bcrypt';

export default class Password {
  /**
   * Method to hash passwords
   * @param senha Password as string
   * @returns Hashed password
   */
  static async generatePassword(senha: string): Promise<string> {
    return hash(senha, 8);
  }

  /**
   * @param senha Password as string
   * @param hash Password as has
   */
  static async comparePassword(senha: string, hash: string): Promise<boolean> {
    try {
      const comparated_passwords = await compare(senha, hash);

      return comparated_passwords;
    } catch (err) {
      return false;
    }
  }
}
