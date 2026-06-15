const define = (id, era, title, file) => ({
  id,
  era,
  title,
  file,
  audio: `/audio/${file}`,
  artwork: `/artwork/${file.replace('.mp3', '.jpg')}`,
});

export const chapters = [
  // Age of Terra
  define(1,  "Age of Terra",        "Dawn of Humanity",           "01-dawn-of-humanity.mp3"),
  define(2,  "Age of Terra",        "The Dark Age of Technology", "02-dark-age-of-technology.mp3"),
  define(3,  "Age of Terra",        "The Age of Strife",          "03-age-of-strife.mp3"),

  // Rise of the Emperor
  define(4,  "Rise of the Emperor", "The Emperor Revealed",       "04-emperor-revealed.mp3"),
  define(5,  "Rise of the Emperor", "The Unification Wars",       "05-unification-wars.mp3"),

  // Great Crusade
  define(6,  "Great Crusade",       "The Primarchs: Origins",     "06-primarchs-origins.mp3"),
  define(7,  "Great Crusade",       "The Legiones Astartes",      "07-legiones-astartes.mp3"),
  define(8,  "Great Crusade",       "The Great Crusade",          "08-great-crusade.mp3"),
  define(9,  "Great Crusade",       "Horus: The Beloved Son",     "09-horus-beloved-son.mp3"),

  // Horus Heresy
  define(10, "Horus Heresy",        "The Seeds of Heresy",        "10-seeds-of-heresy.mp3"),
  define(11, "Horus Heresy",        "The Dropsite Massacre",      "11-dropsite-massacre.mp3"),
  define(12, "Horus Heresy",        "The Siege of Terra",         "12-siege-of-terra.mp3"),
  define(13, "Horus Heresy",        "The Death of Horus",         "13-death-of-horus.mp3"),

  // Age of Imperium
  define(14, "Age of Imperium",     "The Golden Throne",          "14-golden-throne.mp3"),
  define(15, "Age of Imperium",     "The Holy Inquisition",       "15-holy-inquisition.mp3"),

  // 41st Millennium
  define(16, "41st Millennium",     "The Galaxy at War",          "16-galaxy-at-war.mp3"),
];
