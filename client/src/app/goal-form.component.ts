import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoalService } from './goal.service';
import { GoalInput } from './goal.model';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './goal-form.component.html',
})
export class GoalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(GoalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');
  busy = false;
  loading = false;
  submitted = false;
  error = '';
  form = this.fb.nonNullable.group(
    {
      title: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(120)]],
      description: ['', Validators.maxLength(5000)],
      category: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['pending'],
    },
    {
      validators: (control) => {
        const { startDate, endDate } = control.value;
        return startDate && endDate && endDate < startDate ? { dateOrder: true } : null;
      },
    },
  );
  ngOnInit() {
    if (this.id) {
      this.loading = true;
      this.api.get(this.id).subscribe({
        next: (g) => {
          this.form.patchValue(g);
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load this goal.';
          this.form.disable();
        },
      });
    }
  }
  save() {
    this.submitted = true;
    if (this.form.invalid || this.busy || this.loading) return;
    this.busy = true;
    this.error = '';
    const goal = this.form.getRawValue() as GoalInput;
    (this.id ? this.api.update(this.id, goal) : this.api.create(goal)).subscribe({
      next: (g) => this.router.navigate(['/goals', g.id]),
      error: () => {
        this.busy = false;
        this.error = 'Could not save your goal. Check your details and try again.';
      },
    });
  }
}
