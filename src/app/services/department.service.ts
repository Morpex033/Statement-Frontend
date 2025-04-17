import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentDetails } from '../components/department/interface/department-details.interface';
import { EntityResponse } from '../interface/entity-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5151/Department';

  constructor(private http: HttpClient) {}

  getDepartments(params?: {
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

  getDetails(
    id: string,
    params?: {
      pageSize: number;
      pageNumber: number;
    }
  ): Observable<DepartmentDetails> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize.toString())
        .set('pageNumber', params.pageNumber.toString());
    }
    return this.http.get<DepartmentDetails>(`${this.apiUrl}/${id}/details`, {
      params: httpParams,
    });
  }
}
