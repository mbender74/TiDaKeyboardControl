# @jademind/pi-visual

> Migration: package moved from `pi-visual` to `@jademind/pi-visual`.

Advanced visualization and rendering for Pi output.

## Scope

- Keep only the **latest** assistant/tool output.
- Enrich it visually via `pi-tui` markdown inspector.
- Generate inline PNG previews per asset (markdown/chart/mermaid) for fast display.
- Best-effort Mermaid rendering to SVG/PNG.
- Lightweight chart rendering from numeric markdown tables.
- Stable integration surface for external tools:
  - `.pi/visual-cache/latest.json`
- Best-effort inline preview artifacts:
  - `.pi/visual-cache/latest-markdown.png`
  - `.pi/visual-cache/latest-chart.png`
  - `.pi/visual-cache/latest-mermaid.png`

## Commands

- `/pi-visualize` — toggle live visualization on/off
- `/pi-visual` — alias
- `/pi-visual-clear`
- `/pi-visual-widget`

## Mermaid requirement

```bash
npm i -D @mermaid-js/mermaid-cli
```

Fallback uses `npx -y @mermaid-js/mermaid-cli`.

## Install

```bash
pi install npm:@jademind/pi-visual
```

## Quick test

1. `pi install .`
2. run `/pi-visual-test`
3. ask assistant to output the payload exactly
4. run `/pi-visualize`
5. open `.pi/visual-cache/latest.json`
