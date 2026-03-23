import type { Meridian } from '../types'

/**
 * Meridian path waypoints are in model-space coordinates where:
 *   - Y axis = vertical (head = +Y, feet = -Y)
 *   - X axis = horizontal (right = +X from viewer perspective)
 *   - Z axis = depth (front = +Z)
 *
 * The human body placeholder spans roughly Y: -4 to +4 (standing figure, height ~8 units).
 * Paths are approximate and are used only for visual rendering of meridian lines.
 */
export const MERIDIANS: Meridian[] = [
  {
    code: 'ST',
    name: 'Stomach Meridian',
    chineseName: '足陽明胃經',
    element: 'Earth',
    organ: 'Stomach',
    color: '#f39c12',
    description:
      'The Stomach meridian runs from the face downward through the chest, abdomen, and anterior leg to the second toe. It governs digestion, transportation of nutrients, and descending Qi.',
    path: [
      [0.5, 4.0, 0.3],   // below eye (ST1 area)
      [0.6, 3.5, 0.3],   // cheek
      [0.4, 3.0, 0.3],   // jaw
      [0.5, 2.5, 0.4],   // neck / clavicle
      [0.5, 1.8, 0.5],   // chest (ST14-ST18 area)
      [0.5, 1.0, 0.5],   // upper abdomen (ST21)
      [0.5, 0.4, 0.5],   // mid abdomen (ST25)
      [0.5, -0.2, 0.5],  // lower abdomen (ST30)
      [0.6, -0.8, 0.4],  // upper thigh
      [0.5, -1.8, 0.4],  // knee (ST35)
      [0.5, -2.5, 0.4],  // upper shin
      [0.5, -3.0, 0.4],  // ST36 area
      [0.5, -3.5, 0.3],  // lower shin
      [0.5, -4.0, 0.2],  // ankle / ST41
      [0.45,-4.3, 0.2],  // foot ST44
    ],
  },
  {
    code: 'LI',
    name: 'Large Intestine Meridian',
    chineseName: '手陽明大腸經',
    element: 'Metal',
    organ: 'Large Intestine',
    color: '#e67e22',
    description:
      'The Large Intestine meridian begins at the index finger, travels up the arm, shoulder, and neck to the opposite side of the nose. It governs elimination and the descent of Lung Qi.',
    path: [
      [-0.8, -2.5, 0.3], // index fingertip (LI1)
      [-0.9, -2.0, 0.3], // hand web (LI4 area)
      [-1.0, -1.5, 0.3], // wrist
      [-1.1, -1.0, 0.3], // forearm
      [-1.2, -0.5, 0.3], // elbow (LI11)
      [-1.3,  0.0, 0.3], // upper arm
      [-1.2,  0.7, 0.3], // shoulder (LI15)
      [-0.8,  1.2, 0.3], // clavicle
      [-0.4,  2.0, 0.3], // neck
      [-0.3,  2.8, 0.3], // jaw / LI20 area
      [-0.1,  3.2, 0.3], // nose (LI20)
    ],
  },
  {
    code: 'LV',
    name: 'Liver Meridian',
    chineseName: '足厥陰肝經',
    element: 'Wood',
    organ: 'Liver',
    color: '#27ae60',
    description:
      'The Liver meridian begins at the big toe, ascends the inner leg, passes through the genitals, abdomen, and ends at the vertex. It ensures smooth flow of Qi and stores Blood.',
    path: [
      [-0.3, -4.4, 0.2], // big toe (LV1)
      [-0.3, -4.0, 0.2], // foot dorsum
      [-0.3, -3.5, 0.3], // ankle
      [-0.3, -2.8, 0.4], // lower inner leg (LV5)
      [-0.3, -2.2, 0.4], // LV6
      [-0.35,-1.8, 0.4], // inner knee (LV8)
      [-0.4, -1.0, 0.4], // inner thigh
      [-0.4, -0.3, 0.5], // groin
      [-0.3,  0.2, 0.5], // lower abdomen (LV13 area)
      [-0.2,  0.8, 0.5], // ribs
      [-0.15, 1.5, 0.4], // chest (LV14)
      [-0.1,  2.5, 0.3], // throat
      [0.0,   4.2, 0.1], // vertex (GV20 area)
    ],
  },
  {
    code: 'SP',
    name: 'Spleen Meridian',
    chineseName: '足太陰脾經',
    element: 'Earth',
    organ: 'Spleen',
    color: '#e91e63',
    description:
      'The Spleen meridian begins at the big toe, travels up the inner leg, ascends through the abdomen and chest. It governs transformation and transportation of food essence.',
    path: [
      [-0.25,-4.4, 0.2], // big toe medial (SP1)
      [-0.3, -4.0, 0.3], // foot
      [-0.35,-3.5, 0.3], // inner ankle (SP5)
      [-0.4, -3.0, 0.4], // lower inner leg (SP6)
      [-0.4, -2.5, 0.4], // inner shin
      [-0.45,-2.0, 0.4], // SP9
      [-0.5, -1.0, 0.4], // inner thigh (SP10)
      [-0.5, -0.4, 0.5], // groin
      [-0.4,  0.0, 0.5], // lower abdomen
      [-0.4,  0.6, 0.5], // SP14
      [-0.4,  1.2, 0.5], // abdomen SP16
      [-0.45, 1.8, 0.4], // chest SP17
      [-0.5,  2.2, 0.4], // SP19
      [-0.5,  2.5, 0.3], // SP20
      [-0.4,  2.8, 0.3], // SP21 axilla
    ],
  },
  {
    code: 'CV',
    name: 'Conception Vessel (Ren Mai)',
    chineseName: '任脈',
    element: undefined,
    organ: undefined,
    color: '#3498db',
    description:
      'The Conception Vessel runs along the midline of the anterior body from the perineum to the mouth. It is the "Sea of Yin" and regulates all Yin meridians.',
    path: [
      [0.0, -4.5, 0.4], // perineum (CV1)
      [0.0, -3.5, 0.5], // lower abdomen
      [0.0, -2.0, 0.5], // CV4 — Guan Yuan
      [0.0, -1.4, 0.5], // CV6 — Qi Hai
      [0.0, -0.8, 0.5], // CV8 — Shen Que (navel)
      [0.0,  0.0, 0.5], // CV10
      [0.0,  0.5, 0.5], // CV12 — Zhong Wan
      [0.0,  1.0, 0.5], // CV14
      [0.0,  1.6, 0.5], // chest
      [0.0,  2.2, 0.5], // CV17 — Shan Zhong
      [0.0,  2.8, 0.4], // CV21
      [0.0,  3.1, 0.3], // throat (CV22)
      [0.0,  3.5, 0.2], // chin (CV24)
    ],
  },
  {
    code: 'GV',
    name: 'Governing Vessel (Du Mai)',
    chineseName: '督脈',
    element: undefined,
    organ: undefined,
    color: '#9b59b6',
    description:
      'The Governing Vessel runs along the posterior midline from the coccyx to the upper lip. It is the "Sea of Yang" and governs all Yang meridians.',
    path: [
      [0.0, -4.5, -0.4], // coccyx (GV1)
      [0.0, -3.0, -0.5], // sacrum
      [0.0, -1.5, -0.6], // lumbar (GV4)
      [0.0, -0.5, -0.6], // lower thoracic
      [0.0,  0.5, -0.6], // mid thoracic (GV9)
      [0.0,  1.5, -0.6], // upper thoracic (GV12)
      [0.0,  2.5, -0.5], // GV14 — Da Zhui
      [0.0,  3.0, -0.3], // back of neck
      [0.0,  3.5, -0.2], // occiput (GV16)
      [0.0,  3.8,  0.0], // GV20 — Bai Hui (crown)
      [0.0,  3.5,  0.2], // forehead (GV24)
      [0.0,  3.2,  0.3], // nose (GV25-26)
      [0.0,  2.9,  0.3], // upper lip (GV26-27)
    ],
  },
]
