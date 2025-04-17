import { EntityResponse } from '../../../interface/entity-response.interface';

export interface StudentDetails {
  group: any;

  subjects: EntityResponse;

  totalCount: number;

  pageNumber: number;

  pageSize: number;
}
