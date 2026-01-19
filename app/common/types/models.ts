// Copyright 2025 Poiema Ministries. All Rights Reserved.

interface Describable {
  id: number;
  title: string;
  description: string;
}

export interface Announcement extends Describable {
  order?: number;
}
export type CoreValue = Describable;
export type Bulletin = Describable;

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

export interface TeamMember {
  _id?: string;
  name: string;
  image?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  team: string[];
}
