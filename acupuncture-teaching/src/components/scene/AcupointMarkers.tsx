/**
 * AcupointMarkers – renders interactive acupoint spheres in the 3D scene.
 *
 * Each point is a small sphere that:
 *   - Glows on hover (emissive intensity increases)
 *   - Calls back with screen position for the tooltip overlay
 *   - Calls back on click to select the point for the detail panel
 *
 * Bilateral points are mirrored on the X axis automatically.
 * Suggested points (from syndrome engine) pulse with a ring.
 */

import { useRef, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ACUPOINTS } from '../../data/acupoints'
import type { Acupoint } from '../../types'

interface Props {
  visible: boolean
  selectedId: string | null
  suggestedIds: Set<string>
  onHover: (point: Acupoint | null, screenPos: { x: number; y: number }) => void
  onSelect: (point: Acupoint) => void
}

interface MarkerProps {
  acupoint: Acupoint
  positionOverride?: [number, number, number]
  isSelected: boolean
  isSuggested: boolean
  onHover: Props['onHover']
  onSelect: Props['onSelect']
}

const BASE_COLOR   = '#f1c40f'
const HOVER_COLOR  = '#ffffff'
const SELECT_COLOR = '#00d4ff'
const SUGGEST_COLOR = '#ff6b6b'

function AcupointMarker({
  acupoint,
  positionOverride,
  isSelected,
  isSuggested,
  onHover,
  onSelect,
}: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { gl, camera } = useThree()

  const pos: [number, number, number] = positionOverride ?? acupoint.position

  // Determine sphere colour based on state priority
  const color = isSelected
    ? SELECT_COLOR
    : hovered
    ? HOVER_COLOR
    : isSuggested
    ? SUGGEST_COLOR
    : BASE_COLOR

  const emissiveIntensity = isSelected ? 1.2 : hovered ? 0.9 : isSuggested ? 0.7 : 0.3

  const getScreenPos = useCallback(
    (position: [number, number, number]) => {
      const vec = new THREE.Vector3(...position).project(camera)
      const canvas = gl.domElement
      return {
        x: ((vec.x + 1) / 2) * canvas.clientWidth,
        y: ((-vec.y + 1) / 2) * canvas.clientHeight,
      }
    },
    [camera, gl]
  )

  const handlePointerEnter = useCallback(
    (e: { stopPropagation?: () => void }) => {
      e.stopPropagation?.()
      setHovered(true)
      document.body.style.cursor = 'pointer'
      onHover(acupoint, getScreenPos(pos))
    },
    [acupoint, pos, getScreenPos, onHover]
  )

  const handlePointerLeave = useCallback(
    (e: { stopPropagation?: () => void }) => {
      e.stopPropagation?.()
      setHovered(false)
      document.body.style.cursor = ''
      onHover(null, { x: 0, y: 0 })
    },
    [onHover]
  )

  const handleClick = useCallback(
    (e: { stopPropagation?: () => void }) => {
      e.stopPropagation?.()
      onSelect(acupoint)
    },
    [acupoint, onSelect]
  )

  const radius = isSelected ? 0.055 : isSuggested ? 0.05 : 0.038

  return (
    <group>
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        position={pos}
        onPointerEnter={handlePointerEnter as never}
        onPointerLeave={handlePointerLeave as never}
        onClick={handleClick as never}
      >
        <sphereGeometry args={[radius, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Outer ring for selected / suggested states */}
      {(isSelected || isSuggested) && (
        <mesh position={pos}>
          <ringGeometry args={[radius * 1.6, radius * 2.0, 24]} />
          <meshBasicMaterial
            color={isSelected ? SELECT_COLOR : SUGGEST_COLOR}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default function AcupointMarkers({
  visible,
  selectedId,
  suggestedIds,
  onHover,
  onSelect,
}: Props) {
  if (!visible) return null

  // Expand bilateral points to both sides
  const markers: Array<{ acupoint: Acupoint; pos: [number, number, number]; key: string }> = []

  for (const ap of ACUPOINTS) {
    if (ap.side === 'bilateral') {
      // Left side: negate X
      markers.push({
        acupoint: ap,
        pos: [-Math.abs(ap.position[0]), ap.position[1], ap.position[2]],
        key: `${ap.point_id}-L`,
      })
      // Right side: positive X
      markers.push({
        acupoint: ap,
        pos: [Math.abs(ap.position[0]), ap.position[1], ap.position[2]],
        key: `${ap.point_id}-R`,
      })
    } else {
      markers.push({ acupoint: ap, pos: ap.position, key: ap.point_id })
    }
  }

  return (
    <group name="acupoints-layer">
      {markers.map(({ acupoint, pos, key }) => (
        <AcupointMarker
          key={key}
          acupoint={acupoint}
          positionOverride={pos}
          isSelected={selectedId === acupoint.point_id}
          isSuggested={suggestedIds.has(acupoint.point_id)}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
