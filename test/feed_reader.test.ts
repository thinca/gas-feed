import {expect} from "chai";
import {spy} from "sinon";

import {FeedReader} from "../src/feed_reader";
import {DummyStore} from "./dummy_store";
import "./gas-mock";

describe("FeedReader", () => {
  const url = "http://example.com";
  let reader: FeedReader;

  beforeEach(() => {
    const store = new DummyStore();
    reader = new FeedReader(url, store);
  });

  describe("#fetch()", () => {
    it("updates feed store", () => {
      const fetchSpy = spy(UrlFetchApp, "fetch");
      reader.fetch();
      expect(fetchSpy.withArgs(url).calledOnce).to.be.true;
      expect(reader.getNewlyEntries()).to.have.lengthOf(1);
      reader.fetch();
      expect(reader.getNewlyEntries()).to.have.lengthOf(1);
    });
  });

  describe("#getNewlyEntries()", () => {
    context("before fetch", () => {
      it("returns empty array", () => {
        expect(reader.getNewlyEntries()).to.be.empty;
      });
    });

    context("after fetch", () => {
      it("returns newly entries", () => {
        reader.fetch();
        expect(reader.getNewlyEntries()).not.to.be.empty;
      });
    });
  });

  describe("#resetNewlyEntries()", () => {
    context("before fetch", () => {
      it("resets newly entries", () => {
        reader.fetch();
        expect(reader.getNewlyEntries()).not.to.be.empty;
        reader.resetNewlyEntries();
        expect(reader.getNewlyEntries()).to.be.empty;
      });
    });
  });
});
