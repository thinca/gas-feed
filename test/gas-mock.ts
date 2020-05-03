// Dummy implementations

namespace Spreadsheets {
  class Range {
    constructor(
      private cells: string[][],
      private row: number,
      private column: number,
      private numRows: number,
      private numColumns: number,
    ) {}
    public getValue(): string {
      return this.getValueAt(this.row - 1, this.column - 1);
    }
    public getValues(): string[][] {
      const values: string[][] = [];
      for (let rowIndex = 0; rowIndex < this.numRows; rowIndex++) {
        const r = this.row + rowIndex - 1;
        const row: string[] = [];
        values.push(row);
        for (let colIndex = 0; colIndex < this.numColumns; colIndex++) {
          const c = this.column + colIndex - 1;
          row.push(this.getValueAt(r, c));
        }
      }
      return values;
    }
    public setValue(value: string): void {
      this.setValueAt(value, this.row - 1, this.column - 1);
    }
    public setValues(values: string[][]): void {
      values.forEach((rowValue, rowIndex) => {
        const r = this.row + rowIndex - 1;
        rowValue.forEach((value, colIndex) => {
          const c = this.column + colIndex - 1;
          this.setValueAt(value, r, c);
        });
      });
    }

    private getValueAt(row: number, col: number): string {
      const rowLine = this.cells[row] || [];
      return rowLine[col] || "";
    }
    private setValueAt(value: string, row: number, col: number): void {
      while (this.cells.length <= row) {
        this.cells.push([""]);
      }
      while (this.cells[row].length <= col) {
        this.cells[row].push("");
      }
      this.cells[row][col] = value;
    }
  }

  export class Sheet {
    public cells: string[][];

    constructor() {
      this.cells = [];
    }
    public getRange(row: number, column: number, numRows = 1, numColumns = 1): Range {
      return new Range(this.cells, row, column, numRows, numColumns);
    }
    public getLastRow(): number {
      return this.cells.length;
    }
    public getSheetValues(startRow: number, startColumn: number, numRows: number, numColumns: number): string[][] {
      return this.getRange(startRow, startColumn, numRows, numColumns).getValues();
    }
    public insertRowsAfter(afterPosition: number, howMany: number): void {
      const newRows = [];
      for (let i = 0; i < howMany; i++) {
        newRows.push([""]);
      }
      this.cells.splice(afterPosition, 0, ...newRows);
    }
    public clear(): void {
      this.cells.splice(0, this.cells.length - 1);
    }
  }

  class Spreadsheet {
    public sheets: {[name: string]: Sheet} = {};

    constructor(
      private id: string,
      private name: string,
    ) {
    }

    public getId(): string {
      return this.id;
    }

    public getName(): string {
      return this.name;
    }

    public getSheetByName(name: string): Sheet {
      return this.sheets[name];
    }
    public insertSheet(name: string): Sheet {
      return this.sheets[name] = new Sheet();
    }
  }

  export class App {
    public static spreadsheets: {[id: string]: Spreadsheet} = {};

    public static create(name: string): Spreadsheet {
      const id = name;
      this.spreadsheets[id] = new Spreadsheet(id, name);
      return this.spreadsheets[id];
    }

    public static openById(id: string): Spreadsheet {
      return this.spreadsheets[id];
    }

    public static clear(): void {
      this.spreadsheets = {};
    }
  }
}
declare var SpreadsheetApp: any;
SpreadsheetApp = Spreadsheets.App;

namespace URLFetch {
  export class App {
    public static fetch(_url: string) {
      return {
        getContentText() {
          return "";
        },
      };
    }
  }
}
declare var UrlFetchApp: any;
UrlFetchApp = URLFetch.App;

namespace XML {
  class Attribute {
    public getValue(): string {
      return "";
    }
  }

  class Element {
    public getChildren(_name: string, _: any) {
      return [
        new Element(),
      ];
    }

    public getChild(_name: string, _: any) {
      return new Element();
    }

    public getChildText(name: string, _: any) {
      return name;
    }

    public getAttribute(_attrName: string) {
      return new Attribute();
    }
  }

  class Document {
    public getRootElement() {
      return new Element();
    }
  }

  export class Service {
    public static parse(_text: string): Document {
      return new Document();
    }

    public static getNamespace(_name: string) {
      return;
    }
  }
}
declare var XmlService: any;
XmlService = XML.Service;
