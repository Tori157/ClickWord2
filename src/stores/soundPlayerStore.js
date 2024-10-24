import { defineStore, acceptHMRUpdate } from 'pinia';
import { reactive } from 'vue';
import { AssetService } from '@/services';

const initSFX = () => {
  const sfxUrls = AssetService.getSFXUrls();
  const sfx = {};

  for (const key in sfxUrls) {
    sfx[key] = new Audio(sfxUrls[key]);
    sfx[key].volume = 0.5;
  }

  return sfx;
};

export const useSoundPlayerStore = defineStore('soundPlayer', () => {
  const sounds = reactive(initSFX());

  const volumes = reactive({
    bgMusic: parseFloat(localStorage.getItem('bgMusicVolume')) || 0.5,
    sfx: parseFloat(localStorage.getItem('sfxVolume')) || 0.5,
    previousBgMusicVolume: parseFloat(localStorage.getItem('previousBgMusicVolume')) || 0.5,
    previousSfxVolume: parseFloat(localStorage.getItem('previousSfxVolume')) || 0.5,
  });

  const isEnabled = reactive({
    bgMusic: JSON.parse(localStorage.getItem('isEnabledBgMusic')) ?? true,
    sfx: JSON.parse(localStorage.getItem('isEnabledSFX')) ?? true, // Single flag for all SFX
  });

  const playSound = (key, options) => {
    if (options?.reset) sounds[key].currentTime = 0;
    if (options?.loop) sounds[key].loop = options.loop;

    // For background music, check its specific enabled status
    if (key === 'bgMusic' && isEnabled.bgMusic && sounds[key].volume > 0) {
      sounds[key].play();
    }

    // For sound effects, use the global isEnabled.sfx flag
    if (key !== 'bgMusic' && isEnabled.sfx && sounds[key].volume > 0) {
      sounds[key].play();
    }
  };

  const updateBgMusicVolume = (volume) => {
    sounds.bgMusic.volume = volume;
    volumes.bgMusic = volume;
    localStorage.setItem('bgMusicVolume', volume);

    if (isEnabled.bgMusic && volume > 0) {
      playSound('bgMusic', { loop: true });
    }
  };

  const updateSFXVolume = (volume) => {
    volumes.sfx = volume;
    localStorage.setItem('sfxVolume', volume);

    if (isEnabled.sfx) {
      // Update all sound effect volumes (exclude bgMusic)
      for (const key in sounds) {
        if (key !== 'bgMusic') {
          sounds[key].volume = volume;
        }
      }
    }
  };

  const toggleBgMusic = () => {
    if (isEnabled.bgMusic) {
      // Disable sound, but store the current volume
      volumes.previousBgMusicVolume = volumes.bgMusic;
      updateBgMusicVolume(0);
    } else {
      // Enable sound and restore the previous volume
      updateBgMusicVolume(volumes.previousBgMusicVolume || 0.5);
    }
    isEnabled.bgMusic = !isEnabled.bgMusic;
    localStorage.setItem('isEnabledBgMusic', isEnabled.bgMusic);
    localStorage.setItem('previousBgMusicVolume', volumes.previousBgMusicVolume);
  };

  const toggleSFX = () => {
    if (isEnabled.sfx) {
      // Disable all sound effects by setting their volumes to 0
      volumes.previousSfxVolume = volumes.sfx;
      updateSFXVolume(0);
    } else {
      // Re-enable sound effects and restore previous volume
      updateSFXVolume(volumes.previousSfxVolume || 0.5);

      // Reapply the volume to all SFX sounds
      for (const key in sounds) {
        if (key !== 'bgMusic') {
          sounds[key].volume = volumes.previousSfxVolume || 0.5;
        }
      }
    }

    // Toggle the isEnabled.sfx flag
    isEnabled.sfx = !isEnabled.sfx;
    localStorage.setItem('isEnabledSFX', isEnabled.sfx);
    localStorage.setItem('previousSfxVolume', volumes.previousSfxVolume);
  };

  return {
    sounds,
    volumes,
    isEnabled,
    playSound,
    updateBgMusicVolume,
    updateSFXVolume,
    toggleBgMusic,
    toggleSFX,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSoundPlayerStore, import.meta.hot));
}
