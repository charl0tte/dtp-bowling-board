import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { rotateInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  animations: [rotateInOnEnterAnimation({duration: 2000, degrees: 1080})]
})
export class SpinnerComponent {

  animationState = true

}
