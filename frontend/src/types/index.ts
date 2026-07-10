// =============================================================================
// GLOBAL TYPE DEFINITIONS
// Centralized domain types for the entire application
// =============================================================================

// ─── Incident Domain ─────────────────────────────────────────────────────────

export type IncidentCategory =
  | 'BUG'
  | 'FEATURE'
  | 'HARDWARE'
  | 'SOFTWARE'
  | 'NETWORK'
  | 'ACCESS'
  | 'SECURITY'
  | 'OTHER';

export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';

export type IncidentStatus =
  | 'SUBMITTED'
  | 'AI_ANALYZING'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_APPROVAL'
  | 'RESOLVED'
  | 'CLOSED'
  | 'APPROVED'
  | 'REJECTED';

export interface IncidentSource {
  file: string;
  category: string;
  score: number;
}

export interface IncidentAnalysis {
  summary: string;
  root_cause: string;
  resolution_steps: string[];
  escalation_team: string;
  knowledge_confidence: number;
  sources: IncidentSource[];
  category: IncidentCategory;
  category_confidence: number;
  category_reason: string;
  priority: IncidentPriority;
  priority_confidence: number;
  priority_reason: string;
}

// ─── Request/Form Domain ─────────────────────────────────────────────────────

export interface CreateIncidentPayload {
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
}

export interface IncidentRecord extends CreateIncidentPayload {
  id: string;
  status: IncidentStatus;
  resolution_summary: string | null;
  assigned_team: string | null;
  created_at: string;
  updated_at: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

// ─── UI / Form Domain ─────────────────────────────────────────────────────────

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  description?: string;
  icon?: string;
  color?: string;
}

export interface FileWithPreview extends File {
  preview: string;
  id: string;
}
