import { Component } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SubjectDetails } from './interface/subject-details.interface';
import { EntityResponse } from '../../interface/entity-response.interface';

@Component({
  selector: 'app-subject',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss',
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
export class SubjectComponent {
  subjects: any[] = [];
  subjectDetails: Map<string, SubjectDetails> = new Map();
  visibleDetails: { [id: string]: boolean } = {};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreSubjects: boolean = true;

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects(this.currentPage);
  }

  loadSubjects(pageNumber: number) {
    this.subjectService
      .getSubjects({ pageSize: this.pageSize, pageNumber })
      .subscribe({
        next: (response: EntityResponse) => {
          this.subjects = response.data;
          this.totalCount = response.totalCount;
          this.hasMoreSubjects = response.data.length <= this.pageSize && response.data.length > 0;
        },
        complete: () =>{
          this.subjects.forEach((subject) =>{
            this.subjectService.getDetails(subject.id).subscribe((details: SubjectDetails) => {
              this.subjectDetails.set(subject.id, details);
            })
          })
        }
      });
  }

  toggleDetails(subjectId: string) {
    this.visibleDetails[subjectId] = !this.visibleDetails[subjectId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSubjects(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreSubjects) {
      this.currentPage++;
      this.loadSubjects(this.currentPage);
    }
  }
}
