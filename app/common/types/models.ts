// Copyright 2025 Poiema Ministries. All Rights Reserved.

interface Describable {
  id: number;
  title: string;
  description: string;
}

export interface Announcement extends Describable {
  order?: number;
}
export interface CoreValue extends Describable {}
export interface Bulletin extends Describable {}

export interface FooterLink {
  title: string;
  links: WebLink[];
}

export interface Sermon {
  _id?: string;
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
