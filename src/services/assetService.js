export default class AssetService {
  static getBaseProfilePictureUrls() {
    return [
      '/assets/profile-pics/profile1.png',
      '/assets/profile-pics/profile2.png',
      '/assets/profile-pics/profile3.png',
      '/assets/profile-pics/profile4.png',
    ];
  }

  static getDefaultProfilePictureUrl() {
    return '/assets/profile-pics/profile2.png';
  }

  static getBaseProfileFrameUrls() {
    return [
      '/assets/profile-frame/blueprofile.png',
      '/assets/profile-frame/greenprofile.png',
      '/assets/profile-frame/orangeprofile.png',
      '/assets/profile-frame/redprofile.png',
    ];
  }

  static getSFXUrls() {
    return {
      bgMusic: '/assets/sounds/puzzle-game-bg-music.mp3',
      selectLetter: '/assets/sounds/select.mp3',
      answerCorrect: '/assets/sounds/success.mp3',
      answerWrong: '/assets/sounds/fail.mp3',
      baseClick: '/assets/sounds/buttonclick.wav',
      clearLetter: '/assets/sounds/clear.wav',
      useHint: '/assets/sounds/hint.wav',
      purchased: '/assets/sounds/buyingSound.mp3',
    };
  }
}
