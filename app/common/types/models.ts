export interface CoreValue {
  id: number;
  title: string;
  description: string;
}

export interface WebLink {
  title: string;
  href: string;
}

export interface FooterLink {
  title: string;
  links: WebLink[];
}
