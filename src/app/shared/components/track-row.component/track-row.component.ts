import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-track-row',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './track-row.component.html',
  styleUrl: './track-row.component.css'
})
export class TrackRowComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() artist: string = '';
  @Input() album: string = '';
  @Input() duration: number = 0;
  @Input() index: number = 0;
  @Output() play = new EventEmitter<void>();

  get formattedDuration(): string {
    const minutes = Math.floor(this.duration / 60000);
    const seconds = Math.floor((this.duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onPlay(): void {
    this.play.emit();
  }
}