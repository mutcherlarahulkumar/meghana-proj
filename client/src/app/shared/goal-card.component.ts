import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Goal, statusLabel } from '../core/goal.model';
@Component({selector:'app-goal-card',standalone:true,imports:[RouterLink,DatePipe],template:`<a class="goal-card" [routerLink]="['/goals',goal.id]"><div class="flex items-center justify-between"><span class="category">{{ goal.category }}</span><span class="card-arrow">↗</span></div><h3>{{ goal.title }}</h3><p class="card-description">{{ goal.description || 'Every meaningful change starts with a first step.' }}</p><div class="card-meta"><span class="status" [class.completed]="goal.status === 'completed'" [class.progress-status]="goal.status === 'in_progress'"><i></i>{{ label(goal.status) }}</span><span>{{ goal.endDate | date:'MMM d, y' }}</span></div></a>`})
export class GoalCardComponent { @Input({required:true}) goal!: Goal; label = statusLabel; }
