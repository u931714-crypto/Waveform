# TCM Acupuncture Teaching System

An interactive 3D educational application for learning Traditional Chinese Medicine acupuncture theory.

> **Disclaimer:** This tool is for educational and visualization purposes only. It is not a medical diagnosis system, and nothing in this application should be construed as clinical advice. Always consult a licensed TCM practitioner or physician.

---

## Features

- **3D Human Body Viewer** – layered anatomy (skin, muscles, bones, organs, blood vessels, nerves, meridians, acupoints)
- **Interactive Acupoint Markers** – hover tooltips and click-to-select detail panels
- **Meridian Rendering** – CatmullRom tube paths for 6 meridians (ST, LI, LV, SP, CV, GV)
- **Layer Toggle** – toggle each anatomy layer on/off independently
- **Meridian Filter** – show/hide individual meridians or all at once
- **Syndrome / Symptom Engine** – type symptoms to get rule-based acupoint suggestions
- **AI Teaching Assistant** – Claude-powered educational explanations (requires Anthropic API key)

---

## Quick Start

```bash
cd acupuncture-teaching
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## AI Assistant Setup

The AI Teaching Assistant uses the Anthropic API (Claude Sonnet). To enable it:

1. Obtain an API key from [console.anthropic.com](https://console.anthropic.com)
2. Click the **Key** button in the AI Tutor panel header
3. Paste your key (stored in localStorage — never sent anywhere except the Anthropic API)

---

## Project Structure

```
src/
├── components/
│   ├── scene/
│   │   ├── HumanModelScene.tsx   # Root R3F Canvas + camera/lighting
│   │   ├── HumanBody.tsx         # Placeholder anatomy geometry (layer-aware)
│   │   ├── MeridianRenderer.tsx  # CatmullRom tube meridian paths
│   │   └── AcupointMarkers.tsx   # Interactive acupoint spheres
│   └── ui/
│       ├── TopBar.tsx            # Title + disclaimer
│       ├── LayerController.tsx   # Anatomy layer toggles
│       ├── MeridianFilter.tsx    # Meridian show/hide buttons
│       ├── Tooltip.tsx           # Hover tooltip (2D overlay)
│       ├── SelectionPanel.tsx    # Full point detail panel
│       ├── SyndromeSuggestion.tsx # Symptom input + results
│       └── AIAssistantPanel.tsx  # Streaming AI chat
├── data/
│   ├── acupoints.ts              # 16 sample acupoints across 6 meridians
│   ├── meridians.ts              # 6 meridian definitions with 3D path waypoints
│   ├── layers.ts                 # Anatomy layer definitions
│   └── symptoms.ts               # 13 syndrome to acupoint rules
├── engine/
│   └── syndromeSuggestion.ts     # Rule-based suggestion engine
├── pages/
│   └── MainPage.tsx              # Root layout + state management
└── types/
    └── index.ts                  # All TypeScript types
```

---

## Extending the Dataset

### Adding acupoints

Add entries to `src/data/acupoints.ts` following the `Acupoint` type in `src/types/index.ts`. The 3D position uses model-space coordinates (Y up, body height ~8 units, feet at Y=-4, head at Y=+4).

### Adding meridians

Add entries to `src/data/meridians.ts`. Provide ordered `path` waypoints for the tube geometry.

### Adding syndrome rules

Add entries to `src/data/symptoms.ts`. Each rule maps keyword arrays to acupoint IDs and provides a TCM reasoning string.

### Replacing placeholder geometry

Replace `HumanBody.tsx` with a GLTF loader when you have real anatomical assets. The rest of the system does not depend on the geometry internals.

---

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Three.js + @react-three/fiber + @react-three/drei
- Tailwind CSS v4
- Anthropic SDK (claude-sonnet-4-6)
- Lucide React (icons)
