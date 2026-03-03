import { Howl } from "howler";
import type { Metadata } from ".";
import { SubscribableEvent } from "./event";

export class AudioPlayer {
  private howl: Howl | null = null;
  private progressInterval: number | undefined;

  private _isPlaying = false;
  private _progress = 0;
  private _duration = 0;
  private _volume = 0.5;
  private _isMuted = false;
  private _updateInterval: number;

  public onEnded = new SubscribableEvent();
  public onProgressChanged = new SubscribableEvent<number>();
  public onPlayingChanged = new SubscribableEvent<boolean>();
  public onVolumeChanged = new SubscribableEvent<number>();
  public onMutedChanged = new SubscribableEvent<boolean>();

  constructor(updateInterval: number = 250) {
    this._updateInterval = updateInterval;
  }

  get isPlaying() {
    return this._isPlaying;
  }
  get progress() {
    return this._progress;
  }
  get duration() {
    return this._duration;
  }
  get volume() {
    return this._volume;
  }
  get isMuted() {
    return this._isMuted;
  }

  private startProgressTracking = () => {
    this.stopProgressTracking();
    this.progressInterval = window.setInterval(() => {
      if (this.howl) {
        const seek = this.howl.seek() as number;
        const dur = this.howl.duration();
        this._progress = dur > 0 ? seek / dur : 0;
        this.onProgressChanged.raise(this._progress);
      }
    }, this._updateInterval);
  };

  private stopProgressTracking = () => {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  };

  public play = (track: Metadata) => {
    // Clean up previous instance
    if (this.howl) {
      this.howl.unload();
    }
    this.stopProgressTracking();

    const url = `${
      import.meta.env.VITE_DEVPREFIX
    }/api/audio?path=${encodeURIComponent(track.path)}`;

    this.howl = new Howl({
      src: [url],
      html5: true, // Important: enables streaming & seeking for large files
      format: [track.path.endsWith(".ogg") ? "ogg" : "mp3"],
      onload: () => {
        this._duration = this.howl?.duration() ?? 0;
      },
      onplay: () => {
        this._isPlaying = true;
        this.startProgressTracking();
        this.onPlayingChanged.raise(true);
      },
      onpause: () => {
        this._isPlaying = false;
        this.stopProgressTracking();
        this.onPlayingChanged.raise(false);
      },
      onstop: () => {
        this._isPlaying = false;
        this.stopProgressTracking();
        this.onPlayingChanged.raise(false);
      },
      onend: () => {
        this._isPlaying = false;
        this._progress = 0;
        this.stopProgressTracking();

        this.onEnded.raise();
      },
    });

    this.howl.volume(this._volume);
    this.howl.mute(this._isMuted);
    this.howl.play();
  };

  togglePlayPause = () => {
    if (!this.howl) return;

    if (this._isPlaying) {
      this.howl.pause();
    } else {
      this.howl.play();
    }
  };

  seek = (position: number) => {
    if (!this.howl) return;
    this.howl.seek(position * this.howl.duration());
  };

  setVolume = (volume: number) => {
    this._volume = volume;
    this.howl?.volume(volume);
    this.onVolumeChanged.raise(volume);
  };

  setMuted = (muted: boolean) => {
    this._isMuted = muted;
    this.howl?.mute(muted);
    this.onMutedChanged.raise(muted);
  };

  toggleMuted = () => {
    this.setMuted(!this._isMuted);
    this.onMutedChanged.raise(this._isMuted);
  };

  destroy = () => {
    this.stopProgressTracking();
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }
  };
}
