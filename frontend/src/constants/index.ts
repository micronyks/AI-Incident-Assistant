// =============================================================================
// APPLICATION CONSTANTS
// Single source of truth for all configuration values
// =============================================================================
import type { SelectOption, IncidentCategory, IncidentPriority } from '@/types';

export const APP_NAME = 'IncidentAI';
export const APP_VERSION = '1.0.0';
export const API_BASE_URL = '/api/v1';

// ─── Category Options ─────────────────────────────────────────────────────────

export const CATEGORY_OPTIONS: SelectOption<IncidentCategory>[] = [
  {
    value: 'BUG',
    label: 'Bug Report',
    description: 'Something is not working as expected',
    icon: '🐛',
    color: '#ef4444',
  },
  {
    value: 'FEATURE',
    label: 'Feature Request',
    description: 'Request a new feature or enhancement',
    icon: '✨',
    color: '#8b5cf6',
  },
  {
    value: 'HARDWARE',
    label: 'Hardware Issue',
    description: 'Problems with physical hardware',
    icon: '🖥️',
    color: '#f59e0b',
  },
  {
    value: 'SOFTWARE',
    label: 'Software Issue',
    description: 'Application or software problems',
    icon: '💾',
    color: '#3b82f6',
  },
  {
    value: 'NETWORK',
    label: 'Network Issue',
    description: 'Connectivity or network problems',
    icon: '🌐',
    color: '#06b6d4',
  },
  {
    value: 'ACCESS',
    label: 'Access Request',
    description: 'Permission or access related issues',
    icon: '🔐',
    color: '#10b981',
  },
  {
    value: 'SECURITY',
    label: 'Security Concern',
    description: 'Security vulnerabilities or threats',
    icon: '🛡️',
    color: '#dc2626',
  },
  {
    value: 'OTHER',
    label: 'Other',
    description: 'Other types of requests',
    icon: '📋',
    color: '#6b7280',
  },
];

// ─── Priority Options ─────────────────────────────────────────────────────────

export const PRIORITY_OPTIONS: SelectOption<IncidentPriority>[] = [
  {
    value: 'P1',
    label: 'P1 — Critical',
    description: 'System down, business-critical impact',
    color: '#ef4444',
  },
  {
    value: 'P2',
    label: 'P2 — High',
    description: 'Major functionality impacted',
    color: '#f97316',
  },
  {
    value: 'P3',
    label: 'P3 — Medium',
    description: 'Moderate impact, workaround available',
    color: '#eab308',
  },
  {
    value: 'P4',
    label: 'P4 — Low',
    description: 'Minor issue, low business impact',
    color: '#22c55e',
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  SUBMITTED: { label: 'Submitted', color: '#6b7280' },
  AI_ANALYZING: { label: 'AI Analyzing', color: '#8b5cf6' },
  OPEN: { label: 'Open', color: '#3b82f6' },
  IN_PROGRESS: { label: 'In Progress', color: '#f59e0b' },
  WAITING_FOR_APPROVAL: { label: 'Awaiting Approval', color: '#ec4899' },
  RESOLVED: { label: 'Resolved', color: '#10b981' },
  CLOSED: { label: 'Closed', color: '#6b7280' },
  APPROVED: { label: 'Approved', color: '#10b981' },
  REJECTED: { label: 'Rejected', color: '#ef4444' },
} as const;

// ─── File Upload Config ───────────────────────────────────────────────────────

export const FILE_UPLOAD_CONFIG = {
  maxFiles: 5,
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  acceptedTypes: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
  },
};

// ─── Validation Messages ──────────────────────────────────────────────────────

export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  titleMin: 'Title must be at least 10 characters',
  titleMax: 'Title must not exceed 200 characters',
  descriptionMin: 'Description must be at least 30 characters',
  descriptionMax: 'Description must not exceed 5000 characters',
};
