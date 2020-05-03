import {FeedStore} from "../src/feed_store";
import {FeedEntry} from "../src/feed_entry";

export class DummyStore implements FeedStore {
  private feeds: FeedEntry[];
  private etag: string;

  constructor() {
    this.feeds = [];
    this.etag = "";
  }

  public loadETag() {
    return this.etag;
  }
  public saveETag(etag: string) {
    this.etag = etag;
  }
  public loadFeeds(n: number) {
    return this.feeds.slice(0, n);
  }
  public saveFeeds(feeds: FeedEntry[]) {
    this.feeds.push(...feeds);
  }
  public isEmpty() {
    return this.feeds.length === 0;
  }
  public clear() {
    this.feeds = [];
  }
  public getFeedCount() {
    return this.feeds.length;
  }
}
