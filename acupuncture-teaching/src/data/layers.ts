import type { AnatomyLayer } from '../types'

/**
 * Ordered anatomy layers - rendered back-to-front.
 * Colors are used both for the 3D geometry and the layer toggle badges.
 */
export const ANATOMY_LAYERS: AnatomyLayer[] = [
  {
    key: 'skin',
    label: 'Skin',
    color: '#f5cba7',
    defaultVisible: true,
    description: 'Outer integumentary layer — the primary surface for acupoint location.',
  },
  {
    key: 'superficialMuscles',
    label: 'Superficial Muscles',
    color: '#e74c3c',
    defaultVisible: false,
    description: 'Superficial skeletal muscles that define body contour and movement.',
  },
  {
    key: 'deepMuscles',
    label: 'Deep Muscles',
    color: '#c0392b',
    defaultVisible: false,
    description: 'Deep postural and stabiliser muscles underlying superficial layers.',
  },
  {
    key: 'bones',
    label: 'Bones / Skeleton',
    color: '#f0e6d3',
    defaultVisible: false,
    description: 'Skeletal framework — bony landmarks are critical for acupoint location.',
  },
  {
    key: 'organs',
    label: 'Internal Organs',
    color: '#8e44ad',
    defaultVisible: false,
    description: 'Visceral organs corresponding to TCM Zang-Fu system.',
  },
  {
    key: 'bloodVessels',
    label: 'Blood Vessels',
    color: '#e74c3c',
    defaultVisible: false,
    description: 'Major arteries and veins — important for contraindication awareness.',
  },
  {
    key: 'nerves',
    label: 'Nervous System',
    color: '#f39c12',
    defaultVisible: false,
    description: 'Peripheral and spinal nerves — relevant to acupoint sensation (De Qi).',
  },
  {
    key: 'meridians',
    label: 'Meridians',
    color: '#27ae60',
    defaultVisible: true,
    description: 'TCM meridian channels (Jing Luo) along which Qi circulates.',
  },
  {
    key: 'acupoints',
    label: 'Acupoints',
    color: '#f1c40f',
    defaultVisible: true,
    description: 'Specific points (Xue Wei) where needling influences Qi flow.',
  },
]
