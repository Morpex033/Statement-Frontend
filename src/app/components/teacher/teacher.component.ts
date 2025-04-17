import { Component } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TeacherDetails } from './interface/teacher-details-interface';
import { EntityResponse } from '../../interface/entity-response.interface';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
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
export class TeacherComponent {
  teachers: any[] = [];
  teachersDetails: Map<string, TeacherDetails> = new Map();
  visibleDetails: { [id: string]: boolean } = {};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreTeachers: boolean = true;

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.loadTeachers(this.currentPage);
  }

  loadTeachers(pageNumber: number) {
    this.teacherService.getTeachers({pageSize: this.pageSize, pageNumber}).subscribe({
      next: (response: EntityResponse) => {
        this.teachers = response.data;
        this.totalCount = response.totalCount;
        this.hasMoreTeachers = response.data.length <= this.pageSize && response.data.length > 0;
      },
      complete:() =>{
        this.teachers.forEach(teacher => {
          this.teacherService.getDetails(teacher.id).subscribe({
            next: (details: TeacherDetails) =>{
              this.teachersDetails.set(teacher.id, details);
            }
          })
        })
      }
    })
  }

  toggleDetails(teacherId: string) {
    this.visibleDetails[teacherId] = !this.visibleDetails[teacherId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTeachers(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreTeachers) {
      this.currentPage++;
      this.loadTeachers(this.currentPage);
    }
  }
}