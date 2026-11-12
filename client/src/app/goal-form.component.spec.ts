import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GoalFormComponent } from './goal-form.component';
import { GoalService } from './goal.service';
describe('Goal form', () => {
  let component: GoalFormComponent;
  let api: { create: jest.Mock };
  beforeEach(() => {
    api = { create: jest.fn().mockReturnValue(of({ id: 1 })) };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: GoalService, useValue: api },
      ],
    });
    component = TestBed.createComponent(GoalFormComponent).componentInstance;
  });
  it('blocks empty submission', () => {
    component.save();
    expect(api.create).not.toHaveBeenCalled();
  });
  it('rejects end date before start date', () => {
    component.form.patchValue({
      title: 'Goal',
      category: 'Career',
      startDate: '2026-12-01',
      endDate: '2026-01-01',
    });
    expect(component.form.hasError('dateOrder')).toBe(true);
  });
  it('accepts a complete goal', () => {
    component.form.patchValue({
      title: 'Goal',
      category: 'Career',
      startDate: '2026-01-01',
      endDate: '2026-12-01',
    });
    expect(component.form.valid).toBe(true);
  });
});
