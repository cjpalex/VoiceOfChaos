const V1 = 'https://github.com/cjpalex/VoiceOfChaos/releases/download/v1.0.0';
const V2 = 'https://github.com/cjpalex/VoiceOfChaos/releases/download/v1.0.1';
const V3 = 'https://github.com/cjpalex/VoiceOfChaos/releases/download/v1.0.2';

const define = (id, section, era, title, file, tag = V3) => ({
  id,
  section,
  era,
  title,
  file,
  audio: `${tag}/${file}`,
  artwork: `/artwork/${file.replace('.mp3', '.jpg')}`,
});

export const GROUP_ARTWORK = {
  'The Imperium':           '/artwork/imperium.jpg',
  'Orks':                   '/artwork/orks.jpg',
  'Eldar Craftworlders':    '/artwork/eldar.jpg',
  'Dark Eldar':             '/artwork/dark_eldar.jpg',
  'Necrons':                '/artwork/necron.jpg',
  'Tyranids':               '/artwork/tyranids.jpg',
  'Chaos Space Marines':    '/artwork/chaos_space_marine.jpg',
  'Space Marines Loyalists':'/artwork/space_marine_loyalists.jpg',
  'Blood Angels':           '/artwork/blood_angels.jpg',
  'Dark Angels':            '/artwork/dark_angels.jpg',
  'Space Wolves':           '/artwork/space_wolves.jpg',
  'Grey Knights':           '/artwork/gre_knights.jpg',
  'Sisters of Battle':      '/artwork/sisters_of_battle.jpg',
  'Tau':                    '/artwork/tau.jpg',
  'Adeptus Mechanicus':     '/artwork/adeptus.jpg',
  'Inquisition':            '/artwork/inquisition.jpg',
  'Astra Militarum':        '/artwork/astra_militarum.jpg',
  'Harlequins':             '/artwork/harlequinns.jpg',
  'Leagues of Votann':      '/artwork/leagues_votan.jpg',
  'Genestealer Cults':      '/artwork/genestealers.jpg',
  'Khorne':                 '/artwork/khorne.jpg',
  'Nurgle':                 '/artwork/nurgle.jpg',
  'Tzeentch':               '/artwork/tzeentch.jpg',
  'Slaanesh':               '/artwork/slaanesh.jpg',
};

export const GROUP_BG = {
  'The Imperium':         '/artwork/bg_imperium.png',
  'Orks':             '/artwork/bg_orks.png',
  'Sisters of Battle':'/artwork/bg_battle_sisters.png',
  'Tyranids':         '/artwork/bg_tyranids.png',
  'Eldar Craftworlders':         '/artwork/bg_eldar.png',
};

export function getGroupKey(ch) {
  return ch.section === 'The Imperium' ? 'The Imperium' : ch.era;
}

export const chapters = [
  // ── THE IMPERIUM ──────────────────────────────────────────────────────────

  // Age of Terra
  define(1,  "The Imperium", "Age of Terra",        "Dawn of Humanity",           "01-dawn-of-humanity.mp3",           V1),
  define(2,  "The Imperium", "Age of Terra",        "The Dark Age of Technology", "02-dark-age-of-technology.mp3",     V1),
  define(3,  "The Imperium", "Age of Terra",        "The Age of Strife",          "03-age-of-strife.mp3",              V1),

  // Rise of the Emperor
  define(4,  "The Imperium", "Rise of the Emperor", "The Emperor Revealed",       "04-emperor-revealed.mp3",           V1),
  define(5,  "The Imperium", "Rise of the Emperor", "The Unification Wars",       "05-unification-wars.mp3",           V2),

  // Great Crusade
  define(6,  "The Imperium", "Great Crusade",       "The Primarchs: Origins",     "06-primarchs-origins.mp3",          V2),
  define(7,  "The Imperium", "Great Crusade",       "The Legiones Astartes",      "07-legiones-astartes.mp3",          V2),
  define(8,  "The Imperium", "Great Crusade",       "The Great Crusade",          "08-great-crusade.mp3",              V2),
  define(9,  "The Imperium", "Great Crusade",       "Horus: The Beloved Son",     "09-horus-beloved-son.mp3",          V2),

  // Horus Heresy
  define(10, "The Imperium", "Horus Heresy",        "The Seeds of Heresy",        "10-seeds-of-heresy.mp3",            V2),
  define(11, "The Imperium", "Horus Heresy",        "The Dropsite Massacre",      "11-dropsite-massacre.mp3",          V2),
  define(12, "The Imperium", "Horus Heresy",        "The Siege of Terra",         "12-siege-of-terra.mp3",             V2),
  define(13, "The Imperium", "Horus Heresy",        "The Death of Horus",         "13-death-of-horus.mp3",             V2),

  // Age of Imperium
  define(14, "The Imperium", "Age of Imperium",     "The Golden Throne",          "14-golden-throne.mp3",              V2),
  define(15, "The Imperium", "Age of Imperium",     "The Holy Inquisition",       "15-holy-inquisition.mp3",           V1),

  // 41st Millennium
  define(16, "The Imperium", "41st Millennium",     "The Galaxy at War",          "16-galaxy-at-war.mp3",              V1),

  // ── MAIN RACES ────────────────────────────────────────────────────────────

  // Orks
  define(17, "Main Races", "Orks", "The Krork — Born for War",                    "17-the-krork-born-for-war.mp3"),
  define(18, "Main Races", "Orks", "The Waaagh! — The Ork Psyche",               "18-the-waaagh-the-ork-psyche.mp3"),
  define(19, "Main Races", "Orks", "The Great Warbosses — Legendary Figures",    "19-the-great-warbosses.mp3"),
  define(20, "Main Races", "Orks", "The Orks vs The Imperium — A Million Years of War", "20-orks-vs-the-imperium.mp3"),
  define(21, "Main Races", "Orks", "The Green Menace — The State of the Orks Today", "21-the-green-menace.mp3"),

  // Eldar Craftworlders
  define(22, "Main Races", "Eldar Craftworlders", "The Golden Age — The Eldar Civilization", "22-the-golden-age-eldar.mp3"),
  define(23, "Main Races", "Eldar Craftworlders", "The Fall — The Birth of Slaanesh",        "23-the-fall-birth-of-slaanesh.mp3"),
  define(24, "Main Races", "Eldar Craftworlders", "The Craftworlds — Refuges in the Void",   "24-the-craftworlds.mp3"),
  define(25, "Main Races", "Eldar Craftworlders", "The Path — Culture and Philosophy",        "25-the-path-culture-and-philosophy.mp3"),
  define(26, "Main Races", "Eldar Craftworlders", "The Eldar Today — Survival of a Dying Race", "26-the-eldar-today.mp3"),

  // Dark Eldar
  define(27, "Main Races", "Dark Eldar", "Commorragh — The City of Shadows",     "27-commorragh-city-of-shadows.mp3"),
  define(28, "Main Races", "Dark Eldar", "The Kabals — Politics and Power",       "28-the-kabals-politics-and-power.mp3"),
  define(29, "Main Races", "Dark Eldar", "Cruelty as Survival — Why They Torture", "29-cruelty-as-survival.mp3"),
  define(30, "Main Races", "Dark Eldar", "The Raiders — Incursions Across the Galaxy", "30-the-raiders-incursions.mp3"),

  // Necrons
  define(31, "Main Races", "Necrons", "The Necrontyr — Before the Biotransference", "31-the-necrontyr.mp3"),
  define(32, "Main Races", "Necrons", "The War in Heaven — Against the Old Ones",   "32-the-war-in-heaven.mp3"),
  define(33, "Main Races", "Necrons", "The Great Betrayal — The C'tan and the Harvest", "33-the-great-betrayal.mp3"),
  define(34, "Main Races", "Necrons", "The Great Sleep — 60 Million Years of Slumber", "34-the-great-sleep.mp3"),
  define(35, "Main Races", "Necrons", "The Awakening — The Necrons Today",            "35-the-awakening-necrons-today.mp3"),

  // Tyranids
  define(36, "Main Races", "Tyranids", "The Shadow in the Warp — Extragalactic Origins", "36-shadow-in-the-warp.mp3"),
  define(37, "Main Races", "Tyranids", "The Hive — How a Hive Fleet Works",              "37-the-hive-how-a-hive-fleet-works.mp3"),
  define(38, "Main Races", "Tyranids", "The First Waves — Behemoth, Kraken, and Leviathan", "38-the-first-waves.mp3"),
  define(39, "Main Races", "Tyranids", "The Tyranid Wars — Major Battles",               "39-the-tyranid-wars.mp3"),
  define(40, "Main Races", "Tyranids", "The Ultimate Threat — Can They Be Stopped?",     "40-the-ultimate-threat.mp3"),

  // Chaos Space Marines
  define(41, "Main Races", "Chaos Space Marines", "The Betrayal of Horus — The Seed of Chaos",  "41-the-betrayal-of-horus.mp3"),
  define(42, "Main Races", "Chaos Space Marines", "The Eye of Terror — Refuge of the Renegades", "42-the-eye-of-terror.mp3"),
  define(43, "Main Races", "Chaos Space Marines", "The Legions of Chaos — The Legendary Traitors", "43-the-legions-of-chaos.mp3"),
  define(44, "Main Races", "Chaos Space Marines", "The Champions of Chaos — Ascension and Damnation", "44-the-champions-of-chaos.mp3"),
  define(45, "Main Races", "Chaos Space Marines", "The Black Crusades — Abaddon and His Wars",   "45-the-black-crusades.mp3"),

  // ── FACTIONS ──────────────────────────────────────────────────────────────

  define(46, "Factions", "Space Marines Loyalists", "Sons of the Emperor",             "46-space-marines-loyalists.mp3"),
  define(47, "Factions", "Blood Angels",            "The Blood Thirst and the Black Rage", "47-blood-angels.mp3"),
  define(48, "Factions", "Dark Angels",             "The Impenetrable Secret",         "48-dark-angels.mp3"),
  define(49, "Factions", "Space Wolves",            "The Wolves of Fenris",            "49-space-wolves.mp3"),
  define(50, "Factions", "Grey Knights",            "The Guardians Against the Daemon","50-grey-knights.mp3"),
  define(51, "Factions", "Sisters of Battle",       "Faith as Armor",                  "51-sisters-of-battle.mp3"),
  define(52, "Factions", "Tau",                     "The Empire of the Greater Good",  "52-tau.mp3"),
  define(53, "Factions", "Adeptus Mechanicus",      "The Cult of the Machine",         "53-adeptus-mechanicus.mp3"),
  define(54, "Factions", "Inquisition",             "Nobody Expects the Inquisition",  "54-inquisition.mp3"),
  define(55, "Factions", "Astra Militarum",         "The Strength of Humanity",        "55-astra-militarum.mp3"),
  define(56, "Factions", "Harlequins",              "The Dancers of Death",            "56-harlequins.mp3"),
  define(57, "Factions", "Leagues of Votann",       "The Ancestors Return",            "57-leagues-of-votann.mp3"),
  define(58, "Factions", "Genestealer Cults",       "The Infection Within",            "58-genestealer-cults.mp3"),
  define(59, "Factions", "Khorne",                  "The God of Blood and War",        "59-khorne.mp3"),
  define(60, "Factions", "Nurgle",                  "The Father of Pestilence",        "60-nurgle.mp3"),
  define(61, "Factions", "Tzeentch",                "The Master of Change",            "61-tzeentch.mp3"),
  define(62, "Factions", "Slaanesh",                "Excess and Pain",                 "62-slaanesh.mp3"),
];
