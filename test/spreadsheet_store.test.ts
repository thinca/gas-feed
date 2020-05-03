import {expect} from "chai";

import {SpreadsheetStore} from "../src/spreadsheet_store";
import "./gas-mock";

describe("SpreadsheetStore", () => {
  const SHEET_ID = "sheet_id";
  const SHEET_NAME = "sheet_name";
  let store: SpreadsheetStore;
  let sheet: Spreadsheets.Sheet;

  beforeEach(() => {
    SpreadsheetApp.clear();
    const spreadsheet = SpreadsheetApp.create(SHEET_ID);
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    store = new SpreadsheetStore(spreadsheet.getId(), SHEET_NAME);
  });

  describe("constructor", () => {
    context("when the sheet is already initialized", () => {
      it("does not initialize the sheet", () => {
        const feeds = [
          {id: "1", title: "title1"},
        ];
        store.saveFeeds(feeds);
        store = new SpreadsheetStore(SHEET_ID, SHEET_NAME);
        expect(store.loadFeeds(feeds.length)).to.deep.eq([
          {id: "1", title: "title1", url: "", date: "", body: ""},
        ]);
      });
    });

    context("when the sheet is not found", () => {
      it("throws an error", () => {
        expect(() => new SpreadsheetStore(SHEET_ID, "not_exist_sheet")).to.throw();
      });
    });
  });

  describe("#loadETag()", () => {
    context("when ETag is not stored", () => {
      it("returns empty string", () => {
        expect(store.loadETag()).to.eq("");
      });
    });
    context("when ETag is stored", () => {
      beforeEach(() => {
        sheet.getRange(1, SpreadsheetStore.ETAG_POSITION, 1, 1).setValue("etag value");
      });
      it("loads stored ETag", () => {
        expect(store.loadETag()).to.eq("etag value");
      });
    });
  });

  describe("#saveETag()", () => {
    it("saves ETag to store", () => {
      store.saveETag("etag value");
      expect(sheet.getRange(1, SpreadsheetStore.ETAG_POSITION, 1, 1).getValue()).to.eq("etag value");
    });
  });

  describe("#loadFeeds()", () => {
    const values = [
      ["1", "title1"],
      ["2", "title2"],
      ["3", "title3"],
    ];
    beforeEach(() => {
      sheet.getRange(2, 1, 3, 2).setValues(values);
    });
    it("loads feeds from store", () => {
      expect(store.loadFeeds(values.length)).to.deep.eq([
        {id: "1", title: "title1", url: "", date: "", body: ""},
        {id: "2", title: "title2", url: "", date: "", body: ""},
        {id: "3", title: "title3", url: "", date: "", body: ""},
      ]);
    });

    context("when loads too many feeds", () => {
      it("loads feeds from store only exists", () => {
        expect(store.loadFeeds(values.length + 10)).to.deep.eq([
          {id: "1", title: "title1", url: "", date: "", body: ""},
          {id: "2", title: "title2", url: "", date: "", body: ""},
          {id: "3", title: "title3", url: "", date: "", body: ""},
        ]);
      });
    });
  });

  describe("#saveFeeds()", () => {
    it("saves feeds to store", () => {
      const feeds = [
        {id: "1", title: "title1"},
        {id: "2", title: "title2"},
        {id: "3", title: "title3"},
      ];
      store.saveFeeds(feeds);
      expect(sheet.getLastRow()).to.eq(4);
      expect(sheet.getSheetValues(2, 1, feeds.length, 2)).to.deep.eq([
        ["1", "title1"],
        ["2", "title2"],
        ["3", "title3"],
      ]);
    });

    context("when the argument is empty", () => {
      it("does nothing", () => {
        store.saveFeeds([]);
        expect(sheet.getLastRow()).to.eq(1);
      });
    });
  });

  describe("#clear()", () => {
    it("clears all stored feeds", () => {
      store.saveFeeds([
        {
          id: "1", title: "title1",
        },
      ]);
      expect(sheet.getLastRow()).to.eq(2);
      store.clear();
      expect(sheet.getLastRow()).to.eq(1);
    });
  });

  describe("#isEmpty()", () => {
    context("when the content is empty", () => {
      it("returns true", () => {
        expect(store.isEmpty()).to.be.true;
      });
    });
  });
});
