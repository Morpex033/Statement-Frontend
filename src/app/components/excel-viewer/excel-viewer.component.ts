import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatementService } from '../../services/statement.service';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../student/interface/student.interface';
import { Group } from '../group/interface/group.interface';
import { Grade } from '../grade/interface/grade.interface';

@Component({
  selector: 'app-excel-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './excel-viewer.component.html',
  styleUrl: './excel-viewer.component.scss',
})
export class ExcelViewerComponent {
  groups: Group[] = [];

  selectedGroup: Group | null = null;

  isUpdating: boolean = false;

  incorrectGrade: Map<Grade, boolean> = new Map();

  constructor(
    private route: ActivatedRoute,
    private readonly statementService: StatementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.readExcelFile(id);
  }

  readExcelFile(id: any) {
    this.statementService.getExcel(id).subscribe((response: Blob) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

        const sheetNames: string[] = workbook.SheetNames;
        sheetNames.forEach((sheetName) => {
          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });

          const group: Group = this.parseExcelData(jsonData);
          this.groups.push(group);
        });
      };

      reader.readAsArrayBuffer(response);
    });
  }

  parseExcelData(jsonData: any[]): Group {
    const groupName: string = jsonData[0][0];
    const students: Student[] = [];
    let currentStudent: Student | null = null;

    jsonData.slice(1).forEach((row) => {
      if (row[0] && row[1]) {
        if (!currentStudent) {
          currentStudent = { firstName: '', lastName: '', grades: [] };
        }

        if (row[0] !== 'Предмет' && row[1] !== 'Оценка') {
          currentStudent.grades.push({
            subject: row[0],
            value: row[1],
            comment: row[2],
          });
        }
      } else if (row[0] && !row[1]) {
        if (currentStudent) {
          const studentName = row[0].replace('Студент:', '').trim();
          const [lastName, firstName] = studentName.split(' ');

          currentStudent.firstName = firstName;
          currentStudent.lastName = lastName;
          students.push(currentStudent);
        }
        currentStudent = null;
      }
    });

    if (currentStudent) {
      students.push(currentStudent);
    }

    return { name: groupName, students: students };
  }

  selectGroup(group: Group): void {
    this.selectedGroup = group;
  }

  updateExcel() {
    this.isUpdating = !this.isUpdating;
  }

  cancelUpdate() {
    this.isUpdating = !this.isUpdating;
    this.groups = [];
    this.selectedGroup = null;
    this.ngOnInit();
  }

  saveUpdate() {
    const updatedGrade: any[] = [];
    const id: string = this.route.snapshot.paramMap.get('id')!;

    this.groups.forEach((group) => {
      group.students.forEach((student) => {
        student.grades.forEach((grade) => {
          const gradeJson = JSON.parse(grade.comment);
          updatedGrade.push(gradeJson);
        });
      });
    });

    this.statementService
      .getStatementById(id)
      .subscribe((statement: { id: string; index: string }) => {
        const mappedGrades = updatedGrade.map(g => ({
          id: g.Id,
          value: g.Value,
          studentId: g.StudentId,
          subjectId: g.SubjectId,
          teacherId: g.TeacherId
        }));

        console.log({
          index: statement.index,
          grades: mappedGrades,
        });

        this.statementService
          .updateStatement(statement.id, {
            index: statement.index,
            grades: mappedGrades,
          })
          .subscribe(() => {
            this.isUpdating = !this.isUpdating;
            this.groups = [];
            this.selectedGroup = null;
            this.ngOnInit();
          });
      });
  }

  validateValue(event: Event, grade: Grade) {
    const input = event.target as HTMLInputElement;
    const value: number = Number(input.value);
    if (value >= 0 && value <= 100) {
      try {
        const gradeJson = JSON.parse(grade.comment);

        gradeJson.Value = value;

        grade.comment = JSON.stringify(gradeJson, null, 2);

        if (this.incorrectGrade.has(grade)) {
          this.incorrectGrade.delete(grade);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      this.incorrectGrade.set(grade, true);
    }
  }
}
