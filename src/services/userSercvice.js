import UserApi from '@/api/userApi';
import { useUserStore } from '@/stores';

export default class UserService {
  /**
   * @param {{ username: string, password: string }} userInput
   * @returns {Promise<{ id: string, username: string }>}
   */
  static async signUp(userInput) {
    if (!userInput.username || !userInput.password) {
      return;
    }

    const existingUser = await UserApi.getUserByUsername(userInput.username);

    if (existingUser) {
      return;
    }

    const newUser = await UserApi.createUser(userInput);
    useUserStore().setUser(newUser);
    return newUser;
  }

  /**
   * @param {{ username: string, password: string }} userInput
   * @returns {Promise<User>}
   */
  static async signIn(userInput) {
    const authenticatedUser = await UserApi.authenticateUser(userInput);

    if (!authenticatedUser) {
      return;
    }

    useUserStore().setUser(authenticatedUser);
    return authenticatedUser;
  }
}
