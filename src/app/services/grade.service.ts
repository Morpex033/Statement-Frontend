import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityResponse } from '../interface/entity-response.interface';
import { GradeDetails } from '../components/grade/interface/grade-details.interface';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = 'http://localhost:5151/Grade';

  constructor(private http: HttpClient) {}

  getGrades(params?: {
    pageSize: number;
    pageNumber: number;
  }): Observable<EntityResponse> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize.toString())
        .set('pageNumber', params.pageNumber.toString());
    }
    return this.http.get<EntityResponse>(this.apiUrl, { params: httpParams });
  }

  getDetails(id: string): Observable<GradeDetails> {
    return this.http.get<GradeDetails>(`${this.apiUrl}/${id}/details`);
  }

  createGrade(grade: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grade);
  }

  updateGrade(grade: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${grade.id}`, grade);
  }

  deleteGrade(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
