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
   * @param url  An URL of feed.
   * @param store  A [[FeedStore]] to store feeds.
   */
  constructor(
    public readonly url: string,
    public readonly store: FeedStore,
  ) {
    this.newlyEntries = [];
  }

  /**
   * Fetch a remote feed and extract new feeds.
   * The result can get from [[getNewlyEntries]].
   */
  public fetch(): void {
    // XXX: I want to use "ETag" header but it does not work on GAS
    // https://issuetracker.google.com/issues/36759005
    const response = UrlFetchApp.fetch(this.url);
    const document = XmlService.parse(response.getContentText());

    // TODO: Currently, ATOM support only
    const fetchedFeeds = atomReader(document);
    const existanceFeeds = this.store.loadFeeds(this.store.getFeedCount());
    const newlyEntries = extractNewlyEntries(existanceFeeds, fetchedFeeds).reverse();

    this.store.saveFeeds(newlyEntries);

    this.newlyEntries.push(...newlyEntries);
  }

  /**
   * Get newly entries that fetched by [[fetch]] method.
   *
   * @return Newly entries
   */
  public getNewlyEntries(): FeedEntry[] {
    return this.newlyEntries;
  }

  /**
   * Delete all new entries that is stored in this reader.
   * Note that feeds in store is not deleted.
   */
  public resetNewlyEntries(): void {
    this.newlyEntries = [];
  }
}
