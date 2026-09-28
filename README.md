# Pigeon Node.js SDK

Official Node.js client for the [Pigeon](https://github.com/pigeonfs/pigeon) email API. API shape follows [resend-node](https://github.com/resend/resend-node): `pigeon.emails.send({ from, to, subject, html })`.

## Install

```bash
npm install github:pigeonfs/pigeon-node
```

## Setup

Create an API key in the Pigeon dashboard (`pg_…`). Local default host is `http://localhost:4005`.

```js
import { Pigeon } from "pigeon";

const pigeon = new Pigeon("pg_xxxx", {
  baseUrl: process.env.PIGEON_BASE_URL || "http://localhost:4005"
});
```

## Send an email

```js
const email = await pigeon.emails.send({
  from: "Ada <ada@yourdomain.com>",
  to: "person@example.com",
  replyTo: "ada@yourdomain.com",
  subject: "Hello",
  html: "<p>Hello</p>"
});

console.log(`Email ${email.id} has been sent`);
```

Use `@pigeonfs/react-email` to build HTML, then pass `html`:

```js
import { render } from "@pigeonfs/react-email";
import { Welcome } from "./emails/welcome.js";

await pigeon.emails.send({
  from: "Ada <ada@yourdomain.com>",
  to: "person@example.com",
  subject: "Welcome",
  html: await render(Welcome({ firstName: "Ada" }))
});
```

## Other methods

```js
await pigeon.emails.list({ status: "sent" });
await pigeon.emails.get(id);
await pigeon.emails.cancel(id);

await pigeon.domains.list();
await pigeon.domains.create("yourdomain.com");
await pigeon.domains.verify(domainId);

await pigeon.contacts.create({ email: "person@example.com", name: "Ada" });
await pigeon.automations.trigger(automationId, { to: "person@example.com" });
```

The from address must use a domain you verified in Pigeon.

## License

MIT
