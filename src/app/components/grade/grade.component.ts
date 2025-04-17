import { Component, OnInit } from '@angular/core';
import { GradeService } from '../../services/grade.service'; // Замените на ваш сервис
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { StudentService } from '../../services/student.service';
import { TeacherService } from '../../services/teacher.service';
import { SubjectService } from '../../services/subject.service';
import { EntityResponse } from '../../interface/entity-response.interface';
import { GradeDetails } from './interface/grade-details.interface';
import { forkJoin, from, interval, mergeMap, range, toArray } from 'rxjs';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss',
  imports: [
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    MatFormFieldModule,
  ],
  animations: [
    trigger('detailsAnimation', [
      state(
        'visible',
        style({ opacity: 1, transform: 'translateY(0)', height: '*' })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-10px)',
          height: '0px',
          overflow: 'hidden',
        })
      ),
      transition('visible <=> hidden', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GradeComponent implements OnInit {
  grades: any[] = [];
  gradesDetails: Map<string, GradeDetails> = new Map();

  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreGrades: boolean = true;
  isCreating: boolean = false;

  newGrade = this.createEmptyGrade();

  updateGrade = this.createEmptyGrade();

  filteredStudents: any[] = [];
  filteredSubjects: any[] = [];
  filteredTeachers: any[] = [];

  isUpdatingMap: { [key: string]: boolean } = {};

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private gradeService: GradeService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.loadGrades(this.pageNumber);
  }

  loadGrades(pageNumber: number) {
    this.gradesDetails.clear();
    this.gradeService
      .getGrades({ pageSize: this.pageSize, pageNumber })
      .subscribe({
        next: (response: EntityResponse) => {
          this.grades = response.data;
          this.hasMoreGrades =
            response.data.length <= this.pageSize && response.data.length > 0;
        },
        complete: () => {
          this.grades.forEach((grade) => {
            this.gradeService
              .getDetails(grade.id)
              .subscribe((details: GradeDetails) => {
                this.gradesDetails.set(grade.id, details);
              });
          });
        },
      });
  }

  loadNextPage() {
    this.pageNumber += 1;
    this.loadGrades(this.pageNumber);
  }

  loadPreviousPage() {
    this.pageNumber -= 1;
    this.loadGrades(this.pageNumber);
  }

  createGrade() {
    this.isCreating = !this.isCreating;
  }

  onStudentInput(value: any) {
    const query = value.target.value;
    this.studentService
      .getStudents(
        { pageSize: this.pageSize, pageNumber: this.pageNumber },
        query
      )
      .subscribe({
        next: (response: EntityResponse) => {
          this.filteredStudents = response.data;
        },
      });
  }

  onSubjectInput(value: any) {
    const query = value.target.value;
    this.subjectService
      .getSubjects(
        { pageSize: this.pageSize, pageNumber: this.pageNumber },
        query
      )
      .subscribe({
        next: (response: EntityResponse) => {
          this.filteredSubjects = response.data;
        },
      });
  }

  onTeacherInput(value: any) {
    const query = value.target.value;
    this.teacherService
      .getTeachers(
        { pageSize: this.pageSize, pageNumber: this.pageNumber },
        query
      )
      .subscribe({
        next: (response: EntityResponse) => {
          this.filteredTeachers = response.data;
        },
      });
  }

  onCreateFormStudentSelect(student: any) {
    this.newGrade.studentId = student.id;
    this.newGrade.studentName = student.firstName + ' ' + student.lastName;
    this.filteredStudents = [];
  }

  onCreateFormSubjectSelect(subject: any) {
    this.newGrade.subjectId = subject.id;
    this.newGrade.subjectName = subject.name;
    this.filteredSubjects = [];
  }

  onCreateFormTeacherSelect(teacher: any) {
    this.newGrade.teacherId = teacher.id;
    this.newGrade.teacherName = teacher.firstName + ' ' + teacher.lastName;
    this.filteredTeachers = [];
  }

  onUpdateFormStudentSelect(student: any) {
    this.updateGrade.studentId = student.id;
    this.updateGrade.studentName = student.firstName + ' ' + student.lastName;
    this.filteredStudents = [];
  }

  onUpdateFormSubjectSelect(subject: any) {
    this.updateGrade.subjectId = subject.id;
    this.updateGrade.subjectName = subject.name;
    this.filteredSubjects = [];
  }

  onUpdateFormTeacherSelect(teacher: any) {
    this.updateGrade.teacherId = teacher.id;
    this.updateGrade.teacherName = teacher.firstName + ' ' + teacher.lastName;
    this.filteredTeachers = [];
  }

  onSubmit() {
    this.successMessage = null;
    this.errorMessage = null;

    this.gradeService.createGrade(this.newGrade).subscribe({
      next: (response) => {
        this.successMessage = 'Grade was successfully created.';
        this.newGrade = this.createEmptyGrade();
      },
      error: (error) => {
        this.errorMessage = 'Failed to create grade. Please try again.';
        console.error(error);
      },
    });
  }

  createEmptyGrade() {
    return {
      id: '',
      value: 0,
      studentId: '',
      studentName: '',
      subjectId: '',
      subjectName: '',
      teacherId: '',
      teacherName: '',
    };
  }

  onUpdate(grade: any) {
    this.updateGrade = {
      id: grade.id,
      value: grade.value,
      studentId: this.gradesDetails.get(grade.id)?.student.id,
      studentName:
        this.gradesDetails.get(grade.id)?.student.firstName +
        ' ' +
        this.gradesDetails.get(grade.id)?.student.lastName,
      subjectId: this.gradesDetails.get(grade.id)?.subject.id,
      subjectName: this.gradesDetails.get(grade.id)?.subject.name,
      teacherId: this.gradesDetails.get(grade.id)?.teacher.id,
      teacherName:
        this.gradesDetails.get(grade.id)?.teacher.firstName +
        ' ' +
        this.gradesDetails.get(grade.id)?.teacher.lastName,
    };

    this.isUpdatingMap[grade.id] = !this.isUpdatingMap[grade.id];
  }

  saveUpdate() {
    this.gradeService.updateGrade(this.updateGrade).subscribe((grade) => {
      this.loadGrades(this.pageNumber);

      this.updateGrade = this.createEmptyGrade();
      this.isUpdatingMap[grade.id] = !this.isUpdatingMap[grade.id];
    });
  }

  onDelete(grade: any) {
    this.gradeService.deleteGrade(grade.id).subscribe(() => {
      this.loadGrades(this.pageNumber);
    });
  }
}
