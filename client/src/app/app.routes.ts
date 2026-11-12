import { Routes } from '@angular/router';
import { OverviewComponent } from './features/overview.component';
import { GoalDetailComponent } from './features/goal-detail.component';
import { GoalFormComponent } from './features/goal-form.component';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: OverviewComponent },
  { path: 'goals', component: OverviewComponent },
  { path: 'goals/new', component: GoalFormComponent },
  { path: 'goals/:id/edit', component: GoalFormComponent },
  { path: 'goals/:id', component: GoalDetailComponent },
  { path: '**', redirectTo: 'dashboard' },
];
