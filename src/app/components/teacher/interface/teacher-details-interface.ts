import { EntityResponse } from "../../../interface/entity-response.interface";

export interface TeacherDetails{
    subjects: EntityResponse;

    departments: EntityResponse;

    grades: EntityResponse;
}