# WDS Bug Hunt Ingestion Webhook Contract (v2.1)

This specification defines the cryptographic API contract between the external **WDS Bug Hunt Platform** (`wds-bug-hunt.netlify.app/bug-hunt`) and the **WDS Operating System** (`/api/hub/bugs/webhook`).

---

## 1. Webhook Endpoint
- **URL**: `POST https://wds-msit.vercel.app/api/hub/bugs/webhook`
- **Content-Type**: `application/json`
- **Authentication**: HMAC SHA-256 Signature Header

---

## 2. Request Headers

| Header | Description | Example |
| :--- | :--- | :--- |
| `Content-Type` | MIME payload type | `application/json` |
| `x-wds-signature-256` | HMAC SHA-256 digest of raw body | `sha256=d5a6b7c...` or raw hex `d5a6b7c...` |
| `User-Agent` | Client identifier | `WDS-BugHunt-Bot/2.1` |

---

## 3. Signature Calculation (Node.js Reference)

```javascript
const crypto = require("crypto");

function generateWebhookSignature(payloadString, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(payloadString)
    .digest("hex");
}
```

The server compares signatures using constant-time evaluation (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.

---

## 4. Payload Schema (JSON)

```json
{
  "bugId": "BUG-2026-8941",
  "title": "Broken SSL certificate on admission portal subdomain",
  "website": "msit.in",
  "severity": "HIGH",
  "reporterHandle": "ethical_hacker_42"
}
```

### Field Definitions
- `bugId` (`string`, required): Unique external event identifier (used for single-delivery **Idempotency**).
- `title` (`string`, 3–150 chars, required): Summary of the vulnerability.
- `website` (`string`, 2–100 chars, required): Affected domain or portal path.
- `severity` (`enum`, required): `"CRITICAL"` | `"HIGH"` | `"MEDIUM"` | `"LOW"`.
- `reporterHandle` (`string`, 2–50 chars, required): Handle or identifier of the student hunter.

---

## 5. Response Codes & Idempotency

### Success (New Ingestion) — `201 Created`
```json
{
  "success": true,
  "ingested": true,
  "bugId": "0194e432-84b2-7bc9-..."
}
```

### Idempotent Duplicate (Already Processed) — `200 OK`
```json
{
  "success": true,
  "duplicate": true,
  "message": "Webhook event already processed.",
  "bugId": "BUG-2026-8941"
}
```

### Unauthorized / Bad Signature — `401 Unauthorized`
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "HMAC signature verification failed.",
    "requestId": "req_a4f89d..."
  }
}
```
