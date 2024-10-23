import client from './clientInstance';

const ENDPOINT = '/users';

class UserApi {
  static async getAllUsers() {
    const users = await client.get(ENDPOINT);
    users.forEach((user) => delete user?.password);

    return users;
  }

  /**
   * @param {string} userId
   * @returns {Promise<User>}
   */
  static async getUser(userId) {
    const user = await client.get(`${ENDPOINT}/${userId}`);
    delete user?.password;

    return user;
  }

  /**
   * @param {string} username
   * @returns {Promise<User>}
   */
  static async getUserByUsername(username) {
    const user = (await client.get(`${ENDPOINT}?username=${username}`))[0];
    delete user?.password;

    return user;
  }

  /**
   * @param {{ username: string, password: string }} userInput
   * @returns {Promise<User>}
   */
  static async authenticateUser({ username, password }) {
    const authenticatedUser = (await client.get(`${ENDPOINT}?username=${username}&password=${password}`))[0];
    delete authenticatedUser?.password;

    return authenticatedUser;
  }

  /**
   * @param {{ username: string, password: string }} userInput
   * @returns {Promise<{ id: string, username: string }>}
   */
  static async createUser(userInput) {
    const newUser = await client.post(ENDPOINT, userInput);
    delete newUser?.password;

    return newUser;
  }

  /**
   * @param {string} userId
   * @param {User}
   * @returns {Promise<User>}
   * @description Allow to only update gameStats and profile
   */
  static async updateUser(userId, { username, gameStats, profile }) {
    const user = await this._getUserWithPassword(userId);

    const newUserData = {
      ...user,
      username,
      gameStats: gameStats || user.gameStats,
      profile: profile || user.profile,
    };

    const updatedUser = await client.put(`${ENDPOINT}/${userId}`, newUserData);
    delete updatedUser?.password;

    return updatedUser;
  }

  /**
   * @param {string} userId
   * @returns {Promise<void>}
   */
  static async deleteUser(userId) {
    return client.delete(`${ENDPOINT}/${userId}`);
  }

  static async _getUserWithPassword(userId) {
    return client.get(`${ENDPOINT}/${userId}`);
  }
}

export default UserApi;
