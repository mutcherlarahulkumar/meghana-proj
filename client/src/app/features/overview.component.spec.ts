import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OverviewComponent } from './overview.component';
import { GoalService } from '../core/goal.service';
import { Goal } from '../core/goal.model';
describe('Overview', () => {
  const base = {
    description: 'A daily habit',
    category: 'Learning',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  };
  const goals: Goal[] = [
    { ...base, id: 1, title: 'Read more', status: 'completed' },
    { ...base, id: 2, title: 'Run regularly', status: 'in_progress' },
    { ...base, id: 3, title: 'Learn cooking', status: 'pending' },
  ];
  let api: { list: jest.Mock };
  beforeEach(() => {
    api = { list: jest.fn().mockReturnValue(of(goals)) };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: GoalService, useValue: api }],
    });
  });
  it('calculates completed and pending counts', () => {
    const fixture = TestBed.createComponent(OverviewComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.completed).toBe(1);
    expect(fixture.componentInstance.goals.length - fixture.componentInstance.completed).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Read more');
  });
  it('filters by text and status', () => {
    const c = TestBed.createComponent(OverviewComponent).componentInstance;
    c.ngOnInit();
    c.search = 'run';
    expect(c.visible.map((g) => g.id)).toEqual([2]);
    c.status = 'completed';
    expect(c.visible).toEqual([]);
  });
  it('shows a useful API failure', () => {
    api.list.mockReturnValue(throwError(() => new Error('offline')));
    const fixture = TestBed.createComponent(OverviewComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'couldn’t load',
    );
  });
  it('shows empty state without fabricated goals', () => {
    api.list.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(OverviewComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('A fresh start');
  });
});
