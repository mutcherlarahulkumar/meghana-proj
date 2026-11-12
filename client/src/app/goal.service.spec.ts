import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { GoalService } from './goal.service';
import { GoalInput } from './goal.model';
describe('GoalService', () => {
  let service: GoalService;
  let http: HttpTestingController;
  const input: GoalInput = {
    title: 'Learn Angular',
    description: 'Build something',
    category: 'Learning',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'pending',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GoalService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('unwraps goal list', () => {
    service.list().subscribe((goals) => expect(goals[0].title).toBe(input.title));
    http.expectOne('/api/goals').flush({ data: [{ id: 1, ...input }] });
  });
  it('creates a goal', () => {
    service.create(input).subscribe((g) => expect(g.id).toBe(1));
    const req = http.expectOne('/api/goals');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({ data: { id: 1, ...input } });
  });
  it('updates a goal', () => {
    service.update('1', input).subscribe();
    const req = http.expectOne('/api/goals/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ data: { id: 1, ...input } });
  });
  it('deletes a goal', () => {
    service.delete('1').subscribe();
    const req = http.expectOne('/api/goals/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
  it('propagates network errors', () => {
    service.get('1').subscribe({ error: (e) => expect(e.status).toBe(404) });
    http.expectOne('/api/goals/1').flush({}, { status: 404, statusText: 'Not Found' });
  });
});
