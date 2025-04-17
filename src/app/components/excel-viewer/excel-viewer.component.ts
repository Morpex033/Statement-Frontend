import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatementService } from '../../services/statement.service';
import * as XLSX from 'xlsx';
import { HotTableModule } from '@handsontable/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-excel-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './excel-viewer.component.html',
  styleUrl: './excel-viewer.component.scss',
})
export class ExcelViewerComponent {
  tableData: any[] = []; // Массив для данных текущего листа
  allSheets: string[] = []; // Массив всех листов
  currentSheetIndex: number = 0; // Индекс текущего листа
  sheetData: any = {}; // Объект для хранения данных по листам

  isUpdating: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private readonly statementService: StatementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.readExcelFile(id);
  }

  readExcelFile(id: any) {
    this.statementService.getExcel(id).subscribe((blob) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Получаем все имена листов
        this.allSheets = workbook.SheetNames;

        // Загружаем данные с каждого листа
        this.allSheets.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          this.sheetData[sheetName] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
        });

        // Устанавливаем данные для первого листа
        this.tableData = this.sheetData[this.allSheets[0]];
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  switchSheet(sheetName: string) {
    this.tableData = this.sheetData[sheetName];
  }

  onCellChange(rowIndex: number, colIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tableData[rowIndex][colIndex] = input.value;
  }

  updateExcel() {
    this.isUpdating = !this.isUpdating;
  }

  cancelUpdate() {
    this.isUpdating = !this.isUpdating;
    this.ngOnInit();
  }

  saveUpdate() {
    this.isUpdating = !this.isUpdating;
    this.ngOnInit();
  }
}
