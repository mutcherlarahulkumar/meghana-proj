import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoalService } from '../core/goal.service';
import { GoalInput } from '../core/goal.model';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `<a class="back" routerLink="/goals">← Back to my goals</a>
    <div class="page-heading">
      <div>
        <div class="eyebrow">MAKE ROOM FOR WHAT MATTERS</div>
        <h1>{{ id ? 'Refine your goal.' : 'A new beginning.' }}</h1>
        <p>
          {{
            id
              ? 'Plans evolve. Keep yours moving with you.'
              : 'Big things start with a clear intention.'
          }}
        </p>
      </div>
    </div>
    @if (error) {
      <div class="error" role="alert">{{ error }}</div>
    }
    <form class="form-panel" [formGroup]="form" (ngSubmit)="save()">
      <h2>{{ id ? 'Edit goal' : 'Create a goal' }}</h2>
      <p class="form-intro">A little detail makes a big difference.</p>
      <label
        >Goal title <span>*</span
        ><input
          formControlName="title"
          maxlength="120"
          placeholder="What would you like to achieve?" /></label
      ><label
        >Description<textarea
          formControlName="description"
          maxlength="5000"
          rows="4"
          placeholder="Your why, your plan, your inspiration…"
        ></textarea>
      </label>
      <div class="form-grid">
        <label
          >Category <span>*</span
          ><input
            formControlName="category"
            maxlength="60"
            list="categories"
            placeholder="Choose or write a category"
          /><datalist id="categories">
            <option>Personal growth</option>
            <option>Health & fitness</option>
            <option>Career</option>
            <option>Learning</option>
            <option>Finance</option>
            <option>Creative</option>
          </datalist></label
        ><label
          >Status <span>*</span
          ><select formControlName="status">
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select></label
        ><label>Start date <span>*</span><input type="date" formControlName="startDate" /></label
        ><label
          >End date <span>*</span
          ><input type="date" formControlName="endDate" [min]="form.controls.startDate.value"
        /></label>
      </div>
      @if (submitted && form.invalid) {
        <p class="validation" role="alert">
          Enter a title, category, and valid dates. The end date must be on or after the start date.
        </p>
      }
      <div class="form-actions">
        <a class="btn" routerLink="/goals">Cancel</a
        ><button class="btn primary" type="submit" [disabled]="busy || loading">
          {{ busy ? 'Saving…' : id ? 'Save changes ↗' : 'Create goal ↗' }}
        </button>
      </div>
    </form>`,
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
