# Free Learning Material Sources for Resource Aggregator

> Comprehensive catalog of open educational resources (OER), open courseware, MOOCs, and media libraries suitable for programmatic aggregation. Curated from university library guides (ASU, ODU, CMU, MSU, UT Austin, UWM, SUNY) and major OER directories.

---

## 1. Meta-Search / Aggregators (Search Multiple Sources at Once)

| Source | URL | API / Embed | Coverage | License Filter |
|--------|-----|-------------|----------|----------------|
| **OASIS** | <https://oasis.geneseo.edu> | Embeddable search widget; no public REST API | 100+ sources, 400k+ records (textbooks, courses, sims, podcasts, videos) | Yes (CC BY, CC BY-SA, PD, etc.) |
| **Mason OER Metafinder (MOM)** | <https://oer.mason.metafinder.org> | No public API | 22 major repositories simultaneously | Partial |
| **OER Commons** | <https://oercommons.org> | **REST API** (v2), LTI 1.3, Common Cartridge export | 50k+ vetted resources, collections, groups, hubs | Yes (full CC spectrum) |
| **MERLOT II** | <https://merlot.org> | **REST API** (search, metadata) | 100k+ peer-reviewed materials, 24 categories | Yes |
| **LibreTexts Search** | <https://libretexts.org> | GraphQL endpoint | Modular STEM + humanities textbooks | CC BY-NC-SA 4.0 |

**Recommendation**: Start with **OASIS** (broadest coverage) + **OER Commons API** (rich metadata, social features) + **MERLOT API** (peer-review signal).

---

## 2. Open Textbook Libraries (Curated, Peer-Reviewed)

| Source | URL | Scope | API / Export | License |
|--------|-----|-------|--------------|---------|
| **Open Textbook Library (OTL)** | <https://open.umn.edu/opentextbooks> | 1,500+ textbooks, faculty reviews | CSV export, no public API | CC BY, CC BY-SA, CC BY-NC, PD |
| **OpenStax** | <https://openstax.org> | 60+ intro college texts + ancillaries | No public API; PDF/EPUB/HTML download | CC BY 4.0 |
| **LibreTexts** | <https://libretexts.org> | 400+ modular textbooks (STEM focus) | **GraphQL API**, OER Commons harvest | CC BY-NC-SA 4.0 |
| **BCcampus Open Textbooks** | <https://opentextbc.ca> | 300+ Canadian post-secondary texts | CSV/JSON export | CC BY 4.0 |
| **Milne Open Textbooks** | <https://milneopentextbooks.org> | SUNY-authored, peer-reviewed | No API | CC BY-NC-SA |
| **Pressbooks Directory** | <https://pressbooks.directory> | 5,000+ Pressbooks-published titles | OPDS feed, JSON export | Varies (mostly CC BY) |
| **OpenStax CNX (Legacy)** | <https://cnx.org> | Modular content blocks | Legacy API (deprecated) | CC BY |
| **AIM Open Textbooks** | <https://aimath.org/textbooks> | Math-only, editorial-board approved | Static list | CC BY / GNU FDL |

**Metadata fields commonly available**: title, authors, ISBN, subjects, license, version, publication date, format (PDF/EPUB/HTML/Online), ancillaries (slides, test banks), accessibility notes.

---

## 3. Open Courseware (Full Courses + Teaching Materials)

| Source | Institution | Course Count | API / Harvest | License |
|--------|-------------|--------------|---------------|---------|
| **MIT OpenCourseWare** | MIT | 2,500+ courses | **RSS/Atom feeds**, JSON course index, GitHub mirror | CC BY-NC-SA |
| **Open Yale Courses** | Yale | 40+ courses | Video transcripts (JSON), YouTube playlist | CC BY-NC-SA 3.0 |
| **Harvard Online Learning** | Harvard | 100+ free courses | Filter via edX API | Varies |
| **Stanford Online** | Stanford | 200+ courses | Via edX/Coursera APIs | Varies |
| **Open Course Library** | WA State Colleges | 81 courses | Direct download (CC BY) | CC BY 4.0 |
| **Saylor Academy** | Saylor | 100+ college/pro courses | No public API | CC BY 3.0 |
| **Open Learning Initiative (OLI)** | CMU | 30+ interactive courses | LTI only | CC BY-NC-SA |
| **Open.Michigan** | UMich | 200+ courses | OAI-PMH harvest | CC BY |
| **Open Washington** | WA CTCs | 100+ courses | State repository | CC BY |

**Typical course package**: syllabus, lecture videos/notes, readings, assignments, exams, solutions, schedule.

---

## 4. MOOC Platforms (Free Audit Tier)

| Platform | Free Tier | API / Harvest | Notes |
|----------|-----------|---------------|-------|
| **Coursera** | Audit (no cert) | **Coursera Catalog API** (partner only) | 7,000+ courses; deep linking via `coursera.org/learn/<slug>` |
| **edX** | Audit (no cert) | **edX Catalog API** (public) | 3,500+ courses; course discovery endpoint |
| **FutureLearn** | Free for duration | No public API | 1,000+ courses; upgrade for unlimited access |
| **Khan Academy** | 100% free | **Khan Academy API** (REST, OAuth) | K-14 + practice exercises; topic tree |
| **Udacity** | Filter "Free" | No public API | ~200 free courses |
| **Alison** | Free courses | No public API | 4,000+ courses; certs paid |
| **Canvas Network** | Free | LTI / Canvas API | University-hosted open courses |

**Harvest strategy**: Use edX/Coursera public catalog APIs for metadata; deep-link to course pages (no content mirroring needed).

---

## 5. Subject-Specific Repositories

### STEM / Simulations
| Source | Focus | API / Access |
|--------|-------|--------------|
| **PhET Interactive Simulations** | Math/Physics/Chem/Bio/Earth sci sims | Embeddable HTML5; JSON catalog |
| **nanoHUB** | Nanotech, materials, comp. sci | Tool APIs, simulation embedding |
| **ChemCollective** | Virtual chemistry labs | Direct embed |
| **QUBES** | Quantitative biology education | OER Commons harvest |
| **SIMIODE** | Differential equations modeling | Repository |
| **VIPEr** | Inorganic chemistry | Community submissions |
| **Learn ChemE** | Chemical engineering screencasts | YouTube + site |
| **Engineering Library Division OER** | Engineering disciplines | OASIS-indexed |

### Languages
| Source | Focus | License |
|--------|-------|---------|
| **COERLL** (UT Austin) | 16 languages, US Dept of Ed funded | CC BY |
| **LangMedia** (Five Colleges) | Video clips, cultural notes | CC BY-NC-SA |

### Psychology / Social Sciences
| Source | Focus |
|--------|-------|
| **Noba Project** | Modular psych chapters |
| **Society for Teaching of Psychology** | Activities, syllabi, resources |

### Geography / Earth Science
| Source | Focus |
|--------|-------|
| **Open Geography Education** | Textbooks, lab manuals |

---

## 6. Media / Asset Libraries (Images, Video, Audio, Icons)

| Source | URL | Count | API | License |
|--------|-----|-------|-----|---------|
| **Openverse** | <https://openverse.org> | 600M+ images/audio | **REST API** (search, detail) | CC BY, CC BY-SA, PD |
| **Wikimedia Commons** | <https://commons.wikimedia.org> | 100M+ media | **MediaWiki API** (full) | CC BY, CC BY-SA, PD, GFDL |
| **Flickr Commons** | <https://flickr.com/commons> | Institutional collections | Flickr API | PD / CC (varies) |
| **Unsplash** | <https://unsplash.com> | 3M+ photos | **REST API** (rate-limited) | Unsplash License (free commercial) |
| **Pexels** | <https://pexels.com> | 3M+ photos/videos | **REST API** | Pexels License |
| **Pixabay** | <https://pixabay.com> | 2M+ images/videos | **REST API** | Pixabay License |
| **The Noun Project** | <https://thenounproject.com> | 5M+ icons | **REST API** | CC BY (free tier) |
| **Pixnio** | <https://pixnio.com> | 100k+ photos | No API | PD / CC0 |
| **Internet Archive** | <https://archive.org> | Petabytes | **IA API** (search, metadata) | PD / CC / varies |
| **Disabled And Here** | <https://disabledandhere.com> | Disability-led stock | Direct download | CC BY-NC |
| **EDUimages** | <https://eduimages.org> | Education-focused | Direct download | CC BY-NC 4.0 |

---

## 7. Specialized / Niche Collections

| Source | Focus | Access |
|--------|-------|--------|
| **WikiEducator** | Collaborative OER authoring | Wiki export |
| **Teaching Commons** | Curated by universities | OAI-PMH |
| **LibreStudio / H5P** | Interactive content (H5P) | H5P package export |
| **Wisc-Online** | Learning objects (WI tech colleges) | SCORM/HTML5 |
| **OERu** | Free courses + credential pathways | Course feed |
| **Open Professionals Education Network (OPEN)** | Media elements for courses | Direct download |
| **SkillsCommons** | Workforce/vocational (TAACCCT) | Zip packages, metadata |

---

## 8. Regional / National Collections

| Region | Source | URL |
|--------|--------|-----|
| **Canada (Ontario)** | eCampusOntario Open Library | <https://openlibrary.ecampusontario.ca> |
| **USA (WA)** | Open Washington / Open Course Library | <https://openwa.org> |
| **USA (OR)** | Open Oregon | <https://openoregon.org> |
| **USA (GA)** | Affordable Learning Georgia | <https://affordablelearninggeorgia.org> |
| **Latin America** | LACLI | <https://lacli.org> |
| **UK** | Jorum (archived) | <https://web.archive.org/web/2022*/jorum.ac.uk> |

---

## 9. Discovery Tools & APIs for Your Aggregator

| Tool | Type | Integration Notes |
|------|------|-------------------|
| **OASIS Search Widget** | Embeddable JS | `<script src="https://oasis.geneseo.edu/widget.js"></script>` |
| **OER Commons API v2** | REST (OAuth2) | `/api/v2/search`, `/api/v2/collections`, rate-limited |
| **MERLOT API** | REST | `https://www.merlot.org/merlot/api/materials` |
| **Openverse API** | REST | `https://api.openverse.org/v1/images/`, no auth for search |
| **Wikimedia API** | REST + Action API | `https://commons.wikimedia.org/w/api.php` |
| **edX Catalog API** | REST | `https://api.edx.org/catalog/v1/courses/` |
| **Khan Academy API** | REST (OAuth) | Topic tree, exercises, videos |
| **PhET API** | JSON catalog | `https://phet.colorado.edu/services/metadata/1.3/simulations` |
| **Internet Archive API** | REST | `https://archive.org/advancedsearch.php` |

---

## 10. Recommended "Must-Have" Shortlist for MVP

| Priority | Source | Why |
|----------|--------|-----|
| 1 | **OASIS** | Single search across 100+ sources; widget embed |
| 2 | **Open Textbook Library** | Curated, reviewed textbooks; CSV export |
| 3 | **MIT OCW** | Gold-standard courseware; structured metadata |
| 4 | **Khan Academy** | Structured K-14 + practice; API |
| 5 | **Openverse** | Media/assets; generous API |
| 6 | **OER Commons** | Social layer, collections, hubs; API |
| 7 | **LibreTexts** | Remixable STEM; GraphQL |
| 8 | **edX Catalog** | MOOC metadata; deep links |
| 9 | **PhET** | Interactive STEM sims; embeddable |
| 10 | **COERLL** | Language OER (underserved niche) |

---

## 11. Suggested Normalized Metadata Schema

```json
{
  "id": "string (UUID or source-specific)",
  "source": "string (e.g., 'oercommons', 'mitocw', 'openverse')",
  "source_id": "string (original ID from source)",
  "title": "string",
  "description": "string (markdown/html)",
  "resource_type": "enum: textbook | course | video | simulation | audio | image | interactive | assessment | module | collection",
  "subjects": ["string (taxonomy: LOM, Dewey, or custom)"],
  "educational_level": "enum: K12 | lower_undergrad | upper_undergrad | graduate | professional | lifelong",
  "authors": [{"name": "string", "url": "string?", "orcid": "string?"}],
  "institution": "string?",
  "license": "string (SPDX identifier: CC-BY-4.0, CC-BY-SA-4.0, CC0, PD, etc.)",
  "license_url": "string",
  "languages": ["string (ISO 639-1)"],
  "formats": ["string (PDF, EPUB, HTML, MP4, WebM, H5P, SCORM, etc.)"],
  "urls": {
    "landing": "string (canonical page)",
    "download": "string?",
    "embed": "string?",
    "api": "string?"
  },
  "metadata": {
    "version": "string?",
    "date_published": "ISO8601",
    "date_updated": "ISO8601?",
    "duration_minutes": "number?",
    "file_size_bytes": "number?",
    "accessibility": {"captions": "bool", "transcript": "bool", "screen_reader": "bool"},
    "requires_auth": "bool",
    "is_peer_reviewed": "bool"
  },
  "relationships": {
    "is_part_of": "string (collection/course ID)?",
    "has_parts": ["string (child resource IDs)"],
    "derivatives": ["string (remix/translation IDs)"]
  },
  "quality_signals": {
    "review_count": "number",
    "average_rating": "number",
    "adoption_count": "number",
    "last_verified": "ISO8601"
  },
  "harvested_at": "ISO8601",
  "raw_source_record": "object (preserve original)"
}
```

---

## 12. Harvesting Architecture Suggestions

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Schedulers │────▶│  Harvesters │────▶│  Normalizer │────▶│  Search/DB  │
│  (cron/Air- │     │  (per-source│     │  (map to    │     │  (Meilisearch│
│   flow)     │     │   adapters) │     │   schema)   │     │   /ES/Typesense)│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             ┌───────────┐  ┌───────────┐
             │  Raw Store│  │  Delta    │
             │  (S3/MinIO│  │  Detection│
             │   + PG)   │  │  (hash)   │
             └───────────┘  └───────────┘
```

- **Per-source adapters**: Small, testable modules (one per API/feed)
- **Idempotent harvests**: Use `ETag`/`Last-Modified` + content hash
- **Incremental sync**: Daily for APIs, weekly for static exports
- **Dead link detection**: Periodic HEAD checks on `urls.landing`
- **License compliance**: Store SPDX ID; filter by policy at query time

---

## 13. Next Steps for Your Aggregator

1. **Pick 3–5 sources** from the MVP shortlist to integrate first
2. **Build adapter pattern** — one class/module per source with `fetch()`, `normalize()`, `validate()`
3. **Set up search index** (MeiliSearch/Typesense for speed; Elasticsearch if you need complex filters)
4. **Add license-aware filtering** in UI (user selects "CC BY only", "Commercial use allowed", etc.)
5. **Implement deep-linking** — don't mirror content; link to canonical pages (respects source analytics, avoids copyright issues)
6. **Track provenance** — every record knows its `source`, `harvested_at`, and `raw_source_record`
7. **Expose your own API** — let others build on your aggregation

---

*Generated from university OER library guides (ASU, ODU, CMU, MSU, UT Austin, UWM, SUNY) and direct source inspection. Last updated: 2026-10-20.*