import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Goal, statusLabel } from './goal.model';
@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './goal-card.component.html',
})
export class GoalCardComponent {
  @Input({ required: true }) goal!: Goal;
  label = statusLabel;
}
