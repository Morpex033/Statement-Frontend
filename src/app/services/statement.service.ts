import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityResponse } from '../interface/entity-response.interface';
import { StatementDetails } from '../components/statement/interface/statement-details.interface';

@Injectable({
  providedIn: 'root',
})
export class StatementService {
  private apiUrl = 'http://localhost:5151/Statement';

  constructor(private http: HttpClient) {}

  getStatements(params?: {
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
  ): Observable<StatementDetails> {
    let httpParams = new HttpParams();
    if (params) {
      httpParams = httpParams
        .set('pageSize', params.pageSize.toString())
        .set('pageNumber', params.pageNumber.toString());
    }
    return this.http.get<StatementDetails>(`${this.apiUrl}/${id}/details`, {
      params: httpParams,
    });
  }

  createStatement(instituteId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/institute/${instituteId}`, null);
  }

  getExcel(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/${id}/excel`, {
      responseType: 'blob' as 'json',
    });
  }

  getStatementById(statementId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/${statementId}`);
  }

  updateStatement(statementId: string, body: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/${statementId}`, body);
  }

  deleteStatement(statementId: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${statementId}`);
  }
}
