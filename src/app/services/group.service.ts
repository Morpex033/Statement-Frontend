import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityResponse } from '../interface/entity-response.interface';
import { GradeDetails } from '../components/grade/interface/grade-details.interface';
import { GroupDetails } from '../components/group/interface/group-details.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:5151/Group';

  constructor(private http: HttpClient) {}

  getGroups(params?: {
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
  ): Observable<GroupDetails> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize.toString())
        .set('pageNumber', params.pageNumber.toString());
    }
    return this.http.get<GroupDetails>(`${this.apiUrl}/${id}/details`, {
      params: httpParams,
    });
  }
}
