/**
 * MeridianRenderer – draws meridian paths as CatmullRomCurve3 tubes.
 *
 * Each meridian is rendered as a thin glowing tube using its colour.
 * Visibility is controlled by activeMeridians (Set of codes) and the
 * global layer toggle for 'meridians'.
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { MERIDIANS } from '../../data/meridians'

interface Props {
  visible: boolean
  activeMeridians: Set<string>  // empty = all shown
}

function MeridianTube({
  meridian,
}: {
  meridian: (typeof MERIDIANS)[number]
}) {
  const { geometry, material } = useMemo(() => {
    const points = meridian.path.map(
      ([x, y, z]) => new THREE.Vector3(x, y, z)
    )
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
    const geo = new THREE.TubeGeometry(curve, 60, 0.018, 6, false)

    const mat = new THREE.MeshStandardMaterial({
      color: meridian.color,
      emissive: meridian.color,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.82,
    })
    return { geometry: geo, material: mat }
  }, [meridian])

  return <mesh geometry={geometry} material={material} />
}

export default function MeridianRenderer({ visible, activeMeridians }: Props) {
  if (!visible) return null

  const toShow =
    activeMeridians.size === 0
      ? MERIDIANS
      : MERIDIANS.filter(m => activeMeridians.has(m.code))

  return (
    <group name="meridians-layer">
      {toShow.map(m => (
        <MeridianTube key={m.code} meridian={m} />
      ))}
    </group>
  )
}
