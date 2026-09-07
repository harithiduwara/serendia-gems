# Software Requirements Specification — SerendiaGems.com

| Field | Value |
|---|---|
| Product | SerendiaGems.com — Ceylon Sapphire Atelier |
| Version | 1.0 |
| Status | Approved for build |
| Date | 2026-09-08 |
| Author | Engineering |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for the SerendiaGems.com storefront: a
direct-from-source sales channel for loose Ceylon (Sri Lankan) sapphires. It is the
controlling reference for design, implementation, and acceptance.

### 1.2 Scope
Release 1.0 delivers a public, statically-rendered catalogue of 24 individually
photographed and specified sapphires, with faceted discovery, per-stone detail pages,
a wishlist, and an enquiry-to-purchase funnel. Payment capture is explicitly **out of
scope** for 1.0 (see §7).

### 1.3 Business context
Coloured gemstones above ~USD 1,000 are rarely bought on impulse from a cart. The
industry norm — and the behaviour of the target buyer — is *enquire, converse, verify,
then transact*. The commercial goal of 1.0 is therefore **qualified enquiry volume**,
not checkout conversion. Every design decision below follows from this.

### 1.4 Definitions
| Term | Meaning |
|---|---|
| Stone / Lot | A single sellable item, identified by a lot code (e.g. `HR16`). May be a matched pair. |
| Ceylon | Sri Lanka; the historic and current premier source of fine sapphire. |
| Unheated / Natural | No thermal enhancement after mining. Commands a significant premium. |
| Heated | Standard, permanent, industry-accepted thermal enhancement to improve colour/clarity. |
| ct | Carat, 0.2 grams. |
| PDP | Product Detail Page. |
| Matched pair | Two stones cut and selected to agree in colour, size, and cut, sold as one lot. |

---

## 2. Stakeholders

| Stakeholder | Interest |
|---|---|
| Owner / Gem merchant | Sell inventory at target margin; project authority and trust. |
| Retail buyer | A specific stone for an engagement ring or personal piece. |
| Trade buyer (jeweller, designer) | Repeatable supply, matched pairs, accurate specifications. |
| Collector | Unheated, large, or unusual-colour material. |

---

## 3. User stories

### 3.1 Discovery
- **US-01** As a buyer, I can see the full inventory at a glance so I can judge the range on offer.
- **US-02** As a buyer, I can filter by variety, treatment, shape, carat, and price so I can narrow to what I want.
- **US-03** As a buyer, I can sort by price and by carat weight in either direction.
- **US-04** As a buyer, my filter state appears in the URL so I can share or bookmark a filtered view.
- **US-05** As a trade buyer, I can isolate matched pairs, because pairs serve a distinct purpose (earrings, three-stone rings).

### 3.2 Evaluation
- **US-06** As a buyer, I can view every available photograph of a stone at high resolution.
- **US-07** As a buyer, I can read the complete specification — variety, treatment, weight, shape, origin.
- **US-08** As a buyer, I can read an honest written description of the individual stone, not boilerplate.
- **US-09** As a buyer, I can see the price in both LKR and USD.
- **US-10** As a buyer, I understand what "heated" and "unheated" mean and why they are priced differently.
- **US-11** As a buyer, I can see comparable stones so I can weigh alternatives.

### 3.3 Acquisition
- **US-12** As a buyer, I can send an enquiry about a specific stone with the lot pre-filled.
- **US-13** As a buyer, I can reach the merchant by WhatsApp/email in one tap.
- **US-14** As a buyer, I can save stones to a wishlist that survives page reloads.
- **US-15** As a buyer, I can enquire about my entire wishlist in one message.

### 3.4 Trust
- **US-16** As a buyer, I can read the merchant's sourcing story and credentials.
- **US-17** As a buyer, I can find the returns, certification, and shipping terms before I enquire.

---

## 4. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Render a catalogue of all inventory lots from a single typed data source. | Must |
| FR-02 | Provide faceted filtering: variety, treatment (natural/heated), shape, carat band, price band, pairs-only, photographed-only. | Must |
| FR-03 | Filters combine with AND across facets, OR within a facet. | Must |
| FR-04 | Persist active filter and sort state to the URL query string; restore on load. | Must |
| FR-05 | Provide sorting: featured, price asc/desc, carat asc/desc, newest. | Must |
| FR-06 | Generate a static PDP per lot at build time. | Must |
| FR-07 | PDP shows a gallery of all photographs with a zoom/lightbox view. | Must |
| FR-08 | PDP shows a full specification table and a written caption unique to the stone. | Must |
| FR-09 | Display prices in LKR and USD; USD is the authoritative figure of record. | Must |
| FR-10 | Provide an enquiry form with server-side validation, pre-filled from lot context. | Must |
| FR-11 | Persist a wishlist in browser storage; expose count in the header. | Must |
| FR-12 | Provide editorial guidance: Ceylon origin, heat treatment, buying guide, care. | Must |
| FR-13 | Emit `Product` + `Organization` + `BreadcrumbList` JSON-LD structured data. | Must |
| FR-14 | Emit `sitemap.xml` and `robots.txt`. | Must |
| FR-15 | Show "reserved"/"sold" state and suppress enquiry CTA when not available. | Should |
| FR-16 | Show related stones on each PDP, ranked by variety then price proximity. | Should |
| FR-17 | Lots without photography are clearly marked, not hidden. | Should |

---

## 5. Non-functional requirements

| ID | Category | Requirement | Acceptance |
|---|---|---|---|
| NFR-01 | Performance | Largest Contentful Paint < 2.5 s on 4G. | Lighthouse ≥ 90 mobile |
| NFR-02 | Performance | All catalogue and PDP routes statically pre-rendered. | `next build` reports `○`/`●` for all such routes |
| NFR-03 | Performance | Images served in modern formats with responsive `srcset` and blur placeholders. | Visual + network inspection |
| NFR-04 | Accessibility | WCAG 2.1 AA: contrast, focus visibility, keyboard operability, semantic landmarks. | Manual audit + automated checks |
| NFR-05 | Accessibility | Every image carries descriptive alt text naming the actual stone. | Code review |
| NFR-06 | SEO | Unique title/description/canonical/OG per route. | Code review |
| NFR-07 | Responsiveness | Usable and correct from 320 px to 2560 px. | Manual audit |
| NFR-08 | Compatibility | Latest two versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+. | Manual audit |
| NFR-09 | Maintainability | Strict TypeScript, no `any` in application code. | `tsc --noEmit` clean |
| NFR-10 | Security | No secrets in the client bundle; enquiry input validated and length-capped server-side. | Code review |
| NFR-11 | Security | Security headers set: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame denial. | Header inspection |
| NFR-12 | Reliability | Inventory integrity enforced by tests: unique codes, positive weights, resolvable images. | `npm test` green |
| NFR-13 | Theming | Respect `prefers-reduced-motion`; no essential information conveyed by colour alone. | Manual audit |

---

## 6. Data requirements

Source of record for 1.0 is `Gem Lot Details.xlsx` (24 rows) plus `Gem Lot Pics/` (19 photographs covering 12 lots).

**Canonical lot schema**

| Field | Type | Notes |
|---|---|---|
| `code` | string | Primary key, e.g. `HR16`. Unique. |
| `variety` | enum | Blue / Yellow / Pink / White / Green / Violet Sapphire. |
| `treatment` | enum | `natural` (unheated) \| `heated`. |
| `carats` | number | > 0. Total weight; for pairs, the combined weight. |
| `shape` | enum | Oval / Cushion / Heart / Round. |
| `isPair` | boolean | Derived from the source `Type` column. |
| `priceLKR` | number | From source. |
| `priceUSD` | number | From source; authoritative. |
| `images` | string[] | Ordered; first is the hero. May be empty. |
| `hasVideo` | boolean | Video available on request. |
| `caption` | string | Short merchandising line. |
| `description` | string | Long-form, stone-specific. |
| `colourNote` | string | Observed colour, tone, saturation. |
| `status` | enum | `available` \| `reserved` \| `sold`. |

**Data provenance rule (important).** Captions for the 12 photographed lots are written
from direct observation of the photographs. Captions for the 12 lots without photography
are written **only** from the recorded specification (variety, treatment, weight, shape)
and must not assert colour, clarity, or cut quality that has not been observed. Those
lots are surfaced with a "photography in preparation" state.

---

## 7. Out of scope for 1.0

Deliberately excluded, with rationale:

| Excluded | Rationale |
|---|---|
| Payment capture / checkout | High-value coloured stones transact after conversation and verification. Adding a card form now would depress trust and create PCI obligations without commercial benefit. Enquiry funnel first; instrument it; add payments when data justifies. |
| User accounts | Nothing in 1.0 requires identity. Wishlist works in local storage. |
| CMS / admin UI | 24 lots. A typed data module reviewed in version control is faster, safer, and cheaper than a CMS until inventory turnover justifies one. |
| Live inventory sync | No upstream system exists to sync with. |
| Multi-currency beyond LKR/USD | No demand evidence. |
| Transactional email delivery | Requires the owner's provider credentials and domain DNS. The API contract and validation are built; the transport is a documented, one-function integration point. |

---

## 8. Assumptions and dependencies

- **A-01** USD prices in the source sheet are the intended retail figures, not cost.
- **A-02** All stones are of Sri Lankan origin, consistent with the brand premise.
- **A-03** The merchant will supply certification per stone on request; the site therefore states certification is available rather than displaying certificate numbers it does not have.
- **A-04** Contact details (phone, email, address) shown in 1.0 are **placeholders** and must be replaced before go-live. They are isolated in one configuration module for exactly this reason.
- **A-05** Photographs are the merchant's own and cleared for commercial use.

---

## 9. Acceptance criteria

Release 1.0 is accepted when:
1. All 24 lots are reachable, each with a unique statically-rendered PDP.
2. Every functional requirement marked **Must** is demonstrable.
3. `npm run verify` (typecheck + tests + production build) passes with zero errors.
4. The smoke suite returns HTTP 200 with expected content for every primary route.
5. No lot displays a claim about a stone that is not supported by the source data or a photograph.
