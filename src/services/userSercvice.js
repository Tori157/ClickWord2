import UserApi from '@/api/userApi';
import { useUserStore } from '@/stores';
import { showAlert } from '@/utils/toast.js';

export default class UserService {
  static async loadAllUsers() {
    return UserApi.getAllUsers();
  }

  /**
   * @param {{ username: string, password: string, profilePicture: string }} userInput
   * @returns {Promise<{ id: string, username: string, profile: { avatar: string } }>}
   */
  static async signUp(userInput) {
    const { username, password } = userInput;
    if (!username || !password) {
      return;
    }

    if (await this._isUsernameTaken(username)) {
      return;
    }

    const DEFAULT_GAME_STATS = {
      coins: 0,
      hints: 3,
      completedPercentage: 0,
      playDuration: 0,
    };

    const newUser = await UserApi.createUser({
      username,
      password,
      gameStats: DEFAULT_GAME_STATS,
      profile: { avatar: userInput.profilePicture, decorations: [], selectedDecoration: '' },
    });
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
      showAlert('Login fail.', 'rgb(255 51  51)');
      return;
    }

    useUserStore().setUser(authenticatedUser);
    showAlert('Login successful!', 'rgb(25 195 178)');
    return authenticatedUser;
  }

  static signOut() {
    useUserStore().clearUser();
    localStorage.clear();
  }

  /**
   *
   * @param {{username: string, profilePicture: string, profileFrame: string}} editUserFormValues
   * @returns
   */
  static async updateProfile({ username, profilePicture, profileFrame }) {
    const { user } = useUserStore();

    if (user.username !== username && (await this._isUsernameTaken(username))) return;

    const profileData = {
      avatar: profilePicture ?? user.profile.avatar,
      decorations: user.profile.decorations,
      selectedDecoration: profileFrame ?? user.profile.selectedDecoration,
    };

    return UserApi.updateUser(user.id, {
      username: username ?? user.username,
      profile: profileData,
    });
  }

  /**
   * @param {string} decoration
   */
  static async addDecoration(decoration) {
    const { user } = useUserStore();
    const decorations = Array.from(new Set([...user.profile.decorations, decoration]));

    return UserApi.updateUser(user.id, {
      profile: {
        ...user.profile,
        decorations,
      },
    });
  }

  static async updateGameStats({ coins, hints, completedPercentage, playDuration }) {
    const { user } = useUserStore();
    const updatedStats = {
      coins: coins ?? user.gameStats.coins,
      hints: hints ?? user.gameStats.hints,
      completedPercentage: completedPercentage ?? user.gameStats.completedPercentage,
      playDuration: playDuration ?? user.gameStats.playDuration,
    };

    return UserApi.updateUser(user.id, { username: user.username, gameStats: updatedStats });
  }

  static async updateCoins(coins) {
    return this.updateGameStats({ coins });
  }

  static async deleteAccount() {
    const { user, clearUser } = useUserStore();

    if (!user) return;

    await UserApi.deleteUser(user.id);
    clearUser();
  }

  static async _isUsernameTaken(username) {
    if (!username) return false;
    return !!(await UserApi.getUserByUsername(username));
  }
}
