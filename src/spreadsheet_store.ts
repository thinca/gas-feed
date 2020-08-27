import {FeedEntry} from "./feed_entry";
import {FeedStore} from "./feed_store";

/**
 * Stores feed data to a sheet of Google Spreadsheet.
 * The first row is used for an marker and metadata.
 * The feeds are stored to second or later rows.
 */
export class SpreadsheetStore implements FeedStore {
  public static readonly ETAG_POSITION = 3;
  private static readonly FEED_MARK = "Feed Store";
  private static readonly DATA_VERSION = "1.0";
  private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

  /**
   * Create a new SpreadsheetStore.
   *
   * @param spreadsheetId - An ID of spreadsheet.
   * @param sheetName - A name of sheet.
   */
  constructor(
    public readonly spreadsheetId: string,
    public readonly sheetName: string,
  ) {
    this.sheet = this.getSheet();
    this.initialize(false);
  }

  /**
   * Load stored ETag data.
   * Returns an empty string when there is no stored data.
   *
   * @returns ETag.
   */
  public loadETag(): string {
    const range = this.sheet.getRange(1, SpreadsheetStore.ETAG_POSITION);
    return range.getValue() as string;
  }

  /**
   * Save the ETag data.
   *
   * @param etag - ETag.
   */
  public saveETag(etag: string): void {
    const range = this.sheet.getRange(1, SpreadsheetStore.ETAG_POSITION);
    range.setValue(etag);
  }

  /**
   * Get the feed count of store.
   *
   * @returns feed count.
   */
  public getFeedCount(): number {
    return this.sheet.getLastRow() - 1;
  }

  /**
   * Load the latest n feeds.
   *
   * @param n - Count of feeds.
   * @returns Loaded feeds.
   */
  public loadFeeds(n: number): FeedEntry[] {
    const height = this.getFeedCount();
    const count = height < n ? height : n;
    const data = this.sheet.getSheetValues(2, 1, count, 5);
    return data.map((row) => ({
      id: row[0] as string,
      title: row[1] as string,
      url: row[2] as string,
      date: row[3] as string,
      body: row[4] as string,
    }));
  }

  /**
   * Save new feeds.
   * This does not care the feed's ID.
   * Always stored all feeds.
   *
   * @param feeds - Feeds to save.
   */
  public saveFeeds(feeds: FeedEntry[]): void {
    if (feeds.length === 0) {
      return;
    }
    const values = feeds.map((feed) => [
      feed.id,
      feed.title,
      feed.url || "",
      feed.date || "",
      feed.body || "",
    ]);
    this.sheet.insertRowsAfter(1, feeds.length);
    const range = this.sheet.getRange(2, 1, feeds.length, 5);
    range.setValues(values);
  }

  /**
   * Return true if there is no feeds in this store.
   *
   * @returns Store is empty or not.
   */
  public isEmpty(): boolean {
    return this.sheet.getLastRow() === 1;
  }

  /**
   * Clear all stored feeds.
   */
  public clear(): void {
    this.initialize(true);
  }

  private initialize(force: boolean): void {
    if (force || !this.isInitialized()) {
      this.sheet.clear();
      const feedMarkCell = this.sheet.getRange(1, 1, 1, 2);
      feedMarkCell.setValues([[SpreadsheetStore.FEED_MARK, SpreadsheetStore.DATA_VERSION]]);
    }
  }

  private isInitialized(): boolean {
    const feedMarkCell = this.sheet.getRange(1, 1);
    return feedMarkCell.getValue() === SpreadsheetStore.FEED_MARK;
  }

  private getSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const spreadsheet = SpreadsheetApp.openById(this.spreadsheetId);
    const sheet = spreadsheet.getSheetByName(this.sheetName);
    if (sheet == null) {
      throw new Error(`Sheet not found: ${this.sheetName}`);
    }
    return sheet;
  }
}
