import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningPath } from '../models/learning-path.model';

@Injectable({ providedIn: 'root' })
export class LearningPathService {
  private apiUrl = 'http://localhost:8080/api/learning-paths';

  constructor(private http: HttpClient) {}

  save(path: LearningPath): Observable<LearningPath> {
    return this.http.post<LearningPath>(this.apiUrl, path);
  }

  getById(id: string): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<LearningPath[]> {
    return this.http.get<LearningPath[]>(this.apiUrl);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}