// Copyright 2025 Poiema Ministries. All Rights Reserved.

interface Describable {
  id: number;
  title: string;
  description: string;
}

export interface Announcement extends Describable {
  order?: number;
  announcementImage?: {
    image?: {
      asset?: {
        _id: string;
        url: string;
      };
    };
    width: number;
    height: number;
  };
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

export interface EventFormField {
  _key: string;
  label: string;
  inputType: 'text' | 'phone' | 'textarea' | 'dropdown' | 'checkbox';
  dropdownOptions?: string[];
  checkboxOptions?: string[];
}

export interface UpcomingEvent {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  bannerImage: {
    asset?: {
      _id: string;
      url: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  description?: string;
  eventDate: string;
  eventEndDate?: string;
  registrationDeadline: string;
  fields: EventFormField[];
  order: number;
  googleSheetId?: string;
  googleSheetUrl?: string;
}

export interface RetreatActivity {
  _key: string;
  title: string;
  startTime: string;
  endTime: string;
  note?: string;
}

export interface RetreatScheduleDay {
  _key: string;
  dayLabel: string;
  date?: string;
  activities: RetreatActivity[];
}

export interface RetreatQuestionSection {
  _key: string;
  isVisible: boolean;
  sermonTitle: string;
  bibleVerse: string;
  reflectionQuestions: string[];
}

export interface Retreat {
  _id: string;
  isEnabled: boolean;
  themeTitle: string;
  subtitle: string;
  speaker: string;
  themeImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  scheduleDays?: RetreatScheduleDay[];
  questionSections?: RetreatQuestionSection[];
}
