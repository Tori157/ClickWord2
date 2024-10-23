export default class AssetService {
  static getBaseProfilePictureUrls() {
    return [
      '/public/assets/profile-pics/profile1.png',
      '/public/assets/profile-pics/profile2.png',
      '/public/assets/profile-pics/profile3.png',
      '/public/assets/profile-pics/profile4.png',
    ];
  }

  static getDefaultProfilePictureUrl() {
    return '/public/assets/profile-pics/profile2.png';
  }

  static getBaseProfileFrameUrls() {
    return [
      '/public/assets/profile-frame/blueprofile.png',
      '/public/assets/profile-frame/greenprofile.png',
      '/public/assets/profile-frame/orangeprofile.png',
      '/public/assets/profile-frame/redprofile.png',
    ];
  }
}
