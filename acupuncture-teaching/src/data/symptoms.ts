import type { SyndromeRule } from '../types'

/**
 * Rule-based symptom → acupoint mapping engine data.
 *
 * Each rule specifies trigger keywords (matched case-insensitively against
 * the user's input), recommended acupoint IDs, TCM reasoning, and related
 * meridian codes.
 *
 * Rules are deliberately kept simple for v1; a later version can replace
 * this with vector similarity or an LLM call.
 */
export const SYNDROME_RULES: SyndromeRule[] = [
  {
    keywords: ['headache', 'head pain', 'migraine', 'head ache'],
    points: ['GV20', 'LI4', 'LV3'],
    reasoning:
      'Headache commonly involves Liver Yang rising, Wind-Cold invasion, or Qi/Blood stagnation in the head. GV20 clears the head and calms Yang; LI4 disperses Wind and relieves pain in the head and face; LV3 sooths Liver Qi stagnation and descends Liver Yang.',
    meridians: ['GV', 'LI', 'LV'],
  },
  {
    keywords: ['nausea', 'vomiting', 'stomach ache', 'stomach pain', 'indigestion', 'gastric'],
    points: ['CV12', 'ST36', 'ST25'],
    reasoning:
      'Nausea and gastric discomfort reflect Stomach Qi rebelling upward, often combined with Spleen Qi deficiency. CV12 harmonises the Stomach and descends rebellious Qi; ST36 tonifies Spleen-Stomach and regulates middle Jiao; ST25 resolves intestinal Qi stagnation.',
    meridians: ['CV', 'ST'],
  },
  {
    keywords: ['neck stiffness', 'neck pain', 'stiff neck', 'cervical'],
    points: ['GV14', 'LI4', 'LI11'],
    reasoning:
      'Neck stiffness commonly results from Wind-Cold invasion, Qi stagnation, or Yang deficiency in the Governor Vessel. GV14 expels exterior pathogens and relaxes the neck; LI4 disperses Wind and analgesic effect; LI11 clears heat and moves Qi in the arm-channel.',
    meridians: ['GV', 'LI'],
  },
  {
    keywords: ['insomnia', 'sleep', 'sleepless', 'cant sleep', "can't sleep", 'sleep disturbance'],
    points: ['GV20', 'SP6', 'CV17'],
    reasoning:
      'Insomnia in TCM is often linked to Heart Spirit (Shen) disturbance, Liver Qi stagnation, or Yin deficiency creating internal Heat. GV20 calms the Shen; SP6 nourishes Yin and calms the mind (intersects Liver, Kidney, Spleen Yin); CV17 opens the chest, regulates Qi, and settles the Heart.',
    meridians: ['GV', 'SP', 'CV'],
  },
  {
    keywords: ['stress', 'anxiety', 'tension', 'nervous', 'irritable', 'frustrated'],
    points: ['LV3', 'CV17', 'GV20', 'SP6'],
    reasoning:
      'Stress and emotional tension are classic signs of Liver Qi stagnation in TCM. LV3 moves stagnant Liver Qi; CV17 opens the chest and calms the spirit; GV20 clears the mind and calms Yang; SP6 nourishes the foundation and steadies the spirit.',
    meridians: ['LV', 'CV', 'GV', 'SP'],
  },
  {
    keywords: ['digestive', 'digestion', 'bloating', 'bloated', 'flatulence', 'gas', 'constipation', 'diarrhea', 'diarrhoea'],
    points: ['ST36', 'CV12', 'ST25', 'SP6'],
    reasoning:
      'Digestive discomfort points to Spleen-Stomach disharmony — either excess (food stagnation) or deficiency (Spleen Qi weakness). ST36 strengthens the Spleen-Stomach; CV12 regulates the middle Jiao; ST25 resolves food and Qi stagnation in the intestines; SP6 supports Spleen transformation.',
    meridians: ['ST', 'CV', 'SP'],
  },
  {
    keywords: ['fatigue', 'tired', 'exhausted', 'low energy', 'weakness', 'lethargy'],
    points: ['ST36', 'CV6', 'GV4', 'SP6'],
    reasoning:
      'Fatigue indicates deficiency of Qi, Yang, or Blood. ST36 is one of the premier tonification points for Spleen-Stomach Qi; CV6 nourishes Yuan (Original) Qi; GV4 warms Kidney Yang as the "Life Gate"; SP6 nourishes Blood and Yin to support energy.',
    meridians: ['ST', 'CV', 'GV', 'SP'],
  },
  {
    keywords: ['back pain', 'lower back', 'lumbar', 'lumbar pain', 'backache'],
    points: ['GV4', 'CV6'],
    reasoning:
      'Lower back pain in TCM is often attributed to Kidney deficiency (especially Kidney Yang) or local Qi-Blood stagnation. GV4 (Ming Men) directly tonifies Kidney Yang and warms the lower back; CV6 supplements Yuan Qi and supports Kidney function.',
    meridians: ['GV', 'CV'],
  },
  {
    keywords: ['cold', 'flu', 'fever', 'common cold', 'sore throat', 'cough', 'runny nose', 'congestion'],
    points: ['LI4', 'LI20', 'GV14', 'LI11'],
    reasoning:
      'Exterior invasions (Wind-Cold or Wind-Heat) are treated by expelling the pathogen and supporting Wei Qi. LI4 disperses Wind and boosts Wei Qi; LI20 opens the nose; GV14 releases the exterior and clears heat from all Yang channels; LI11 clears heat when Wind-Heat predominates.',
    meridians: ['LI', 'GV'],
  },
  {
    keywords: ['menstrual', 'period pain', 'dysmenorrhoea', 'pms', 'irregular period', 'period'],
    points: ['SP6', 'LV3', 'SP10', 'CV6'],
    reasoning:
      'Menstrual disorders reflect Liver Qi stagnation, Blood stasis, or Spleen Blood deficiency. SP6 regulates Yin and moves Blood in the lower Jiao; LV3 moves Liver Qi stagnation; SP10 invigorates Blood and resolves stasis; CV6 supplements fundamental Qi and Blood.',
    meridians: ['SP', 'LV', 'CV'],
  },
  {
    keywords: ['skin', 'eczema', 'itching', 'rash', 'urticaria', 'hives'],
    points: ['LI11', 'SP10', 'LI4'],
    reasoning:
      'Skin disorders are associated with Wind, Damp-Heat, or Blood heat in TCM. LI11 clears heat from the Blood and drains Damp-Heat; SP10 cools Blood heat and eliminates pathogenic factors; LI4 expels Wind and relieves itching.',
    meridians: ['LI', 'SP'],
  },
  {
    keywords: ['dizziness', 'vertigo', 'lightheaded', 'dizzy'],
    points: ['GV20', 'LV3', 'ST36'],
    reasoning:
      'Dizziness may stem from Liver Yang rising, Blood deficiency, or Phlegm-Damp obstructing the head. GV20 calms Liver Yang and clears the head; LV3 descends rising Yang; ST36 supports the production of Blood and Qi to nourish the head.',
    meridians: ['GV', 'LV', 'ST'],
  },
  {
    keywords: ['knee pain', 'knee', 'joint pain'],
    points: ['ST36', 'SP10', 'LV8'],
    reasoning:
      'Knee pain involves local Qi-Blood stagnation and Bi (painful obstruction) syndrome. ST36 strengthens local tissue and tonifies Qi; SP10 moves Blood stasis around the knee; LV8 tonifies Liver (which governs sinews) and is the He-Sea point at the knee.',
    meridians: ['ST', 'SP', 'LV'],
  },
]
