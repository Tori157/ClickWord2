class AudioPlayer {
  /**
   *
   * @param  {{ key: string, src: string }[]} playlist
   */
  constructor(...playlist) {
    /**
     * @type {{ key: string, audio: HTMLAudioElement }[]} playlist
     */
    this.playlist = playlist.forEach((a) => {
      return { key: a.key, object: new Audio(a.src) };
    });
  }

  play(key, { replay = false, loop = false }) {
    const audio = this.playlist.find((a) => a.key === key).object;
    if (replay) {
      audio.currentTime = 0;
    }
    audio.play();
    audio.loop = loop;
  }

  setGlobalVolume(level) {
    this.playlist.forEach((a) => {
      a.object.volume = level;
    });
  }
}

export default AudioPlayer;
