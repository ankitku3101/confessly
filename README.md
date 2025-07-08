# Confessly 🧪 (Under Progress)

> A realtime platform built with WebSockets, WebRTC, and modern web technologies.

This is a **Turborepo-based monorepo** containing both frontend and backend apps designed for a realtime anonymous experience.
As project is currently under active development some features may be incomplete or experimental.

---

## 🧱 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Realtime:** WebSockets, WebRTC
- **Monorepo Tooling:** Turborepo
- **Hosting:** Vercel (web) & Render (api)

---

## 📁 Project Structure

```bash
apps/
  web/      # Next.js frontend
  api/      # Express + Socket.io backend

packages/   # shared code
  ui/       # shared UI components
  lib/      # utilities and shared logic


