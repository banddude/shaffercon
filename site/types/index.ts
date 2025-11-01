export interface SiteConfig {
  siteName: string;
  logoUrl: string;
  tagline: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    workingHours: string;
  };
  business: {
    license: string;
    licenses: string[];
    serviceArea: string;
  };
  social: {
    facebook: string;
    instagram: string;
  };
}

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface MenuData {
  primaryMenu: MenuItem[];
  phone: string;
}

export interface WordPressPage {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  parent: number;
  menu_order: number;
  template: string;
}

export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media?: number;
  categories?: number[];
  tags?: number[];
}

export type PageTemplate =
  | "homepage"
  | "city"
  | "commercial"
  | "residential"
  | "general_service"
  | "utility"
  | "blog";
