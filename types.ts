
export type ElementType = 'input' | 'select' | 'button' | 'table' | 'heading' | 'card';

export interface DynamicElement {
  id: string;
  type: ElementType;
  label: string;
  inputType?: string;
  options?: string[];
  placeholder?: string;
  content?: string;
  columns?: string[];
  data?: any[];
}

export interface AppSchema {
  appName: string;
  description: string;
  elements: DynamicElement[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  schema: AppSchema;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectId: string;
}
