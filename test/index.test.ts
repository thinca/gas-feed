import {expect} from "chai";
import {FeedReader, SpreadsheetStore} from "../src/index";

describe("index", () => {
  it("has FeedReader", () => {
    expect(FeedReader).to.exist;
  });
  it("has SpreadsheetStore", () => {
    expect(SpreadsheetStore).to.exist;
  });
});
