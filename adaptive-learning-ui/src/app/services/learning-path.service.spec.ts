import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LearningPathService } from './learning-path.service';
import { LearningPath } from '../models/learning-path.model';

describe('LearningPathService', () => {
  let service: LearningPathService;
  let httpMock: HttpTestingController;

  const mockPath: LearningPath = {
  name: 'Test Path',
  status: 'draft',
  nodes: [
    {
      id: 'node-start',
      componentId: 'start',
      type: 'start',
      label: 'Start',
      position: { x: 340, y: 60 }
    },
    {
      id: 'node-end',
      componentId: 'end',
      type: 'end',
      label: 'End',
      position: { x: 340, y: 700 }
    }
  ],
  edges: []
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LearningPathService]
    });
    service = TestBed.inject(LearningPathService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('save() should POST to /api/learning-paths', () => {
    service.save(mockPath).subscribe(res => {
      expect(res.name).toBe('Test Path');
      expect(res.id).toBe('abc-123');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/learning-paths');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Test Path');
    req.flush({ ...mockPath, id: 'abc-123' });
  });

  it('getById() should GET /api/learning-paths/:id', () => {
    service.getById('abc-123').subscribe(res => {
      expect(res.name).toBe('Test Path');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/learning-paths/abc-123');
    expect(req.request.method).toBe('GET');
    req.flush(mockPath);
  });

  it('getAll() should GET /api/learning-paths', () => {
    service.getAll().subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/learning-paths');
    expect(req.request.method).toBe('GET');
    req.flush([mockPath]);
  });

  it('delete() should DELETE /api/learning-paths/:id', () => {
    service.delete('abc-123').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/learning-paths/abc-123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});