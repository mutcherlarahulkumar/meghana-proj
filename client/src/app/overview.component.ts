import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoalService } from './goal.service';
import { Goal } from './goal.model';
import { GoalCardComponent } from './goal-card.component';
@Component({
  standalone: true,
  imports: [RouterLink, FormsModule, GoalCardComponent],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  private api = inject(GoalService);
  private router = inject(Router);
  goals: Goal[] = [];
  loading = true;
  error = '';
  search = '';
  status = '';
  get isDashboard() {
    return this.router.url.startsWith('/dashboard');
  }
  get completed() {
    return this.goals.filter((g) => g.status === 'completed').length;
  }
  get visible() {
    const filtered = this.goals.filter(
      (g) =>
        (!this.status || g.status === this.status) &&
        (g.title + ' ' + g.description + ' ' + g.category)
          .toLowerCase()
          .includes(this.search.toLowerCase()),
    );
    return this.isDashboard ? filtered.slice(0, 3) : filtered;
  }
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.error = '';
    this.api.list().subscribe({
      next: (goals) => {
        this.goals = goals;
        this.loading = false;
      },
      error: () => {
        this.error = 'We couldn’t load your goals. Check that the API and database are available.';
        this.loading = false;
      },
    });
  }
}
