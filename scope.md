# MOCUBE — V1 Spec

## 1. Core Mission & User
* **One-Line Pitch:** Showcases services, cases and customers.
* **Primary User:** local businesses who need branding/rebranding to standout in market.
* **The Core Loop:** User opens app -> explores services -> sees case studies -> Gets in touch with us.

---

## 2. V1 Non-Negotiables (Must-Haves)
*List only 3–5 core features required to make the app usable. If it's not essential to the Core Loop, drop it to V2.*

* [ ] **Feature A:** showcase services, micro services, case studies and customers (not hardCoded, but modeled data)
* [ ] **Feature B:** comprehensive SEO
* [ ] **Feature C:** innovative dark/light toggle

---

## 3. Scope Graveyard (Out of Scope for V1)
*Force yourself to list cool ideas here so you don't build them during sprint time.*

* ❌ Mocalendar
* ❌ Mocup studio
* ❌ Auth

---

## 4. Technical Architecture & Stack
* **Frontend:** (Next.js App Router, Tailwind CSS, shadcn/ui)
* **Backend / DB:** (mongodb via mongoose)
* **External Services:** 

---

## 5. Core Data Model Draft
*Outline main entities and their key attributes before writing migrations.*

* **service:** `id`, `slug`, `name`, `color`, `shortDescription`, `description`, `pricingPlans`, `sortOrder`
* **microService:** `id`, `slug` (unique), `name`, `shortDescription`, `description`, `serviceId`, `sortOrder`
* **project:** `id`, `slug`, `title`, `coverUrl`, `galleries[]`, `customerId`, `serviceIds[]`, `microServiceIds[]`, `featured`, `description`
  * **gallery:** `urls[]`, `microServiceIds[]`, `description?`
* **customer:** `id`, `slug`, `name`, `logoUrl`, `shortDescription`, `description`

---

<!-- ## 6. UI & Flow Checklist
*Block out key views before opening Figma or code.*

* [ ] `/login` — Magic link entry point
* [ ] `/dashboard` — Main list of invoices + "Create New" CTA
* [ ] `/invoice/[id]` — View, edit status, export PDF -->