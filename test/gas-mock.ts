// Dummy implementations

namespace Spreadsheets {
  export class App {
    public static spreadsheets: {[id: string]: Spreadsheet} = {};

    public static openById(id: string) {
      this.spreadsheets[id] = this.spreadsheets[id] || new Spreadsheet();
      return this.spreadsheets[id];
    }

    public static clear() {
      this.spreadsheets = {};
    }
  }

  class Spreadsheet {
    public sheets: {[name: string]: Sheet} = {};

    public getSheetByName(name: string) {
      this.sheets[name] = this.sheets[name] || new Sheet();
      return this.sheets[name];
    }
  }

  export class Sheet {
    public cells: string[][];

    constructor() {
      this.cells = [];
    }
    public getRange(row: number, column: number, numRows = 1, numColumns = 1) {
      return new Range(this.cells, row, column, numRows, numColumns);
    }
    public getLastRow() {
      return this.cells.length;
    }
    public getSheetValues(startRow: number, startColumn: number, numRows: number, numColumns: number) {
      return this.getRange(startRow, startColumn, numRows, numColumns).getValues();
    }
    public insertRowsAfter(afterPosition: number, howMany: number) {
      const newRows = [];
      for (let i = 0; i < howMany; i++) {
        newRows.push([""]);
      }
      this.cells.splice(afterPosition, 0, ...newRows);
    }
    public clear() {
      this.cells.splice(0, this.cells.length - 1);
    }
  }

  class Range {
    constructor(
      private cells: string[][],
      private row: number,
      private column: number,
      private numRows: number,
      private numColumns: number,
    ) {}
    public getValue() {
      return this.getValueAt(this.row - 1, this.column - 1);
    }
    public getValues() {
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
    public setValue(value: string) {
      this.setValueAt(value, this.row - 1, this.column - 1);
    }
    public setValues(values: string[][]) {
      values.forEach((rowValue, rowIndex) => {
        const r = this.row + rowIndex - 1;
        rowValue.forEach((value, colIndex) => {
          const c = this.column + colIndex - 1;
          this.setValueAt(value, r, c);
        });
      });
    }

    private getValueAt(row: number, col: number) {
      const rowLine = this.cells[row] || [];
      return rowLine[col] || "";
    }
    private setValueAt(value: string, row: number, col: number) {
      while (this.cells.length <= row) {
        this.cells.push([""]);
      }
      while (this.cells[row].length <= col) {
        this.cells[row].push("");
      }
      this.cells[row][col] = value;
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
  export class Service {
    public static parse(_text: string) {
      return new Document();
    }

    public static getNamespace(_name: string) {
      return;
    }
  }

  class Document {
    public getRootElement() {
      return new Element();
    }
  }

  class Element {
    public getChildren(_name: string, _: any) {
      return [
        new Element(),
      ];
    }

    public getChild(name: string, _: any) {
      return new Element();
    }

    public getChildText(name: string, _: any) {
      return name;
    }

    public getAttribute(attrName: string) {
      return new Attribute();
    }
  }

  class Attribute {
    public getValue() {
      return "";
    }
  }
}
declare var XmlService: any;
XmlService = XML.Service;
