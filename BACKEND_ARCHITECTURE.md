# CreditFix Backend Architecture

## Runtime Flow

```text
server/src/index.js
  -> loads env
  -> connects MongoDB with Mongoose
  -> creates HTTP server
  -> attaches Socket.IO
  -> starts Express app

server/src/app.js
  -> CORS
  -> JSON body parsing
  -> request logging
  -> route mounting
  -> global error handler
```

## Middleware

- `requireAuth`: validates JWT, loads the user, blocks suspended accounts.
- `optionalAuth`: attaches auth data when a valid token is present.
- `requireAdmin`: gates admin-only endpoints.

## Main Route Groups

- `/api/auth`: login, registration, profile, agent selection.
- `/api/credit`: user-owned credit accounts, score history, summaries.
- `/api/disputes`: user-owned disputes and dispute stats.
- `/api/support-tickets`: ticket submission and user ticket lookup.
- `/api/contact`: public contact submission, admin-only list access.
- `/api/consultations`: public consultation submission, admin-only list access.
- `/api/admin`: admin operations for users, disputes, credit records, request statuses, agents, dashboard, platform controls.
- `/api/messages`: agent/admin/user messaging APIs.
- `/api/health`: health check endpoint.

## Data Model

- `User`
  - roles: `user`, `agent`, `admin`
  - statuses: `active`, `suspended`
  - optional `assignedAgentId`
  - optional `selectedService`
- `CreditAccount`
  - belongs to a user
- `CreditScore`
  - belongs to a user
- `Dispute`
  - belongs to a user
  - can reference a `CreditAccount`
- `SupportTicket`
  - optional user owner
- `ContactMessage`
  - inbound sales/support contact form submissions
- `ConsultationRequest`
  - inbound booking/consultation requests
- `PlatformControl`
  - singleton-style admin-managed UI configuration
- `AgentMessage`
  - realtime and persisted chat between users, agents, and admins

## Realtime

Socket.IO handles:

- authenticated connections via JWT
- presence subscriptions
- typing indicators
- new message fan-out

## Admin Capability Surface

Admins can now:

- manage users, roles, statuses, services, and agent assignment
- create/update/delete user credit accounts
- create/update/delete user credit scores
- create/update/delete user disputes
- review and update support ticket status and priority
- review and update contact message status
- review and update consultation request status
- create agents
- manage dashboard/platform controls

## Security Notes

- Public submission endpoints remain public for `POST`.
- Operational list reads for contact and consultation records are now admin-only.
- Suspended users are blocked in authenticated flows.
