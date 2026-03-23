// ============================================================
// Core data types for the TCM Acupuncture Teaching System
// ============================================================

import * as THREE from 'three'

// ------------------------------------------------------------------
// Anatomy layers
// ------------------------------------------------------------------
export type LayerKey =
  | 'skin'
  | 'superficialMuscles'
  | 'deepMuscles'
  | 'bones'
  | 'organs'
  | 'bloodVessels'
  | 'nerves'
  | 'meridians'
  | 'acupoints'

export interface AnatomyLayer {
  key: LayerKey
  label: string
  color: string
  defaultVisible: boolean
  description: string
}

// ------------------------------------------------------------------
// Meridians
// ------------------------------------------------------------------
export interface Meridian {
  code: string             // e.g. "ST", "LI", "LV", "SP", "CV", "GV"
  name: string             // e.g. "Stomach Meridian"
  chineseName: string
  element?: string         // e.g. "Earth", "Metal"
  organ?: string           // paired organ
  color: string            // hex colour for rendering
  /** Ordered 3D waypoints for the meridian path (in model space) */
  path: [number, number, number][]
  description: string
}

// ------------------------------------------------------------------
// Acupoints
// ------------------------------------------------------------------
export type Side = 'left' | 'right' | 'midline' | 'bilateral'

export interface Acupoint {
  point_id: string         // e.g. "ST36"
  chinese_name: string
  english_name: string
  pinyin: string
  meridian_name: string
  meridian_code: string
  body_region: string      // e.g. "lower leg"
  side: Side
  position: [number, number, number]  // 3D model-space coordinates
  needle_depth_mm: number
  angle_notes: string
  indications: string[]
  contraindications: string[]
  anatomy_notes: string
}

// ------------------------------------------------------------------
// Symptom → acupoint suggestion engine
// ------------------------------------------------------------------
export interface SyndromeRule {
  keywords: string[]                   // trigger words (lowercase)
  points: string[]                     // point_ids to recommend
  reasoning: string                    // plain-text TCM rationale
  meridians: string[]                  // involved meridian codes
}

export interface SuggestionResult {
  point: Acupoint
  reasoning: string
  matchedKeywords: string[]
  meridians: string[]
}

// ------------------------------------------------------------------
// UI state
// ------------------------------------------------------------------
export interface LayerVisibility {
  [key: string]: boolean
}

export interface HoverState {
  point: Acupoint | null
  screenPosition: { x: number; y: number }
}

export interface AppState {
  layerVisibility: LayerVisibility
  selectedPoint: Acupoint | null
  hoveredPoint: Acupoint | null
  tooltipPos: { x: number; y: number }
  activeMeridians: Set<string>         // meridian codes currently shown
  showAllMeridians: boolean
  symptomQuery: string
  suggestions: SuggestionResult[]
  aiPanelOpen: boolean
  aiContext: string                    // what the AI should explain
}

// ------------------------------------------------------------------
// AI teaching panel
// ------------------------------------------------------------------
export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AISession {
  messages: AIMessage[]
  isLoading: boolean
}

// ------------------------------------------------------------------
// Three.js helpers
// ------------------------------------------------------------------
export type Vec3 = [number, number, number]

/** Extended mesh ref data attached to acupoint spheres */
export interface AcupointMeshData {
  acupoint: Acupoint
  ref: React.RefObject<THREE.Mesh>
}
