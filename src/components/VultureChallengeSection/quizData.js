/**
 * PROJECT JATAYU 3.0 — THE VULTURE CHALLENGE (COLLEGE COMPETITION EDITION)
 * 15 Scientifically verified, college-level scenario questions across 3 rounds.
 */

export const QUIZ_LEVELS = [
  {
    id: 1,
    code: 'ROUND 01',
    title: 'VULTURE 101',
    subtitle: 'Establish your baseline in vulture ecology & physiology.',
    difficulty: 'MODERATE',
    timeLimitSeconds: 20,
    pointsPerQuestion: 10,
    maxPoints: 50,
    unlockMessage: 'Baseline verified. Now step up to ecosystem-level science.',
  },
  {
    id: 2,
    code: 'ROUND 02',
    title: 'THE ECOLOGIST',
    subtitle: 'Analyze trophic cascades, veterinary toxicology & habitat threats.',
    difficulty: 'HARD',
    timeLimitSeconds: 25,
    pointsPerQuestion: 20,
    maxPoints: 100,
    unlockMessage: 'Exceptional analysis. Only true conservation guardians conquer Round 3.',
  },
  {
    id: 3,
    code: 'ROUND 03',
    title: 'THE GUARDIAN',
    subtitle: 'Master species conservation, policy, VSZ management & recovery.',
    difficulty: 'VERY HARD',
    timeLimitSeconds: 30,
    pointsPerQuestion: 30,
    maxPoints: 150,
    unlockMessage: 'Competition complete. Your score and time determine your position.',
  },
];

export const RAW_QUESTIONS = [
  // =========================================================================
  // ROUND 1: VULTURE 101 (Moderate — 20s per question — 10 Pts Each)
  // =========================================================================
  {
    id: 'q1',
    level: 1,
    question:
      'A fallen livestock carcass in an endemic anthrax zone is consumed by Old World vultures. Which physiological mechanism enables them to neutralize deadly bacterial endospores like Bacillus anthracis during digestion?',
    options: [
      'Highly alkaline pancreatic secretions (pH ~10.5) that denature bacterial capsular proteins',
      'Extremely acidic gastric juices (pH 1.0–2.0) coupled with specialized gut microbiota that eliminate pathogenic endospores',
      'High core body temperature (44°C) that thermally sterilizes ingested tissues in the crop',
      'Enzymatic secretion of lysozymes in saliva prior to swallowing carcass tissues',
    ],
    correctIndex: 1,
  },
  {
    id: 'q2',
    level: 1,
    question:
      'Vultures routinely travel hundreds of kilometers daily with minimal metabolic energy expenditure. Which biophysical mechanism describes their primary flight mode across open landscapes?',
    options: [
      'Continuous dynamic soaring utilizing horizontal wind speed gradients over ocean waves',
      'Static thermal soaring by circling within localized convective heat columns and gliding between updrafts',
      'Powered flapping flight utilizing high-frequency muscle contractions of the pectoralis major',
      'Flap-gliding powered by intermittent anaerobic burst mechanics during low-altitude transit',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    level: 1,
    question:
      'Old World Gyps vultures exhibit unfeathered (bare) heads and necks. Beyond thermoregulation, what is the primary evolutionary advantage of this anatomical trait during carcass feeding?',
    options: [
      'Reducing aerodynamic drag during high-speed vertical dives from thermal altitudes',
      'Preventing visceral fluids and microbial debris from adhering to feathers, facilitating easy solar UV decontamination',
      'Enhancing acoustic sensitivity when listening for subterranean insect activity',
      'Allowing direct absorption of vitamin D3 through cutaneous exposure to sunlight',
    ],
    correctIndex: 1,
  },
  {
    id: 'q4',
    level: 1,
    question:
      'During the late 1990s, millions of Gyps vultures across the Indian subcontinent died rapidly following exposure to Diclofenac. What is the specific pathological mechanism causing death in affected birds?',
    options: [
      'Inhibition of renal prostaglandin synthesis leading to severe ischemia, hyperuricemia, and extensive visceral gout',
      'Disruption of neural acetylcholine esterase causing systemic neuromuscular paralysis',
      'Degradation of hemoglobin binding sites leading to acute respiratory hypoxia',
      'Suppression of hepatic glycogen storage resulting in fatal hypoglycemic shock',
    ],
    correctIndex: 0,
  },
  {
    id: 'q5',
    level: 1,
    question:
      'When vulture populations in India collapsed by over 99%, feral dog populations expanded exponentially at carcass sites. Which public health crisis was most directly linked to this scavenger shift?',
    options: [
      'A widespread outbreak of tick-borne Lyme disease among agricultural workers',
      'A dramatic spike in human Rabies transmission causing an estimated 48,000 excess human deaths',
      'A surge in Avian Influenza (H5N1) spread via contaminated water bodies',
      'An epidemic of waterborne Cholera stemming from unconsumed agricultural waste',
    ],
    correctIndex: 1,
  },

  // =========================================================================
  // ROUND 2: THE ECOLOGIST (Hard — 25s per question — 20 Pts Each)
  // =========================================================================
  {
    id: 'q6',
    level: 2,
    question:
      'In an ecosystem where obligate scavengers (vultures) are functionally extinct, facultative scavengers (such as feral dogs and rats) increase in density. How does this shift alter carcass breakdown rates and disease dynamics?',
    options: [
      'Carcasses decompose faster because mammalian scavengers bury leftover bones in soil',
      'Carcass consumption slows down, increasing pathogen persistence and expanding vector breeding grounds around human settlements',
      'Microbial decomposition ceases completely because mammalian scavengers sterilize the feeding site',
      'Soil nitrogen availability decreases permanently due to reduced bone mineral weathering',
    ],
    correctIndex: 1,
  },
  {
    id: 'q7',
    level: 2,
    question:
      'Following the 2006 ban on veterinary Diclofenac in India, conservation scientists sought vulture-safe non-steroidal anti-inflammatory drugs (NSAIDs). Which alternative drug was confirmed safe through safety trials on Gyps vultures?',
    options: [
      'Ketoprofen',
      'Aceclofenac',
      'Meloxicam',
      'Nimesulide',
    ],
    correctIndex: 2,
  },
  {
    id: 'q8',
    level: 2,
    question:
      'Aceclofenac is also banned for veterinary use in India despite not being directly toxic to vultures in its original chemical form. Why is Aceclofenac considered equally fatal to Gyps species?',
    options: [
      'It rapidly metabolizes into Diclofenac inside the mammalian liver and bloodstream after administration',
      'It binds permanently to avian cardiac receptors, causing sudden arrhythmia',
      'It reacts with stomach acid to form insoluble crystalline calcium oxalates',
      'It selectively inhibits pulmonary respiration in high-altitude soaring birds',
    ],
    correctIndex: 0,
  },
  {
    id: 'q9',
    level: 2,
    question:
      'Vulture Conservation Breeding Centres (VCBC) in India utilize "double-clutching" techniques to accelerate population recovery. How does this captive breeding method function?',
    options: [
      'Pairing one male vulture with two females simultaneously to double egg output',
      'Removing the first laid egg to artificial incubators, inducing the female to lay a second replacement egg in the same breeding season',
      'Inducing hormone-stimulated egg production four times per calendar year',
      'Cross-fostering wild eggs into nests of migratory eagle species',
    ],
    correctIndex: 1,
  },
  {
    id: 'q10',
    level: 2,
    question:
      'Indian Vultures (Gyps indicus) primarily roost and nest on steep rocky cliff faces, whereas White-rumped Vultures (Gyps bengalensis) nest in tall tree canopies (such as Arjuna and Banyan). If a region undergoes heavy tree deforestation without cliff disruption, which species faces the most immediate nest-site habitat loss?',
    options: [
      'Gyps indicus (Indian Vulture)',
      'Gyps bengalensis (White-rumped Vulture)',
      'Both species suffer identical nesting site loss',
      'Neither species, as both exclusively nest on artificial utility pylons',
    ],
    correctIndex: 1,
  },

  // =========================================================================
  // ROUND 3: THE GUARDIAN (Very Hard — 30s per question — 30 Pts Each)
  // =========================================================================
  {
    id: 'q11',
    level: 3,
    question:
      'Which trio of Old World vulture species native to the Indian subcontinent is currently classified as "Critically Endangered" on the IUCN Red List due to catastrophic NSAID-induced declines?',
    options: [
      'White-rumped Vulture (Gyps bengalensis), Indian Vulture (Gyps indicus), and Slender-billed Vulture (Gyps tenuirostris)',
      'Egyptian Vulture (Neophron percnopterus), Himalayan Griffon (Gyps himalayensis), and Bearded Vulture (Gypaetus barbatus)',
      'Cinereous Vulture (Aegypius monachus), Eurasian Griffon (Gyps fulvus), and Red-headed Vulture (Sarcogyps calvus)',
      'King Vulture (Sarcoramphus papa), Turkey Vulture (Cathartes aura), and Black Vulture (Coragyps atratus)',
    ],
    correctIndex: 0,
  },
  {
    id: 'q12',
    level: 3,
    question:
      'Established in 2012 in Karnataka’s Ramanagara district, Ramadevara Betta Vulture Sanctuary is India’s first protected area dedicated specifically to which Critically Endangered species?',
    options: [
      'Red-headed Vulture (Sarcogyps calvus)',
      'Long-billed / Indian Vulture (Gyps indicus)',
      'Bearded Vulture / Lammergeier (Gypaetus barbatus)',
      'Egyptian Vulture (Neophron percnopterus)',
    ],
    correctIndex: 1,
  },
  {
    id: 'q13',
    level: 3,
    question:
      'In landscape-scale conservation, a designated "Vulture-Safe Zone" (VSZ) aims to eliminate toxic veterinary NSAIDs around breeding colonies. What is the target operational radius for a functional VSZ based on vulture foraging range?',
    options: [
      '10 kilometers around the central nesting colony',
      '100 kilometers around the central nesting colony',
      '500 kilometers spanning multiple state borders',
      '1,500 kilometers covering entire continental flight corridors',
    ],
    correctIndex: 1,
  },
  {
    id: 'q14',
    level: 3,
    question:
      'Following the landmark 2006 ban on veterinary Diclofenac, the Ministry of Health and Family Welfare (Government of India) issued additional gazette bans in 2023 against which two toxic NSAIDs to protect vulture recovery?',
    options: [
      'Aceclofenac and Ketoprofen',
      'Paracetamol and Ibuprofen',
      'Flunixin and Carprofen',
      'Aspirin and Naproxen',
    ],
    correctIndex: 0,
  },
  {
    id: 'q15',
    level: 3,
    question:
      'While Gyps vultures consume soft organ tissues and muscle, the Bearded Vulture (Gypaetus barbatus) occupies a unique ecological niche. What specialized food source accounts for over 85% of its diet?',
    options: [
      'Fresh fish caught from high-altitude glacial lakes',
      'Intact animal bones, which it swallows whole or drops onto rocks from soaring heights to fracture for marrow access',
      'Subterranean termite larvae harvested using specialized beak probes',
      'Pine seeds and evergreen tree sap during winter months',
    ],
    correctIndex: 1,
  },
];
