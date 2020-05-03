/**
 * Represents an entry of feed.
 */
export interface FeedEntry {
  /**
   * ID of this feed.
   */
  id: string;

  /**
   * Title of this feed.
   */
  title: string;

  /**
   * URL of this feed.
   */
  url?: string;

  /**
   * Date of this feed.
   *
   * This is just a string, does not used as date in internal.
   */
  date?: string;

  /**
   * Body of this feed.
   */
  body?: string;
}
