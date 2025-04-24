import { Grade } from '../../grade/interface/grade.interface';

export interface Student {
  firstName: string;
  lastName: string;
  grades: Grade[];
}
