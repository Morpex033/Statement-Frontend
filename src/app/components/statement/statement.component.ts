import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StatementDetails } from './interface/statement-details.interface';
import { StatementService } from '../../services/statement.service';
import { EntityResponse } from '../../interface/entity-response.interface';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../services/teacher.service';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss',
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
export class StatementComponent {
  statements: any[] = [];
  statementsDetails: Map<string, StatementDetails> = new Map();
  gradeDetails: Map<string, any> = new Map();

  visibleDetails: { [id: string]: boolean } = {};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreStatements: boolean = true;

  constructor(
    private statementService: StatementService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.loadStatements(this.currentPage);
  }

  loadStatements(pageNumber: number) {
    this.statementService
      .getStatements({ pageSize: this.pageSize, pageNumber })
      .subscribe({
        next: (response: EntityResponse) => {
          this.statements = response.data;
          this.totalCount = response.totalCount;
          this.hasMoreStatements =
            response.data.length <= this.pageSize && response.data.length > 0;
        },
      });
  }

  toggleDetails(statementId: string) {
    if (this.visibleDetails) {
      this.statements
        .filter((s) => s.id == statementId)
        .forEach((statement) => {
          this.statementService.getDetails(statement.id).subscribe({
            next: (details: StatementDetails) => {
              this.statementsDetails.set(statement.id, details);
            },
          });
        });
    }
    this.visibleDetails[statementId] = !this.visibleDetails[statementId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStatements(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreStatements) {
      this.currentPage++;
      this.loadStatements(this.currentPage);
    }
  }

  getFullInfo(
    teacherId: string,
    studentId: string,
    subjectId: string
  ): Observable<string> {
    return combineLatest([
      this.teacherService
        .getById(teacherId)
        .pipe(
          map((teacher: any) => `${teacher.firstName} ${teacher.lastName}`)
        ),
      this.studentService
        .getById(studentId)
        .pipe(
          map((student: any) => `${student.firstName} ${student.lastName}`)
        ),
      this.subjectService
        .getById(subjectId)
        .pipe(map((subject: any) => subject.name)),
    ]).pipe(
      map(
        ([teacherName, studentName, subjectName]) =>
          `${teacherName} | ${studentName} | ${subjectName}`
      )
    );
  }
}
