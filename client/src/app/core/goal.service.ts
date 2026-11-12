import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Goal, GoalInput } from './goal.model';
@Injectable({ providedIn: 'root' })
export class GoalService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<{ data: Goal[] }>('/api/goals').pipe(map((r) => r.data));
  }
  get(id: string) {
    return this.http.get<{ data: Goal }>(`/api/goals/${id}`).pipe(map((r) => r.data));
  }
  create(goal: GoalInput) {
    return this.http.post<{ data: Goal }>('/api/goals', goal).pipe(map((r) => r.data));
  }
  update(id: string, goal: GoalInput) {
    return this.http.put<{ data: Goal }>(`/api/goals/${id}`, goal).pipe(map((r) => r.data));
  }
  delete(id: string) {
    return this.http.delete<void>(`/api/goals/${id}`);
  }
}
