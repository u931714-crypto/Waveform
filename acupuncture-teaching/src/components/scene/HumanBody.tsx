/**
 * HumanBody – placeholder 3D human figure built from primitive geometry.
 *
 * Since we don't have a real GLTF anatomical model, we approximate the body
 * with capsules/spheres/cylinders so the rest of the interaction system
 * works correctly. Real assets can be swapped in by replacing this component.
 *
 * Layer visibility is controlled via the `layers` prop.
 */

import { useRef } from 'react'
import { Cylinder, Sphere, Capsule } from '@react-three/drei'
import * as THREE from 'three'
import type { LayerVisibility } from '../../types'

interface Props {
  layers: LayerVisibility
}

// Skin-toned base material
const skinMat = new THREE.MeshStandardMaterial({
  color: '#c9956a',
  roughness: 0.85,
  metalness: 0.0,
})
// Muscle red
const muscleMat = new THREE.MeshStandardMaterial({
  color: '#c0392b',
  roughness: 0.7,
  metalness: 0.0,
  transparent: true,
  opacity: 0.85,
})
const deepMuscleMat = new THREE.MeshStandardMaterial({
  color: '#922b21',
  roughness: 0.7,
  metalness: 0.0,
  transparent: true,
  opacity: 0.75,
})
// Bone
const boneMat = new THREE.MeshStandardMaterial({
  color: '#f0e6d3',
  roughness: 0.6,
  metalness: 0.05,
  transparent: true,
  opacity: 0.9,
})
// Organ purple
const organMat = new THREE.MeshStandardMaterial({
  color: '#8e44ad',
  roughness: 0.8,
  metalness: 0.0,
  transparent: true,
  opacity: 0.7,
})
// Blood vessel red wire
const vesselMat = new THREE.MeshStandardMaterial({
  color: '#e74c3c',
  roughness: 0.5,
  metalness: 0.1,
  transparent: true,
  opacity: 0.6,
  wireframe: false,
})
// Nerve yellow
const nerveMat = new THREE.MeshStandardMaterial({
  color: '#f39c12',
  roughness: 0.5,
  metalness: 0.0,
  transparent: true,
  opacity: 0.6,
})

export default function HumanBody({ layers }: Props) {
  const groupRef = useRef<THREE.Group>(null)

  const skin    = layers['skin']            !== false
  const supMus  = layers['superficialMuscles'] !== false
  const depMus  = layers['deepMuscles']     !== false
  const bones   = layers['bones']           !== false
  const organs  = layers['organs']          !== false
  const vessels = layers['bloodVessels']    !== false
  const nerves  = layers['nerves']          !== false

  return (
    <group ref={groupRef} name="human-body">

      {/* ── SKIN layer ──────────────────────────────────── */}
      {skin && (
        <group name="skin-layer">
          {/* Head */}
          <Sphere args={[0.55, 32, 32]} position={[0, 3.7, 0]}>
            <primitive object={skinMat} attach="material" />
          </Sphere>
          {/* Neck */}
          <Cylinder args={[0.18, 0.22, 0.5, 16]} position={[0, 3.05, 0]}>
            <primitive object={skinMat} attach="material" />
          </Cylinder>
          {/* Torso */}
          <Capsule args={[0.55, 2.0, 8, 16]} position={[0, 1.3, 0]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Pelvis/Hip */}
          <Capsule args={[0.52, 0.4, 8, 16]} position={[0, -0.1, 0]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Left upper arm */}
          <Capsule args={[0.13, 0.9, 8, 12]} position={[-0.75, 1.6, 0]} rotation={[0, 0, 0.25]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Left forearm */}
          <Capsule args={[0.1, 0.85, 8, 12]} position={[-1.1, 0.8, 0]} rotation={[0, 0, 0.15]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Left hand */}
          <Sphere args={[0.12, 12, 12]} position={[-1.35, 0.15, 0]}>
            <primitive object={skinMat} attach="material" />
          </Sphere>
          {/* Right upper arm */}
          <Capsule args={[0.13, 0.9, 8, 12]} position={[0.75, 1.6, 0]} rotation={[0, 0, -0.25]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Right forearm */}
          <Capsule args={[0.1, 0.85, 8, 12]} position={[1.1, 0.8, 0]} rotation={[0, 0, -0.15]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Right hand */}
          <Sphere args={[0.12, 12, 12]} position={[1.35, 0.15, 0]}>
            <primitive object={skinMat} attach="material" />
          </Sphere>
          {/* Left thigh */}
          <Capsule args={[0.22, 1.1, 8, 16]} position={[-0.28, -1.2, 0]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Left shin */}
          <Capsule args={[0.16, 1.1, 8, 16]} position={[-0.3, -2.5, 0.1]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Left foot */}
          <Capsule args={[0.1, 0.35, 8, 12]} position={[-0.3, -3.4, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Right thigh */}
          <Capsule args={[0.22, 1.1, 8, 16]} position={[0.28, -1.2, 0]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Right shin */}
          <Capsule args={[0.16, 1.1, 8, 16]} position={[0.3, -2.5, 0.1]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
          {/* Right foot */}
          <Capsule args={[0.1, 0.35, 8, 12]} position={[0.3, -3.4, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={skinMat} attach="material" />
          </Capsule>
        </group>
      )}

      {/* ── SUPERFICIAL MUSCLES layer ─────────────────── */}
      {supMus && (
        <group name="superficial-muscles-layer">
          {/* Pectorals */}
          <Capsule args={[0.35, 0.5, 8, 12]} position={[0, 1.7, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={muscleMat} attach="material" />
          </Capsule>
          {/* Deltoid L */}
          <Sphere args={[0.18, 12, 12]} position={[-0.7, 2.0, 0.0]}>
            <primitive object={muscleMat} attach="material" />
          </Sphere>
          {/* Deltoid R */}
          <Sphere args={[0.18, 12, 12]} position={[0.7, 2.0, 0.0]}>
            <primitive object={muscleMat} attach="material" />
          </Sphere>
          {/* Quad L */}
          <Capsule args={[0.2, 0.9, 8, 12]} position={[-0.28, -1.1, 0.15]}>
            <primitive object={muscleMat} attach="material" />
          </Capsule>
          {/* Quad R */}
          <Capsule args={[0.2, 0.9, 8, 12]} position={[0.28, -1.1, 0.15]}>
            <primitive object={muscleMat} attach="material" />
          </Capsule>
          {/* Tibialis anterior L */}
          <Capsule args={[0.09, 0.9, 8, 12]} position={[-0.42, -2.5, 0.22]}>
            <primitive object={muscleMat} attach="material" />
          </Capsule>
          {/* Tibialis anterior R */}
          <Capsule args={[0.09, 0.9, 8, 12]} position={[0.42, -2.5, 0.22]}>
            <primitive object={muscleMat} attach="material" />
          </Capsule>
        </group>
      )}

      {/* ── DEEP MUSCLES layer ────────────────────────── */}
      {depMus && (
        <group name="deep-muscles-layer">
          {/* Erector spinae */}
          <Capsule args={[0.12, 2.8, 8, 12]} position={[-0.18, 0.8, -0.35]}>
            <primitive object={deepMuscleMat} attach="material" />
          </Capsule>
          <Capsule args={[0.12, 2.8, 8, 12]} position={[0.18, 0.8, -0.35]}>
            <primitive object={deepMuscleMat} attach="material" />
          </Capsule>
          {/* Psoas L */}
          <Capsule args={[0.1, 1.0, 8, 12]} position={[-0.2, -0.2, 0.0]} rotation={[0.3, 0, 0.3]}>
            <primitive object={deepMuscleMat} attach="material" />
          </Capsule>
          {/* Psoas R */}
          <Capsule args={[0.1, 1.0, 8, 12]} position={[0.2, -0.2, 0.0]} rotation={[0.3, 0, -0.3]}>
            <primitive object={deepMuscleMat} attach="material" />
          </Capsule>
        </group>
      )}

      {/* ── BONES layer ───────────────────────────────── */}
      {bones && (
        <group name="bones-layer">
          {/* Skull */}
          <Sphere args={[0.45, 16, 16]} position={[0, 3.75, 0]}>
            <primitive object={boneMat} attach="material" />
          </Sphere>
          {/* Spine */}
          <Cylinder args={[0.06, 0.06, 4.5, 8]} position={[0, 0.6, -0.1]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Ribcage */}
          <Cylinder args={[0.48, 0.4, 1.4, 16, 1, true]} position={[0, 1.5, 0]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Pelvis */}
          <Cylinder args={[0.38, 0.42, 0.4, 16, 1, true]} position={[0, -0.05, 0]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Femur L */}
          <Cylinder args={[0.07, 0.07, 1.4, 8]} position={[-0.22, -1.1, 0]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Femur R */}
          <Cylinder args={[0.07, 0.07, 1.4, 8]} position={[0.22, -1.1, 0]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Tibia L */}
          <Cylinder args={[0.055, 0.05, 1.3, 8]} position={[-0.25, -2.4, 0]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Tibia R */}
          <Cylinder args={[0.055, 0.05, 1.3, 8]} position={[0.25, -2.4, 0]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Humerus L */}
          <Cylinder args={[0.055, 0.05, 1.0, 8]} position={[-0.72, 1.55, 0]} rotation={[0, 0, 0.2]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
          {/* Humerus R */}
          <Cylinder args={[0.055, 0.05, 1.0, 8]} position={[0.72, 1.55, 0]} rotation={[0, 0, -0.2]}>
            <primitive object={boneMat} attach="material" />
          </Cylinder>
        </group>
      )}

      {/* ── ORGANS layer ──────────────────────────────── */}
      {organs && (
        <group name="organs-layer">
          {/* Heart */}
          <Sphere args={[0.2, 12, 12]} position={[-0.1, 1.8, 0.15]}>
            <primitive object={organMat} attach="material" />
          </Sphere>
          {/* Lungs L */}
          <Capsule args={[0.22, 0.7, 8, 12]} position={[-0.32, 1.5, 0.05]}>
            <primitive object={organMat} attach="material" />
          </Capsule>
          {/* Lungs R */}
          <Capsule args={[0.22, 0.7, 8, 12]} position={[0.32, 1.5, 0.05]}>
            <primitive object={organMat} attach="material" />
          </Capsule>
          {/* Liver */}
          <Sphere args={[0.28, 12, 12]} position={[0.2, 0.95, 0.1]}>
            <primitive object={organMat} attach="material" />
          </Sphere>
          {/* Stomach */}
          <Sphere args={[0.22, 12, 12]} position={[-0.1, 0.7, 0.15]}>
            <primitive object={organMat} attach="material" />
          </Sphere>
          {/* Large intestine — approximate loop */}
          <Cylinder args={[0.1, 0.1, 0.7, 8, 1, true]} position={[0, 0.1, 0]}>
            <primitive object={organMat} attach="material" />
          </Cylinder>
          {/* Kidneys L */}
          <Capsule args={[0.1, 0.22, 6, 8]} position={[-0.22, 0.3, -0.28]}>
            <primitive object={organMat} attach="material" />
          </Capsule>
          {/* Kidneys R */}
          <Capsule args={[0.1, 0.22, 6, 8]} position={[0.22, 0.3, -0.28]}>
            <primitive object={organMat} attach="material" />
          </Capsule>
        </group>
      )}

      {/* ── BLOOD VESSELS layer ───────────────────────── */}
      {vessels && (
        <group name="blood-vessels-layer">
          {/* Aorta (descending) */}
          <Cylinder args={[0.04, 0.04, 3.2, 8]} position={[-0.1, 0.5, -0.05]}>
            <primitive object={vesselMat} attach="material" />
          </Cylinder>
          {/* Femoral L */}
          <Cylinder args={[0.03, 0.03, 1.5, 8]} position={[-0.18, -1.3, 0]}>
            <primitive object={vesselMat} attach="material" />
          </Cylinder>
          {/* Femoral R */}
          <Cylinder args={[0.03, 0.03, 1.5, 8]} position={[0.18, -1.3, 0]}>
            <primitive object={vesselMat} attach="material" />
          </Cylinder>
          {/* Brachial L */}
          <Cylinder args={[0.025, 0.025, 1.0, 8]} position={[-0.75, 1.1, 0]} rotation={[0, 0, 0.2]}>
            <primitive object={vesselMat} attach="material" />
          </Cylinder>
          {/* Brachial R */}
          <Cylinder args={[0.025, 0.025, 1.0, 8]} position={[0.75, 1.1, 0]} rotation={[0, 0, -0.2]}>
            <primitive object={vesselMat} attach="material" />
          </Cylinder>
        </group>
      )}

      {/* ── NERVOUS SYSTEM layer ──────────────────────── */}
      {nerves && (
        <group name="nerves-layer">
          {/* Spinal cord */}
          <Cylinder args={[0.04, 0.04, 3.0, 8]} position={[0, 1.0, -0.18]}>
            <primitive object={nerveMat} attach="material" />
          </Cylinder>
          {/* Sciatic L */}
          <Cylinder args={[0.025, 0.025, 1.8, 8]} position={[-0.2, -1.5, -0.1]}>
            <primitive object={nerveMat} attach="material" />
          </Cylinder>
          {/* Sciatic R */}
          <Cylinder args={[0.025, 0.025, 1.8, 8]} position={[0.2, -1.5, -0.1]}>
            <primitive object={nerveMat} attach="material" />
          </Cylinder>
          {/* Brachial plexus L */}
          <Cylinder args={[0.02, 0.02, 0.8, 8]} position={[-0.65, 1.8, 0]} rotation={[0, 0, 0.5]}>
            <primitive object={nerveMat} attach="material" />
          </Cylinder>
          {/* Brachial plexus R */}
          <Cylinder args={[0.02, 0.02, 0.8, 8]} position={[0.65, 1.8, 0]} rotation={[0, 0, -0.5]}>
            <primitive object={nerveMat} attach="material" />
          </Cylinder>
        </group>
      )}

    </group>
  )
}
