export interface CoreValue {
  id: number;
  title: string;
  description: string;
}

export interface FooterLink {
  title: string;
  links: WebLink[];
}

export interface Sermon {
  id: number;
  title: string;
  bibleVerse: string;
  preacher: string;
  date: Date;
  url: string;
}

export interface WebLink {
  title: string;
  href: string;
}
