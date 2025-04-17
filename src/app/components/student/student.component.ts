import { Component } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { EntityResponse } from '../../interface/entity-response.interface';
import { StudentDetails } from './interface/student-details.interface';

@Component({
  selector: 'app-student',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
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
export class StudentComponent {
  students: any[] = [];
  studentsDetails: Map<string, StudentDetails> = new Map();
  visibleDetails: { [id: string]: boolean } = {};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreStudents: boolean = true;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents(this.currentPage);
  }

  loadStudents(pageNumber: number) {
    this.studentService
      .getStudents({ pageSize: this.pageSize, pageNumber })
      .subscribe({
        next: (response: EntityResponse) => {
          this.students = response.data;
          this.totalCount = response.totalCount;
          this.hasMoreStudents =
            response.data.length <= this.pageSize && response.data.length > 0;
        },
        complete: () => {
          this.students.forEach((student) => {
            this.studentService
              .getDetails(student.id)
              .subscribe((details: StudentDetails) => {
                this.studentsDetails.set(student.id, details);
              });
          });
        },
      });
  }

  toggleDetails(studentId: string) {
    this.visibleDetails[studentId] = !this.visibleDetails[studentId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudents(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreStudents) {
      this.currentPage++;
      this.loadStudents(this.currentPage);
    }
  }
}
