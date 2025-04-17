import { EntityResponse } from '../../../interface/entity-response.interface';

export interface GroupDetails {
  department: any;

  students: EntityResponse;

  totalCount: number;

  pageNumber: number;

  pageSize: number;
}
