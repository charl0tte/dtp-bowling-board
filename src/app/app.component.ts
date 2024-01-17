import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { Player } from './player.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'dtp-bowling-board';

  content = new Subject<Player[]>();

  players: Player[] = [];

  uploadFile($event: Event): void {
    const files = ($event?.target as HTMLInputElement).files;
    console.log(files);
    const reader = new FileReader();
    reader.onload = (e) => {
      // this.content.next(e.target?.result);
      this.readDataFromFile(e.target?.result as string)
    }
    reader.readAsText(files![0])
  }

  readDataFromFile(data: string): void {
    const lines = data.split(/\r\n/);
    for (let i = 0; i < lines.length; i += 2) {
      const name = lines[i].trim();
      const scores = lines[i + 1].split(',').map((score) => parseInt(score.trim(), 10));
      let finalScore = 0;
      for (let index = 0; index < scores.length; index += 2) {
        const move = scores[index];
        const nextMove = scores[index + 1] || 0;
        const additionalMove = scores[index + 2] || 0;
        if (nextMove) {
          const sum = move + nextMove;
          const result = sum === 10 || sum === 20 ? sum + additionalMove : sum;
          finalScore += result;
        }
      }

      this.players.push({ name, scores, finalScore });
    }
    console.log(this.players);
    this.content.next(this.players)
  }
}
