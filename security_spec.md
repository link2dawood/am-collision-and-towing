# Security Specification - AM Collision & Towing

## Data Invariants
- A Lead must have a name, phone, and service type.
- `createdAt` must be a server timestamp.
- Lead IDs must be valid alphanumeric strings.
- Public users can ONLY create leads. They cannot read, update, or delete them.
- Only authorized admins (based on a verified list) can read or manage leads.

## The "Dirty Dozen" Payloads
1. **The Ghost Field**: Creating a lead with `isAdmin: true`.
2. **The Identity Spoof**: Trying to read another user's lead (leads are private to admins anyway).
3. **The Timestamp Trick**: Providing a manual `createdAt` far in the past.
4. **The Giant Message**: Sending a lead with a 10MB message string.
5. **The ID Poison**: Creating a lead with an ID that is a 2KB junk string.
6. **The Update Gap**: Trying to update a lead's `serviceType` after creation.
7. **The Delete Attempt**: Attempting to delete a lead as a public user.
8. **The Blind Query**: Attempting to list all leads as an unauthenticated user.
9. **The Email Faker**: Providing a malformed email address that bypasses simple regex.
10. **The Size Exhaustion**: Sending an object with 500 fields.
11. **The PII Leak**: Authenticated user trying to 'get' a specific lead ID they didn't create.
12. **The Script Injection**: Putting `<script>` tags in the name or message field (validation should limit characters).

## Test Cases (Conceptual summary for firestore.rules.test.ts)
- `create` with valid data -> ALLOW
- `create` with missing required fields -> DENY
- `create` with custom `createdAt` -> DENY
- `get/list/update/delete` by public -> DENY
- `get/list` by Admin -> ALLOW
