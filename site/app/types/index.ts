/**
 * Shared TypeScript types and interfaces for the Shaffer Construction website
 */

// Navigation and Routes
export interface NavigationLink {
  label: string;
  href: string;
  active?: boolean;
}

// Service related types
export interface Service {
  id: string;
  name: string;
  slug: string;
  type: string;
  location?: string;
  description?: string;
}

// Location related types
export interface Location {
  id: string;
  name: string;
  slug: string;
  description?: string;
  services?: Service[];
}

// Page content types
export interface PageSection {
  id: string;
  pageId: string;
  sectionType: string;
  heading?: string;
  content: string;
  sectionOrder: number;
}

// Blog/Post types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

// Component prop types
export interface ComponentBaseProps {
  className?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
