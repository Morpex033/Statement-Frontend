import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityResponse } from '../interface/entity-response.interface';
import { InstituteDetails } from '../components/institute/interface/institute-details.interface';

@Injectable({
  providedIn: 'root',
})
export class InstituteService {
  private apiUrl = 'http://localhost:5151/Institute';

  constructor(private http: HttpClient) {}

  getInstitutes(
    params?: {
      pageSize: number;
      pageNumber: number;
    },
    name?: string
  ): Observable<EntityResponse> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize.toString())
        .set('pageNumber', params.pageNumber.toString());
    }
    if (name) {
      httpParams = httpParams.set('name', name);
    }
    return this.http.get<EntityResponse>(this.apiUrl, { params: httpParams });
  }

  getDetails(
    id: string,
    params?: {
      pageSize: number;
      pageNumber: number;
    }
  ): Observable<InstituteDetails> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize.toString())
        .set('pageNumber', params.pageNumber.toString());
    }
    return this.http.get<InstituteDetails>(`${this.apiUrl}/${id}/details`, {
      params: httpParams,
    });
  }
}
