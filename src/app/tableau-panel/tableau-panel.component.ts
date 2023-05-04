import { Component, OnInit } from '@angular/core';
import * as JSZip from 'jszip';
import * as XLSX from 'xlsx';
declare const tableau: any;

@Component({
  selector: 'app-tableau-panel',
  templateUrl: './tableau-panel.component.html',
  styleUrls: ['./tableau-panel.component.css']
})
export class TableauPanelComponent implements OnInit {
  tableauViz: any;
  dashboardname: any;
  sheets: any[] = [];
  sheetNames: any[] = [];
  exportData: any[] = [];
  doneSheets: any;

  ngOnInit(): void {
    const containerDiv = document.getElementById('tableauViz');
    const vizUrl = 'https://public.tableau.com/views/AcidentesdeTrnsitoemRodoviasFederais1/Principal';
    const options = {
      hideTabs: true,
      width: '827px',
      height: '1500px',
      hideToolbar: true,
      onFirstInteractive() {
        // The viz is now ready and can be safely used.
      }
    };

    this.tableauViz = new tableau.Viz(containerDiv, vizUrl, options);
  }

  exportTo(extension: string) {

    this.dashboardname = '';
    this.sheetNames = [];
    this.exportData = [];
    this.doneSheets = 0;

    const workbook = this.tableauViz.getWorkbook();
    let abstract = workbook.getActiveSheet();
    const type = abstract.getSheetType();

    if (type === tableau.SheetType.STORY) {
      abstract = abstract.getActiveStoryPoint().getContainedSheet();
    }

    this.sheets = abstract.getWorksheets();
    this.dashboardname = abstract.getName();

    const options = {
      maxRows: 0,
      ignoreSelection: true,
      ignoreAliases: true
    };

    this.sheets.forEach((sheet, index) => {
      let sheetName = sheet.getName().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      sheetName = sheetName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '').slice(0, 27);
      sheetName = index.toString() + '_' + sheetName;
      this.sheetNames.push({sheetid: sheetName, header: true});
      sheet.getSummaryDataAsync(options).then((t: { getColumns: () => any; getData: () => any; }) => {
        const niceData =  this.buildData(t);
        this.exportData.push(niceData);
        this.doneSheets++;
        (extension === 'xlsx' ? this.writeToExcel() : this.writeToZIP());
      });
    });
  }

  buildData(table: { getColumns: () => any; getData: () => any; }) {
    const columns = table.getColumns();
    const data = table.getData();

    let dados: any[][] = [];
    let tupla: any[] = [];

    columns.forEach((colunas: { getFieldName: () => any; }, index: number) => {
      dados[index] = colunas.getFieldName();
    });

    dados = [dados];
    data.forEach((linhas: any[]) => {
      tupla = [];
      linhas.forEach((elemento: { formattedValue: any; }) => {
        tupla.push(elemento.formattedValue);
      });
      dados.push(tupla);
    });

    return dados;
  }

  writeToExcel() {
    if (this.doneSheets === this.sheets.length) {
      const wb = XLSX.utils.book_new();
      this.exportData.forEach((data, index) => {
        const sheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, sheet, this.sheetNames[index].sheetid);
      });
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const blob = new Blob([excelBuffer], { type: fileType });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.dashboardname + '.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  writeToZIP() {
    if (this.doneSheets === this.sheets.length) {
      const zip = new JSZip();
      this.exportData.forEach((data, index) => {
        const csv = data.map((e: any[]) => e.join(',')).join('\n');
        zip.file(this.sheetNames[index].sheetid + '.csv', csv);
      });
      zip.generateAsync({
        type: 'base64'
      }).then((content) => {
        const link = document.createElement('a');
        link.href = 'data:application/zip;base64,' + content;
        link.download = this.dashboardname + '.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  //////////////////// EXPORTS //////////////////////

  exportPDF(): void {
    this.tableauViz.showExportPDFDialog();
  }

  exportBruteData(): void {
    this.tableauViz.showExportDataDialog();
  }

  exportImage(): void {
    this.tableauViz.showExportImageDialog();
  }

  exportCrossTab(): void {
    this.exportTo('csv');
  }

  exportPowerPoint(): void {
    this.tableauViz.showExportPowerPointDialog();
  }

  exportToExcel(): void {
    this.exportTo('xlsx');
  }

  exportWorkbook(): void {
    this.tableauViz.showDownloadWorkbookDialog();
  }

}

