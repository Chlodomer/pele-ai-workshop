# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Workshop decisions — 16 September 2026
User approved all three HIGH AI mockups as the design direction. Combine mockup 1 overview, mockup 2 guided stage, and mockup 3 resource library. Hebrew RTL, original HIGH AI logo, locally supplied Assistant and Karantina fonts, cream #F6F4EC / green #004128 / restrained gold #8B7029. Build locally first; deployment comes later. Keep compatible with GitHub Pages and Sites. No fictional available datasets or completed videos. Videos: typography, diagrams and component animation; no narration; user will supply Suno music; Higgsfield is the proposed production tool. No automatic audio or graphic-entry sound effects.

Landing page requested: feature the exact group name פל״א - פורום למחקר איכותני prominently. Use a realistic black-and-white qualitative-research image, integrated elegantly. Home now presents the group, with the previous overview preserved at #workshop.

Hero revision: remove the invented caption and visible image credit. Use a real structural overlap between the black-and-white photograph and the group typography, diagonals and coordinated movement. Do not reintroduce the tagline להקשיב. לפרש. לחזור למקור. It was assistant-written, not source text. Keep reduced-motion accessibility.

Navigation should fade between pages and workshop stages. Only agentic desktop platforms are in scope: ChatGPT Desktop, Claude Desktop with agentic mode, and Google Antigravity. Remove Gemini browser workflows and ordinary-chat fallback instructions.

Hero correction: user rejected the broken-glass impression. Divide the photograph into broad parallel diagonal sections; let aligned typography cross the sections in green and cream. Avoid shards, irregular polygons, and independent fragment movement.

Reduce initial text density. Use cohesive realistic black-and-white research imagery across main pages; collapse workshop navigation, platform selection, step explanations, and supplementary setup details. Keep primary actions, stage identity and researcher checkpoints visible.

Stage photographs appear only on the overview tab (השלב בקצרה). Do not repeat them on instructions, diagram, or video tabs.

Synthetic collection: preserve all nuanced source materials while simplifying the default to a short guide, two interviews, one continuing task and one research notebook. Templates are optional. Every document must have an individual download and grouped/bulk downloads as separate files, never ZIP. Facilitator notes must be clearly separated from the participant default.

Superseding workshop route: 3 hours, limited AI literacy, substantial troubleshooting. Main experience is one exercise page, one file combining INT01/INT03/INT02 with original paragraph IDs, two prompts and a human source-check between them. No participant collection inventory, notebook, templates, platform choice, diagrams or mandatory expansion. Every step states action, outcome and completion criterion. Keep all previous materials as clearly labeled extensions with individual and bulk downloads. Instructor page explains 180-minute schedule and what each activity accomplishes.
