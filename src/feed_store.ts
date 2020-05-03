import {FeedEntry} from "./feed_entry";

/**
 * Represents a feed store.
 *
 * A feed store can save and load feeds.
 * Order of feeds must be kept.
 */
export interface FeedStore {
  /**
   * Load the ETag info.
   * The implementation of this can be omit.
   * If it is omitted, this always returns an empty string.
   *
   * @return ETag
   */
  loadETag(): string;

  /**
   * Save the ETag info.
   * The implementation of this can be omit.
   * If it is omitted, this does nothing.
   *
   * @param etag  ETag
   */
  saveETag(etag: string): void;

  /**
   * Get the feed count of store.
   *
   * @return feed count
   */
  getFeedCount(): number;

  /**
   * Load the latest {n} feeds.
   *
   * @param n  Count of feeds
   * @return Loaded feeds
   */
  loadFeeds(n: number): FeedEntry[];

  /**
   * Save new feeds.
   * This does not care the feed's ID.
   * Always stored all feeds.
   *
   * @param feeds  Feeds to save
   */
  saveFeeds(feeds: FeedEntry[]): void;

  /**
   * Return true if there is no feeds in this store.
   *
   * @return Store is empty or not
   */
  isEmpty(): boolean;

  /**
   * Clear all stored feeds.
   */
  clear(): void;
}
