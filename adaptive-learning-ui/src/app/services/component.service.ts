import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableContentResponse } from '../models/component.model';

@Injectable({ providedIn: 'root' })
export class ComponentService {
  private apiUrl = 'http://localhost:8080/api/components';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AvailableContentResponse> {
    return this.http.get<AvailableContentResponse>(this.apiUrl);
  }
}