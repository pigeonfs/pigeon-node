const DEFAULT_BASE_URL = "http://localhost:4005";

export class PigeonError extends Error {
  constructor(message, { statusCode, name, body } = {}) {
    super(message);
    this.statusCode = statusCode;
    this.name = name || "pigeon_error";
    this.body = body;
  }
}

export class Pigeon {
  /**
   * @param {string} apiKey Bearer key from the Pigeon dashboard (`pg_…`)
   * @param {{ baseUrl?: string }} [options]
   */
  constructor(apiKey, options = {}) {
    if (!apiKey) throw new Error("Pigeon API key is required");
    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl || process.env.PIGEON_BASE_URL || DEFAULT_BASE_URL).replace(
      /\/$/,
      ""
    );

    this.emails = {
      send: (payload) => this.#request("POST", "/api/emails", normalizeEmail(payload)),
      list: (query = {}) => this.#request("GET", "/api/emails", null, query),
      get: (id) => this.#request("GET", `/api/emails/${id}`),
      cancel: (id) => this.#request("POST", `/api/emails/${id}/cancel`)
    };

    this.domains = {
      list: () => this.#request("GET", "/api/domains"),
      create: (nameOrAttrs) =>
        this.#request(
          "POST",
          "/api/domains",
          typeof nameOrAttrs === "string" ? { name: nameOrAttrs } : nameOrAttrs
        ),
      verify: (id) => this.#request("POST", `/api/domains/${id}/verify`),
      remove: (id) => this.#request("DELETE", `/api/domains/${id}`)
    };

    this.contacts = {
      create: (contact) => this.#request("POST", "/api/contacts", contact)
    };

    this.automations = {
      trigger: (id, payload = {}) =>
        this.#request("POST", `/api/automations/${id}/trigger`, payload)
    };
  }

  async #request(method, path, body, query) {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value != null && value !== "") url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new PigeonError(data?.message || response.statusText, {
        statusCode: response.status,
        name: data?.name,
        body: data
      });
    }

    return data;
  }
}

function normalizeEmail(payload = {}) {
  const body = { ...payload };
  if (body.replyTo && !body.reply_to) body.reply_to = body.replyTo;
  delete body.replyTo;
  if (typeof body.to === "string") body.to = [body.to];
  if (typeof body.cc === "string") body.cc = [body.cc];
  if (typeof body.bcc === "string") body.bcc = [body.bcc];
  if (typeof body.reply_to === "string") body.reply_to = [body.reply_to];
  return body;
}

export default Pigeon;
