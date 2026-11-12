import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoalService } from './goal.service';
import { Goal, statusLabel } from './goal.model';
@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './goal-detail.component.html',
})
export class GoalDetailComponent implements OnInit {
  private api = inject(GoalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  goal?: Goal;
  error = '';
  confirming = false;
  busy = false;
  label = statusLabel;
  ngOnInit() {
    this.api.get(this.route.snapshot.paramMap.get('id')!).subscribe({
      next: (g) => (this.goal = g),
      error: (e) =>
        (this.error =
          e.status === 404
            ? 'This goal could not be found.'
            : 'Unable to load this goal. Please try again.'),
    });
  }
  remove() {
    this.busy = true;
    this.api.delete(String(this.goal!.id)).subscribe({
      next: () => this.router.navigate(['/goals']),
      error: () => {
        this.busy = false;
        this.confirming = false;
        this.error = 'Could not delete the goal. Please try again.';
      },
    });
  }
}
