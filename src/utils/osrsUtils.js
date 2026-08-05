// OSRS Experience Table generation (up to Level 126 for Virtual Levels)
export function getXpForLevel(level) {
  let points = 0;
  let output = 0;

  for (let lvl = 1; lvl < level; lvl++) {
    points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
    output = Math.floor(points / 4);
  }

  return output;
}

// Pre-calculate XP table for levels 1 to 126
export const XP_TABLE = Array.from({ length: 127 }, (_, lvl) => (lvl === 0 ? 0 : getXpForLevel(lvl)));

export function getLevelFromXp(xp) {
  if (!xp || xp < 0) return 1;
  for (let lvl = 126; lvl >= 1; lvl--) {
    if (xp >= XP_TABLE[lvl]) {
      return lvl;
    }
  }
  return 1;
}

export function getSkillProgress(xp, realLevel) {
  const currentXp = Math.max(0, xp || 0);
  const realLvl = realLevel || getLevelFromXp(currentXp);
  const virtualLvl = getLevelFromXp(currentXp);

  const isMax99 = realLvl >= 99;
  const targetLevel = isMax99 ? 99 : realLvl + 1;
  
  const prevLevelXp = XP_TABLE[realLvl] || 0;
  const nextLevelXp = isMax99 ? XP_TABLE[99] : (XP_TABLE[realLvl + 1] || 13034431);

  let progressPercent = 100;
  let xpRemainingToNext = 0;

  if (!isMax99) {
    const range = nextLevelXp - prevLevelXp;
    const gained = currentXp - prevLevelXp;
    progressPercent = Math.min(100, Math.max(0, (gained / range) * 100));
    xpRemainingToNext = nextLevelXp - currentXp;
  }

  const xpRemainingTo99 = Math.max(0, 13034431 - currentXp);
  const xpRemainingTo200m = Math.max(0, 200000000 - currentXp);

  return {
    currentLevel: realLvl,
    virtualLevel: virtualLvl,
    currentXp,
    prevLevelXp,
    nextLevelXp,
    progressPercent,
    xpRemainingToNext,
    xpRemainingTo99,
    xpRemainingTo200m,
    isMax99
  };
}

export function calculateCombatDetails(stats) {
  if (!stats) return { combatLevel: 3, base: 2.5, melee: 0, ranged: 0, magic: 0, maxStyle: 'Melee' };

  const atk = stats.Attack?.real_level || 1;
  const str = stats.Strength?.real_level || 1;
  const def = stats.Defence?.real_level || 1;
  const hp = stats.Hitpoints?.real_level || 10;
  const pray = stats.Prayer?.real_level || 1;
  const range = stats.Ranged?.real_level || 1;
  const mage = stats.Magic?.real_level || 1;

  const base = 0.25 * (def + hp + Math.floor(pray / 2));
  const melee = 0.325 * (atk + str);
  const ranged = 0.325 * Math.floor(3 * range / 2);
  const magic = 0.325 * Math.floor(3 * mage / 2);

  const maxOffense = Math.max(melee, ranged, magic);
  const combatLevel = Math.floor(base + maxOffense);

  let maxStyle = 'Melee';
  if (ranged > melee && ranged >= magic) maxStyle = 'Ranged';
  else if (magic > melee && magic > ranged) maxStyle = 'Magic';

  return {
    combatLevel,
    base: base.toFixed(2),
    melee: melee.toFixed(2),
    ranged: ranged.toFixed(2),
    magic: magic.toFixed(2),
    maxStyle,
    atk, str, def, hp, pray, range, mage
  };
}

export const OSRS_SKILLS = [
  { name: 'Attack', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Attack_icon.png' },
  { name: 'Hitpoints', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Hitpoints_icon.png' },
  { name: 'Mining', category: 'gathering', icon: 'https://oldschool.runescape.wiki/images/Mining_icon.png' },
  { name: 'Strength', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Strength_icon.png' },
  { name: 'Agility', category: 'support', icon: 'https://oldschool.runescape.wiki/images/Agility_icon.png' },
  { name: 'Smithing', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Smithing_icon.png' },
  { name: 'Defence', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Defence_icon.png' },
  { name: 'Herblore', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Herblore_icon.png' },
  { name: 'Fishing', category: 'gathering', icon: 'https://oldschool.runescape.wiki/images/Fishing_icon.png' },
  { name: 'Ranged', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Ranged_icon.png' },
  { name: 'Thieving', category: 'support', icon: 'https://oldschool.runescape.wiki/images/Thieving_icon.png' },
  { name: 'Cooking', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Cooking_icon.png' },
  { name: 'Prayer', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Prayer_icon.png' },
  { name: 'Crafting', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Crafting_icon.png' },
  { name: 'Firemaking', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Firemaking_icon.png' },
  { name: 'Magic', category: 'combat', icon: 'https://oldschool.runescape.wiki/images/Magic_icon.png' },
  { name: 'Fletching', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Fletching_icon.png' },
  { name: 'Woodcutting', category: 'gathering', icon: 'https://oldschool.runescape.wiki/images/Woodcutting_icon.png' },
  { name: 'Runecraft', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Runecraft_icon.png' },
  { name: 'Slayer', category: 'support', icon: 'https://oldschool.runescape.wiki/images/Slayer_icon.png' },
  { name: 'Farming', category: 'gathering', icon: 'https://oldschool.runescape.wiki/images/Farming_icon.png' },
  { name: 'Construction', category: 'artisan', icon: 'https://oldschool.runescape.wiki/images/Construction_icon.png' },
  { name: 'Hunter', category: 'gathering', icon: 'https://oldschool.runescape.wiki/images/Hunter_icon.png' },
  { name: 'Sailing', category: 'support', icon: 'https://oldschool.runescape.wiki/images/Sailing_icon.png' }
];

export const EQUIPMENT_SLOTS = [
  { slot: 0, name: 'Head', placeholderIcon: 'https://oldschool.runescape.wiki/images/Head_slot.png' },
  { slot: 1, name: 'Cape', placeholderIcon: 'https://oldschool.runescape.wiki/images/Cape_slot.png' },
  { slot: 2, name: 'Neck', placeholderIcon: 'https://oldschool.runescape.wiki/images/Neck_slot.png' },
  { slot: 3, name: 'Weapon', placeholderIcon: 'https://oldschool.runescape.wiki/images/Weapon_slot.png' },
  { slot: 4, name: 'Torso', placeholderIcon: 'https://oldschool.runescape.wiki/images/Body_slot.png' },
  { slot: 5, name: 'Shield', placeholderIcon: 'https://oldschool.runescape.wiki/images/Shield_slot.png' },
  { slot: 7, name: 'Legs', placeholderIcon: 'https://oldschool.runescape.wiki/images/Legs_slot.png' },
  { slot: 9, name: 'Hands', placeholderIcon: 'https://oldschool.runescape.wiki/images/Hands_slot.png' },
  { slot: 10, name: 'Feet', placeholderIcon: 'https://oldschool.runescape.wiki/images/Feet_slot.png' },
  { slot: 12, name: 'Ring', placeholderIcon: 'https://oldschool.runescape.wiki/images/Ring_slot.png' },
  { slot: 13, name: 'Ammo', placeholderIcon: 'https://oldschool.runescape.wiki/images/Ammo_slot.png' }
];

export function getItemIconUrl(itemId) {
  if (!itemId || itemId < 0) return null;
  return `https://static.runelite.net/cache/item/icon/${itemId}.png`;
}

export function formatQuantity(num) {
  if (!num || num === 0) return '0';
  if (num >= 10000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 100000) return Math.floor(num / 1000) + 'K';
  if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}

export function getWikiUrl(pageName) {
  if (!pageName) return 'https://oldschool.runescape.wiki/';
  const formatted = encodeURIComponent(pageName.trim().replace(/ /g, '_'));
  return `https://oldschool.runescape.wiki/w/${formatted}`;
}

export function getWikiSearchUrl(query) {
  if (!query) return 'https://oldschool.runescape.wiki/';
  return `https://oldschool.runescape.wiki/w/Special:Search?search=${encodeURIComponent(query.trim())}`;
}

