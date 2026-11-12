import { Routes } from '@angular/router';
import { OverviewComponent } from './overview.component';
import { GoalDetailComponent } from './goal-detail.component';
import { GoalFormComponent } from './goal-form.component';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: OverviewComponent },
  { path: 'goals', component: OverviewComponent },
  { path: 'goals/new', component: GoalFormComponent },
  { path: 'goals/:id/edit', component: GoalFormComponent },
  { path: 'goals/:id', component: GoalDetailComponent },
  { path: '**', redirectTo: 'dashboard' },
];
