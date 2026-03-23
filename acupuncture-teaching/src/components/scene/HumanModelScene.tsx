/**
 * HumanModelScene – root R3F Canvas scene.
 *
 * Combines:
 *   - Orbit controls (zoom / pan / rotate)
 *   - Ambient + directional lighting
 *   - HumanBody (anatomical layers)
 *   - MeridianRenderer
 *   - AcupointMarkers
 *
 * All state is passed in as props from the parent page so this component
 * stays purely visual.
 */

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import type { Acupoint, LayerVisibility } from '../../types'
import HumanBody from './HumanBody'
import MeridianRenderer from './MeridianRenderer'
import AcupointMarkers from './AcupointMarkers'

interface Props {
  layers: LayerVisibility
  activeMeridians: Set<string>
  selectedId: string | null
  suggestedIds: Set<string>
  onHover: (point: Acupoint | null, screenPos: { x: number; y: number }) => void
  onSelect: (point: Acupoint) => void
}

function SceneContents({
  layers,
  activeMeridians,
  selectedId,
  suggestedIds,
  onHover,
  onSelect,
}: Props) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 4]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#8ab4f8" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Ground grid */}
      <Grid
        args={[10, 10]}
        position={[0, -4.5, 0]}
        cellColor="#1e3a5f"
        sectionColor="#2563eb"
        cellSize={0.5}
        sectionSize={2}
        fadeDistance={12}
        infiniteGrid
      />

      {/* Body model */}
      <Suspense fallback={null}>
        <HumanBody layers={layers} />
      </Suspense>

      {/* Meridians */}
      <MeridianRenderer
        visible={layers['meridians'] !== false}
        activeMeridians={activeMeridians}
      />

      {/* Acupoints */}
      <AcupointMarkers
        visible={layers['acupoints'] !== false}
        selectedId={selectedId}
        suggestedIds={suggestedIds}
        onHover={onHover}
        onSelect={onSelect}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={16}
        target={[0, 0, 0]}
        autoRotate={false}
      />
    </>
  )
}

export default function HumanModelScene(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 100 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ background: 'transparent' }}
    >
      <SceneContents {...props} />
    </Canvas>
  )
}
