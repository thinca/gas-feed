import {FeedStore} from "../src/feed_store";
import {FeedEntry} from "../src/feed_entry";

export class DummyStore implements FeedStore {
  private feeds: FeedEntry[];
  private etag: string;

  constructor() {
    this.feeds = [];
    this.etag = "";
  }

  public loadETag(): string {
    return this.etag;
  }
  public saveETag(etag: string): void {
    this.etag = etag;
  }
  public loadFeeds(n: number): FeedEntry[] {
    return this.feeds.slice(0, n);
  }
  public saveFeeds(feeds: FeedEntry[]): void {
    this.feeds.push(...feeds);
  }
  public isEmpty(): boolean {
    return this.feeds.length === 0;
  }
  public clear(): void {
    this.feeds = [];
  }
  public getFeedCount(): number {
    return this.feeds.length;
  }
}
