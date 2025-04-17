import { EntityResponse } from "../../../interface/entity-response.interface";

export interface DepartmentDetails {
  institute: any;
  groups: EntityResponse;
  teachers: EntityResponse;
  totalCount: number;
}
