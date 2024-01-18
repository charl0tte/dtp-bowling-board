import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, map, startWith, timer } from 'rxjs';
import { SpinnerComponent } from './spinner/spinner.component';
import { Player } from './model/player.model';
import { exampleData } from './helpers/data/example.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  title = 'Bowling Score Board 🎳';
  players$ = new Subject<Player[]>();
  playersData: Player[] = [];
  loading$ = timer(3_000).pipe(map(_ => false), startWith(true));
  largestScore =  Array(22);
  @ViewChild('fileInput') fileInput: ElementRef;

  uploadFile($event: Event): void {
    const files = ($event?.target as HTMLInputElement).files;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.resetData();
      this.readDataFromFile(event.target?.result as string)
    }
    if (files) {
      reader.readAsText(files[0])
    }
  }

  useExample(): void {
    this.resetData();
    this.playersData = exampleData.map(player => ({ ...player, finalScore: this.calculateFinalScore(player.scores) }));
    this.players$.next(this.playersData);
  }

  readDataFromFile(data: string): void {
    const lines = data.split(/\r\n/);

    for (let i = 0; i < lines.length; i += 2) {
      const name = lines[i].trim();
      const scores = lines[i + 1].split(',').map((score) => parseInt(score.trim(), 10));

      this.playersData.push({ name, scores, finalScore: this.calculateFinalScore(scores) });
    }
    this.players$.next(this.playersData)
  }

  calculateFinalScore(scores: number[]): number {
    let finalScore = 0;
    let moveIndex = 0;
    for (let index = 0; index < 10; index++) {
      const move = scores[moveIndex];
      const nextMove = scores[moveIndex + 1] || 0;
      const additionalMove = scores[moveIndex + 2] || 0;
      if (nextMove) {
        const sum = move + nextMove;
        let result = 0;
        if (sum === 10) {
          result = sum + additionalMove;
          moveIndex += 2;
        } else if (move === 10) {
          result = move + nextMove + additionalMove;
          moveIndex += 1;
        } else {
          result = sum;
          moveIndex += 2;
        }
        finalScore += result;
      }
    }

    return finalScore;
  }

  resetData(): void {
    this.fileInput.nativeElement.value = '';
    this.playersData = [];
    this.players$.next([]);
  }

}
