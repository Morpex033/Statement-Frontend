import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityResponse } from '../interface/entity-response.interface';
import { TeacherDetails } from '../components/teacher/interface/teacher-details-interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://localhost:5151/Teacher';

  constructor(private http: HttpClient) {}

  getTeachers(
    params?: { pageSize: number; pageNumber: number },
    name?: string
  ): Observable<EntityResponse> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize)
        .set('pageNumber', params.pageNumber);
    }
    if (name) {
      httpParams = httpParams.set('name', name);
    }
    return this.http.get<EntityResponse>(this.apiUrl, { params: httpParams });
  }

  getDetails(
    id: string,
    params?: { pageSize: number; pageNumber: number }
  ): Observable<TeacherDetails> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize)
        .set('pageNumber', params.pageNumber);
    }
    return this.http.get<TeacherDetails>(`${this.apiUrl}/${id}/details`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
