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

  const isMuted = reactive({
    bgMusic: localStorage.getItem('isMutedBgMusic') === 'true' || false,
    sfx: localStorage.getItem('isMutedSFX') === 'true' || false,
  });

  const volumes = reactive({
    bgMusic: localStorage.getItem('bgMusicVolume') || 0.5,
    sfx: localStorage.getItem('sfxVolume') || 0.5,
  });

  const playSound = (key, options) => {
    if (options?.reset) sounds[key].currentTime = 0;
    if (options?.loop) sounds[key].loop = options.loop;
    sounds[key].play();
  };

  const updateBgMusicVolume = (volume) => {
    sounds.bgMusic.volume = volume;
    localStorage.setItem('bgMusicVolume', volume);
  };

  const updateSFXVolume = (volume) => {
    for (const key in sounds) {
      if (key !== 'bgMusic') {
        sounds[key].volume = volume;
        localStorage.setItem('sfxVolume', volume);
      }
    }
  };

  const toggleMuteBgMusic = () => {
    isMuted.bgMusic = !isMuted.bgMusic;
    updateBgMusicVolume(isMuted.bgMusic ? 0 : 1);
    localStorage.setItem('isMutedBgMusic', isMuted.bgMusic);
  };

  const toggleMuteSFX = () => {
    isMuted.sfx = !isMuted.sfx;
    for (const key in sounds) {
      if (key !== 'bgMusic') {
        sounds[key].muted = isMuted.sfx;
      }
    }
    localStorage.setItem('isMutedSFX', isMuted.sfx);
  };

  return {
    sounds,
    isMuted,
    volumes,
    playSound,
    updateBgMusicVolume,
    updateSFXVolume,
    toggleMuteBgMusic,
    toggleMuteSFX,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSoundPlayerStore, import.meta.hot));
}
