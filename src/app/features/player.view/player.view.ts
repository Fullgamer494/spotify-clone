import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/api/api.service';
import { Track } from '../../core/models/track.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './player.view.html',
  styleUrl: './player.view.css'
})
export class PlayerView implements OnInit {
  currentTrack: Track | null = null;
  queue: Track[] = [];
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 70;
  showVolumeSlider = false;
  
  private audioElement: HTMLAudioElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { track: Track, queue?: Track[] };
    
    if (state?.track) {
      this.currentTrack = state.track;
      this.queue = state.queue || [];
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      if (trackId && !this.currentTrack) {
        this.loadTrack(trackId);
      }
    });
    
    if (this.currentTrack?.preview_url) {
      this.initAudio();
    }
  }

  private loadTrack(id: string): void {
    this.api.getTrack(id).subscribe({
      next: (track) => {
        this.currentTrack = track;
        this.initAudio();
      },
      error: (err) => console.error('Error loading track:', err)
    });
  }

  private initAudio(): void {
    if (!this.currentTrack?.preview_url) return;
    
    this.audioElement = new Audio(this.currentTrack.preview_url);
    this.duration = this.currentTrack.duration_ms / 1000;
    
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
      }
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playNext();
    });
    
    this.audioElement.volume = this.volume / 100;
  }

  togglePlay(): void {
    if (!this.audioElement || !this.currentTrack?.preview_url) {
      alert('No preview available for this track');
      return;
    }
    
    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  playNext(): void {
    if (this.queue.length > 0) {
      const nextTrack = this.queue.shift();
      if (nextTrack) {
        this.currentTrack = nextTrack;
        this.audioElement?.pause();
        this.initAudio();
        this.togglePlay();
      }
    }
  }

  playPrevious(): void {
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  seek(event: Event): void {
    const target = event.target as HTMLInputElement;
    const time = parseFloat(target.value);
    if (this.audioElement) {
      this.audioElement.currentTime = time;
      this.currentTime = time;
    }
  }

  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
    if (this.audioElement) {
      this.audioElement.volume = this.volume / 100;
    }
  }

  toggleMute(): void {
    if (this.audioElement) {
      this.audioElement.muted = !this.audioElement.muted;
    }
  }

  playFromQueue(track: Track, index: number): void {
    this.queue.splice(index, 1);
    this.queue.unshift(this.currentTrack!);
    this.currentTrack = track;
    this.audioElement?.pause();
    this.initAudio();
    this.togglePlay();
  }

  removeFromQueue(index: number): void {
    this.queue.splice(index, 1);
  }

  goBack(): void {
    this.audioElement?.pause();
    this.router.navigate(['/']);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get progressPercentage(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  getAlbumImage(): string {
    if (this.currentTrack?.album?.images && this.currentTrack.album.images.length > 0) {
      return this.currentTrack.album.images[0].url;
    }
    return 'https://via.placeholder.com/300';
  }

  getArtistNames(): string {
    if (this.currentTrack?.artists && this.currentTrack.artists.length > 0) {
      return this.currentTrack.artists.map(a => a.name).join(', ');
    }
    return 'Unknown Artist';
  }

  ngOnDestroy(): void {
    this.audioElement?.pause();
    this.audioElement = null;
  }
}