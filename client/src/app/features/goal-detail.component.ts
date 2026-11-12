import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoalService } from '../core/goal.service';
import { Goal, statusLabel } from '../core/goal.model';
@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `<a class="back" routerLink="/goals">← Back to my goals</a>
    @if (error) {
      <div class="error" role="alert">{{ error }}</div>
    }
    @if (goal) {
      <div class="page-heading">
        <div>
          <div class="eyebrow">ONE STEP CLOSER</div>
          <h1>{{ goal.title }}</h1>
          <p>Give your goal the attention it deserves.</p>
        </div>
        <a class="btn primary" [routerLink]="['/goals', goal.id, 'edit']">Edit goal ↗</a>
      </div>
      <section class="detail-panel">
        <div class="flex gap-3 items-center">
          <span class="category">{{ goal.category }}</span><span
            class="status"
            [class.completed]="goal.status === 'completed'"
            >{{ label(goal.status) }}</span
          >
        </div>
        <h2>About this goal</h2>
        <p class="description">{{ goal.description || 'No description added.' }}</p>
        <div class="date-grid">
          <div>
            <small>START DATE</small>
            <p>{{ goal.startDate | date: 'longDate' }}</p>
          </div>
          <div>
            <small>END DATE</small>
            <p>{{ goal.endDate | date: 'longDate' }}</p>
          </div>
          <div>
            <small>STATUS</small>
            <p>{{ label(goal.status) }}</p>
          </div>
        </div>
        <div class="danger-zone">
          <p>Ready to let this goal go?</p>
          <button class="btn danger" (click)="confirming = true">Delete goal</button>
        </div>
      </section>
      @if (confirming) {
        <div class="modal-backdrop">
          <section class="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <h2 id="delete-title">Delete this goal?</h2>
            <p>“{{ goal.title }}” will be permanently deleted.</p>
            <div class="flex gap-3 justify-end">
              <button class="btn" [disabled]="busy" (click)="confirming = false">Keep goal</button
              ><button class="btn danger" [disabled]="busy" (click)="remove()">
                {{ busy ? 'Deleting…' : 'Delete goal' }}
              </button>
            </div>
          </section>
        </div>
      }
    } @else if (!error) {
      <p role="status">Loading your goal…</p>
    }`,
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
