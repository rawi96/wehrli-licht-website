/** The website's content: pages, navigation and site settings, wherever they are maintained (today DatoCMS). */
export type ContentSource = {
  /** Path of the contact page (Header & Footer settings), with a fallback when none is set. */
  getContactPath(): Promise<string>;
};
