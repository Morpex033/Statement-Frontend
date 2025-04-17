import { Routes } from '@angular/router';
import { StudentComponent } from './components/student/student.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { SubjectComponent } from './components/subject/subject.component';
import { DepartmentComponent } from './components/department/department.component';
import { GroupComponent } from './components/group/group.component';
import { GradeComponent } from './components/grade/grade.component';
import { InstituteComponent } from './components/institute/institute.component';
import { StatementComponent } from './components/statement/statement.component';
import { ExcelViewerComponent } from './components/excel-viewer/excel-viewer.component';

export const routes: Routes = [
  { path: 'students', component: StudentComponent },
  { path: 'teachers', component: TeacherComponent },
  { path: 'subjects', component: SubjectComponent },
  { path: 'departments', component: DepartmentComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'grades', component: GradeComponent },
  { path: 'institutes', component: InstituteComponent },
  { path: 'statements', component: StatementComponent },
  { path: 'excel-viewer/:id', component: ExcelViewerComponent },
];
