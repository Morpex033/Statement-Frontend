import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { InstituteDetails } from './interface/institute-details.interface';
import { InstituteService } from '../../services/institute.service';
import { EntityResponse } from '../../interface/entity-response.interface';

@Component({
  selector: 'app-institute',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './institute.component.html',
  styleUrl: './institute.component.scss',
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
export class InstituteComponent {
  institutes: any[] = [];
  institutesDetails: Map<string, InstituteDetails> = new Map();

  visibleDetails: { [id: string]: boolean } = {};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreInstitutes: boolean = true;

  constructor(private readonly instituteService: InstituteService) {}

  ngOnInit() {
    this.loadInstitutes(this.currentPage);
  }

  loadInstitutes(pageNumber: number) {
    this.instituteService
      .getInstitutes({
        pageSize: this.pageSize,
        pageNumber,
      })
      .subscribe({
        next: (response: EntityResponse) => {
          this.institutes = response.data;
          this.totalCount = response.totalCount;
          this.hasMoreInstitutes =
            response.data.length <= this.pageSize && response.data.length > 0;
        },
        complete: () => {
          this.institutes.forEach((institute) => {
            this.instituteService.getDetails(institute.id).subscribe({
              next: (details: InstituteDetails) => {
                this.institutesDetails.set(institute.id, details);
              },
            });
          });
        },
      });
  }

  toggleDetails(instituteId: string) {
    this.visibleDetails[instituteId] = !this.visibleDetails[instituteId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadInstitutes(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreInstitutes) {
      this.currentPage++;
      this.loadInstitutes(this.currentPage);
    }
  }
}
