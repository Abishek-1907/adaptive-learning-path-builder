import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentService } from './component.service';

describe('ComponentService', () => {
  let service: ComponentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComponentService]
    });
    service = TestBed.inject(ComponentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should call GET /api/components', () => {
    const mockResponse = {
      items: [
        {
          id: 'cmp-assess-math-1',
          title: 'Math Module 1 Assessment',
          shortDescription: 'Baseline math diagnostic.',
          type: 'assessment',
          approximateDurationMinutes: 35,
          metadata: { assessment: { maxScore: 100, passingScore: 50 } }
        }
      ],
      totalCount: 1
    };

    service.getAll().subscribe(res => {
      expect(res.totalCount).toBe(1);
      expect(res.items.length).toBe(1);
      expect(res.items[0].type).toBe('assessment');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/components');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});