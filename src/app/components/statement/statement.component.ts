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
import { InstituteService } from '../../services/institute.service';

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

  filteredInstitute: any[] = [];

  institute = {
    name: '',
    id: '',
  };

  isCreating: boolean = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private statementService: StatementService,
    private instituteService: InstituteService
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

  onInstituteInput(value: any) {
    const query = value.target.value;
    this.instituteService
      .getInstitutes(
        { pageNumber: this.currentPage, pageSize: this.pageSize },
        query
      )
      .subscribe({
        next: (response: EntityResponse) => {
          this.filteredInstitute = response.data;
        },
      });
  }

  onSelectedInstitute(institute: any) {
    this.institute.id = institute.id;
    this.institute.name = institute.name;
    this.filteredInstitute = [];
  }

  createStatement() {
    this.isCreating = !this.isCreating;
  }

  onSubmitCreate() {
    this.successMessage = null;
    this.errorMessage = null;

    this.statementService.createStatement(this.institute.id).subscribe({
      next: (response) => {
        this.successMessage = 'Statement was successfully created.';
        this.institute = {
          name: '',
          id: '',
        };

        this.loadStatements(this.currentPage);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create Statement. Please try again.';
        console.error(error);
      },
    });
  }

  redirectOnExcelViewer(statementId: string) {
    window.open(`/excel-viewer/${statementId}`, '_blank');
  }
}
