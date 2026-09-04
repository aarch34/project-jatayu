/**
 * PROJECT JATAYU 3.0 — THE VULTURE CHALLENGE
 * Scientifically verified question bank across 3 progressive levels.
 */

export const QUIZ_LEVELS = [
  {
    id: 1,
    code: 'LEVEL 01',
    title: 'CURIOUS',
    subtitle: 'Start with the basics.',
    difficulty: 'EASY',
    pointsPerQuestion: 10,
    maxPoints: 50,
    unlockMessage: "You've taken your first step into the world of vultures.",
  },
  {
    id: 2,
    code: 'LEVEL 02',
    title: 'EXPLORER',
    subtitle: 'Dig deeper into the world of vultures.',
    difficulty: 'MEDIUM',
    pointsPerQuestion: 20,
    maxPoints: 100,
    unlockMessage: "You're getting closer to becoming a Guardian of the Skies.",
  },
  {
    id: 3,
    code: 'LEVEL 03',
    title: 'GUARDIAN',
    subtitle: 'Only true conservation guardians reach this level.',
    difficulty: 'DIFFICULT',
    pointsPerQuestion: 30,
    maxPoints: 150,
    unlockMessage: "Challenge complete.",
  },
];

export const RAW_QUESTIONS = [
  // =========================================================================
  // LEVEL 1: EASY (5 Questions — 10 Pts Each)
  // =========================================================================
  {
    id: 'q1',
    level: 1,
    question: 'What primary ecological role do vultures perform in natural ecosystems?',
    options: [
      'Active predators hunting live mammals',
      'Nature’s scavengers clearing dead animal carcasses',
      'Plant pollinators and seed dispersers',
      'Insectivores controlling agricultural pests',
    ],
    correctIndex: 1, // Nature's scavengers
  },
  {
    id: 'q2',
    level: 1,
    question: 'Why is a vulture’s unfeathered (bare) head an important physical adaptation?',
    options: [
      'It helps regulate body temperature in freezing wind',
      'It prevents blood and bacteria from clinging while feeding inside carcasses',
      'It allows them to fly at higher aerodynamic speeds',
      'It absorbs solar energy directly into their skull',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    level: 1,
    question: 'What property of a vulture’s stomach acid enables them to safely consume rotting meat?',
    options: [
      'High alkaline pH level (pH 11.0)',
      'Multi-chamber digestive pouch like cattle',
      'Extremely acidic gastric fluid (pH ~1.0) that destroys Anthrax and Cholera pathogens',
      'Specialized plant enzymes that digest cellulose',
    ],
    correctIndex: 2,
  },
  {
    id: 'q4',
    level: 1,
    question: 'Vultures can soar effortlessly for hours without flapping their wings. How do they do this?',
    options: [
      'By riding rising columns of warm air called thermal updrafts',
      'By flapping their tail feathers at rapid frequencies',
      'By resting periodically on high cloud formations',
      'By releasing stored air pressure from their wing joints',
    ],
    correctIndex: 0,
  },
  {
    id: 'q5',
    level: 1,
    question: 'How do vultures directly protect human health and rural communities?',
    options: [
      'By increasing soil humidity around farmlands',
      'By rapidly disposing of dead animals, curbing deadly bacterial spread and feral dog booms',
      'By sounding vocal alarms when predators approach villages',
      'By clearing dense forest undergrowth',
    ],
    correctIndex: 1,
  },

  // =========================================================================
  // LEVEL 2: MEDIUM (5 Questions — 20 Pts Each)
  // =========================================================================
  {
    id: 'q6',
    level: 2,
    question: 'What primary factor caused the catastrophic collapse of Gyps vultures across South Asia in the 1990s?',
    options: [
      'Widespread loss of cliff roosting sites',
      'Exposure to veterinary Diclofenac in livestock carcasses causing kidney failure and visceral gout',
      'Viral epidemic transmitted by wild ducks',
      'Commercial hunting for feathers',
    ],
    correctIndex: 1,
  },
  {
    id: 'q7',
    level: 2,
    question: 'What is Diclofenac, the substance that eliminated over 99% of India’s Gyps vultures?',
    options: [
      'A non-steroidal anti-inflammatory drug (NSAID) given to cattle for pain relief',
      'A chemical pesticide used on tea plantations',
      'A synthetic rodent poison used in grain storage',
      'An industrial heavy metal pollutant found in river water',
    ],
    correctIndex: 0,
  },
  {
    id: 'q8',
    level: 2,
    question: 'Which alternative anti-inflammatory drug has been scientifically validated as vulture-safe?',
    options: [
      'Aceclofenac',
      'Ketoprofen',
      'Meloxicam',
      'Nimesulide',
    ],
    correctIndex: 2,
  },
  {
    id: 'q9',
    level: 2,
    question: 'What is the main goal of Vulture Conservation Breeding Centres (VCBC) established in India?',
    options: [
      'To breed endangered vultures safely in captivity for eventual reintroduction into poison-free wild habitats',
      'To train vultures for domestic livestock protection',
      'To display vultures in city botanical gardens',
      'To monitor migratory birds using radar tracking',
    ],
    correctIndex: 0,
  },
  {
    id: 'q10',
    level: 2,
    question: 'What severe public health outcome followed the disappearance of vultures in India?',
    options: [
      'An explosion in feral dog populations leading to thousands of human rabies cases and estimated medical costs over $30 billion',
      'A drastic reduction in agricultural grain production',
      'A sharp increase in mosquito-borne malaria cases',
      'Uncontrolled growth of desert locust swarms',
    ],
    correctIndex: 0,
  },

  // =========================================================================
  // LEVEL 3: DIFFICULT (5 Questions — 30 Pts Each)
  // =========================================================================
  {
    id: 'q11',
    level: 3,
    question: 'Which three native Indian Gyps species are classified as Critically Endangered on the IUCN Red List?',
    options: [
      'White-rumped Vulture, Indian Vulture (Long-billed), and Slender-billed Vulture',
      'Egyptian Vulture, Himalayan Griffon, and Bearded Vulture',
      'Cinereous Vulture, Eurasian Griffon, and Red-headed Vulture',
      'King Vulture, Turkey Vulture, and Black Vulture',
    ],
    correctIndex: 0,
  },
  {
    id: 'q12',
    level: 3,
    question: 'Located near Ramanagara in Karnataka, what is India’s first sanctuary dedicated specifically to protecting Long-billed Vultures (*Gyps indicus*)?',
    options: [
      'Bandipur Tiger Reserve',
      'Ramadevara Betta Vulture Sanctuary',
      'Nagarhole National Park',
      'Bhadra Wildlife Sanctuary',
    ],
    correctIndex: 1,
  },
  {
    id: 'q13',
    level: 3,
    question: 'In vulture conservation policy, what defines a "Vulture-Safe Zone" (VSZ)?',
    options: [
      'An enclosed aviarium in a national park',
      'A targeted geographical area (~100 km radius) verified free of toxic NSAIDs like diclofenac so wild populations can safely forage',
      'A high-altitude airspace where drone flying is prohibited',
      'A specialized cliff zone with artificial nesting boxes',
    ],
    correctIndex: 1,
  },
  {
    id: 'q14',
    level: 3,
    question: 'In which year did the Government of India officially ban the veterinary use of Diclofenac?',
    options: [
      '1998',
      '2006',
      '2012',
      '2018',
    ],
    correctIndex: 1,
  },
  {
    id: 'q15',
    level: 3,
    question: 'In addition to Diclofenac, which other toxic veterinary NSAIDs were recently banned in India to accelerate vulture population recovery?',
    options: [
      'Aceclofenac and Ketoprofen',
      'Amoxicillin and Ampicillin',
      'Ibuprofen and Paracetamol',
      'Vitamin B-Complex and Calcium supplements',
    ],
    correctIndex: 0,
  },
];
