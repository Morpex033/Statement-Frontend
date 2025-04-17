import { EntityResponse } from "../../../interface/entity-response.interface";

export interface SubjectDetails{
    students: EntityResponse;

    teachers: EntityResponse;

    grades: EntityResponse;
}