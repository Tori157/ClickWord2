import client from './clientInstance';

const ENDPOINT = '/users';

class UserApi {
  /**
   * @param {string} userId
   * @returns {Promise<User>}
   */
  static async getUser(userId) {
    return client.get(`${ENDPOINT}/${userId}`);
  }

  /**
   * @param {string} username
   * @returns {Promise<User>}
   */
  static async getUserByUsername(username) {
    return (await client.get(`${ENDPOINT}?username=${username}`))[0];
  }

  /**
   * @param {{ username: string, password: string }} userInput
   * @returns {Promise<User>}
   */
  static async authenticateUser({ username, password }) {
    const authenticatedUser = (await client.get(`${ENDPOINT}?username=${username}&password=${password}`))[0];
    delete authenticatedUser.password;

    return authenticatedUser;
  }

  /**
   * @param {{ username: string, password: string }} userInput
   * @returns {Promise<{ id: string, username: string }>}
   */
  static async createUser(userInput) {
    const newUser = await client.post(ENDPOINT, userInput);
    delete newUser.password;

    return newUser;
  }

  /**
   * @param {string} userId
   * @param {User}
   * @returns {Promise<User>}
   * @description Allow to only update gameStats and profile
   */
  static async updateUser(userId, { gameStats, profile }) {
    const user = await this.getUser(userId);

    const newUserData = {
      ...user,
      gameStats: gameStats || user.gameStats,
      profile: profile || user.profile,
    };

    const updatedUser = await client.put(`${this.ENDPOINT}/${userId}`, newUserData);
    delete updatedUser.password;

    return updatedUser;
  }

  /**
   * @param {string} userId
   * @returns {Promise<void>}
   */
  static async deleteUser(userId) {
    return client.delete(`${ENDPOINT}/${userId}`);
  }
}

export default UserApi;
