import { Component } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
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
import { DepartmentDetails } from './interface/department-details.interface';

@Component({
  selector: 'app-department',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
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
export class DepartmentComponent {
  departments: any[] = [];
  departmentsDetails: Map<string, DepartmentDetails> = new Map();
  visibleDetails: { [id: string]: boolean } = {};
  
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; 
  hasMoreDepartments: boolean = true;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments(this.currentPage);
  }

  loadDepartments(pageNumber: number) {
    this.departmentService.getDepartments({ pageSize: this.pageSize, pageNumber }).subscribe({
      next: (response: EntityResponse) => {
        this.departments = [...response.data];
        this.totalCount = response.totalCount;
        this.hasMoreDepartments = response.data.length <= this.pageSize && response.data.length > 0;

        this.departments.forEach((department) => {
          this.departmentService.getDetails(department.id).subscribe({
            next: (details: DepartmentDetails) => {
              this.departmentsDetails.set(department.id, details);
            },
            error: (err) => {
              console.error(`Ошибка при загрузке деталей департамента с ID ${department.id}:`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Ошибка при загрузке департаментов:', err);
      }
    });
  }

  toggleDetails(departmentId: string) {
    this.visibleDetails[departmentId] = !this.visibleDetails[departmentId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDepartments(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreDepartments) {
      this.currentPage++;
      this.loadDepartments(this.currentPage);
    }
  }
}
