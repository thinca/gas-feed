import {FeedEntry} from "./feed_entry";
import {FeedStore} from "./feed_store";

function extractNewlyEntries(
  existanceFeeds: FeedEntry[],
  fetchedFeeds: FeedEntry[],
): FeedEntry[] {
  return fetchedFeeds.filter((fetched) =>
    existanceFeeds.every((stored) => fetched.id !== stored.id),
  );
}

function atomReader(
  document: GoogleAppsScript.XML_Service.Document,
): FeedEntry[] {
  const atom = XmlService.getNamespace("http://www.w3.org/2005/Atom");
  const root = document.getRootElement();
  const rssEntries = root.getChildren("entry", atom);

  const entries: FeedEntry[] = [];
  for (const entry of rssEntries) {
    entries.push({
      id: entry.getChildText("id", atom),
      title: entry.getChildText("title", atom).trim(),
      url: entry
        .getChild("link", atom)
        .getAttribute("href")
        .getValue(),
      date: entry.getChildText("updated", atom),
      body: entry.getChildText("summary", atom),
    });
  }
  return entries;
}

/**
 * A FeedReader.
 */
export class FeedReader {
  private newlyEntries: FeedEntry[];

  /**
   * Creates a new FeedReader object.
   *
   * @param url - An URL of feed.
   * @param store - A [[FeedStore]] to store feeds.
   */
  constructor(
    public readonly url: string,
    public readonly store: FeedStore,
  ) {
    this.newlyEntries = [];
  }

  /**
   * Fetch a remote feed and extract new feed entries.
   * The result can also get from [[getNewlyEntries]].
   * Do not forget calling [[save]] to save entries.
   *
   * @returns Fetched entries.
   */
  public fetch(): FeedEntry[] {
    // XXX: I want to use "ETag" header but it does not work on GAS
    // https://issuetracker.google.com/issues/36759005
    const response = UrlFetchApp.fetch(this.url);
    const document = XmlService.parse(response.getContentText());

    // TODO: Currently, ATOM support only
    const fetchedFeeds = atomReader(document);
    const existanceFeeds = this.store.loadFeeds(this.store.getFeedCount()).concat(this.newlyEntries);
    const newlyEntries = extractNewlyEntries(existanceFeeds, fetchedFeeds).reverse();

    this.newlyEntries.push(...newlyEntries);
    return newlyEntries;
  }

  /**
   * Save the entries that fetched but not saved yet.
   */
  public save(): void {
    this.store.saveFeeds(this.newlyEntries);
    this.resetNewlyEntries();
  }

  /**
   * Get entries that fetched by [[fetch]] method but not saved yet.
   *
   * @returns Newly entries.
   */
  public getNewlyEntries(): FeedEntry[] {
    return this.newlyEntries;
  }

  /**
   * Discard all not saved entries.
   * Note that feeds in store are not deleted.
   */
  public resetNewlyEntries(): void {
    this.newlyEntries = [];
  }
}
