export interface PigeonOptions {
  baseUrl?: string;
}

export interface SendEmailRequest {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  reply_to?: string | string[];
  template?: string;
  variables?: Record<string, unknown>;
}

export interface Email {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  reply_to?: string[];
  subject: string;
  html?: string | null;
  text?: string | null;
  status: string;
  created_at: string;
}

export class PigeonError extends Error {
  statusCode?: number;
  name: string;
  body?: unknown;
}

export class Pigeon {
  constructor(apiKey: string, options?: PigeonOptions);
  emails: {
    send(payload: SendEmailRequest): Promise<Email>;
    list(query?: { status?: string; q?: string }): Promise<{ data: Email[] }>;
    get(id: string): Promise<Email>;
    cancel(id: string): Promise<Email>;
  };
  domains: {
    list(): Promise<{ data: unknown[] }>;
    create(nameOrAttrs: string | { name: string; region?: string }): Promise<unknown>;
    verify(id: string): Promise<unknown>;
    remove(id: string): Promise<void>;
  };
  contacts: {
    create(contact: { email: string; name?: string }): Promise<{ id: string; email: string; name?: string }>;
  };
  automations: {
    trigger(id: string, payload?: { to?: string; variables?: Record<string, unknown> }): Promise<Email>;
  };
}

export default Pigeon;
