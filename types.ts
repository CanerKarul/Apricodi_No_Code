
export type ElementType =
  | 'input'
  | 'select'
  | 'button'
  | 'table'
  | 'heading'
  | 'card'
  | 'chat'
  | 'workflow'
  | 'agent'
  | 'data-viz'
  | 'api-connector'
  | 'code-block'
  | 'timeline'
  | 'kanban'
  | 'contact-form';

export interface DynamicElement {
  id: string;
  type: ElementType;
  label: string;

  // Basic form elements
  inputType?: string;
  options?: string[];
  placeholder?: string;
  content?: string;

  // Table
  columns?: string[];
  data?: any[];

  // Chat interface
  messages?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
  companyInfo?: {
    name?: string;
    description?: string;
    products?: string[];
    services?: string[];
    [key: string]: any;
  };
  qaDatabase?: Array<{
    question: string;
    answer: string;
    keywords?: string[];
  }>;
  botPersonality?: string;

  // Workflow
  nodes?: Array<{
    id: string;
    type: 'trigger' | 'action' | 'condition' | 'ai';
    label: string;
    description?: string;
  }>;
  connections?: Array<{
    from: string;
    to: string;
  }>;

  // Agent
  capabilities?: string[];
  status?: 'active' | 'idle' | 'processing';
  description?: string;

  // Data visualization
  chartType?: 'bar' | 'line' | 'metric' | 'progress';
  metrics?: Array<{
    label: string;
    value: number | string;
    color?: string;
  }>;

  // API Connector
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;

  // Code block
  code?: string;
  language?: string;

  // Timeline
  events?: Array<{
    title: string;
    description: string;
    timestamp: string;
    status?: 'completed' | 'in-progress' | 'pending';
  }>;

  // Kanban
  kanbanColumns?: Array<{
    id: string;
    title: string;
    items: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
  }>;
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
  name?: string;
  company?: string;
  created_at?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  interest_area?: string;
  projectId?: string;
  created_at?: string;
}
