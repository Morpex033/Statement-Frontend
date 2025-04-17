import { Component } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { GradeDetails } from '../grade/interface/grade-details.interface';
import { EntityResponse } from '../../interface/entity-response.interface';
import { GroupDetails } from './interface/group-details.interface';

@Component({
  selector: 'app-group',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
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
export class GroupComponent {
  groups: any[] = [];
  groupsDetails: Map<string, GroupDetails> = new Map();
  visibleDetails: { [id: string]: boolean } = {};

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; 
  hasMoreGroups: boolean = true;

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    this.loadGroups(this.currentPage);
  }

  loadGroups(pageNumber: number) {
    this.groupService.getGroups({ pageSize: this.pageSize, pageNumber }).subscribe({
      next: (response: EntityResponse) => {
        this.groups = response.data;
        this.totalCount = response.totalCount;
        this.hasMoreGroups = response.data.length <= this.pageSize && response.data.length > 0;
      },
      complete: () => {
        this.groups.forEach((group) => {
          this.groupService.getDetails(group.id).subscribe((details: GroupDetails) => {
            this.groupsDetails.set(group.id, details);
          });
        });
      },
    });
  }

  toggleDetails(groupId: string) {
    this.visibleDetails[groupId] = !this.visibleDetails[groupId];
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGroups(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.hasMoreGroups) {
      this.currentPage++;
      this.loadGroups(this.currentPage);
    }
  }
}
