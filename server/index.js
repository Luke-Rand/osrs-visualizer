import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';


import os from 'os';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DEFAULT_CHAR_DIR = path.join(os.homedir(), '.runelite', 'character-exporter');

function getCharacterDir() {
  const envDir = process.env.OSRS_CHAR_DIR;
  if (envDir && fs.existsSync(envDir)) return envDir;
  return DEFAULT_CHAR_DIR;
}

// Calculate OSRS Combat Level server-side or helper
function calculateCombatLevel(stats) {
  if (!stats) return 3;
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
  return Math.floor(base + maxOffense);
}

function calculateTotalLevel(stats) {
  if (!stats) return 0;
  return Object.values(stats).reduce((acc, curr) => acc + (curr.real_level || 0), 0);
}

function calculateTotalXp(stats) {
  if (!stats) return 0;
  return Object.values(stats).reduce((acc, curr) => acc + (curr.experience || 0), 0);
}

// Helper to safely read JSON
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return null;
}

// GET /api/accounts - List all character folders with high-level summaries
app.get('/api/accounts', (req, res) => {
  const baseDir = getCharacterDir();
  if (!fs.existsSync(baseDir)) {
    return res.json({ success: true, baseDir, accounts: [] });
  }

  try {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    const accounts = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const charDir = path.join(baseDir, entry.name);
        const charJson = readJsonFile(path.join(charDir, 'character.json'));
        const questsJson = readJsonFile(path.join(charDir, 'quests.json'));
        const diariesJson = readJsonFile(path.join(charDir, 'diaries.json'));
        const caJson = readJsonFile(path.join(charDir, 'combat_achievements.json'));
        const clogJson = readJsonFile(path.join(charDir, 'collection_log.json'));
        const bankJson = readJsonFile(path.join(charDir, 'bank.json'));
        const eqJson = readJsonFile(path.join(charDir, 'equipment.json'));

        const stats = charJson?.stats || null;
        const combatLevel = calculateCombatLevel(stats);
        const totalLevel = calculateTotalLevel(stats);
        const totalXp = calculateTotalXp(stats);

        // Find latest timestamp across files
        const files = ['character.json', 'bank.json', 'equipment.json', 'inventory.json', 'quests.json', 'diaries.json', 'combat_achievements.json', 'collection_log.json'];
        let lastUpdated = null;
        for (const file of files) {
          const fullPath = path.join(charDir, file);
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (!lastUpdated || stat.mtime > lastUpdated) {
              lastUpdated = stat.mtime;
            }
          }
        }

        accounts.push({
          name: entry.name,
          world: charJson?.world || null,
          gameState: charJson?.game_state || 'UNKNOWN',
          combatLevel,
          totalLevel,
          totalXp,
          bankCount: bankJson?.item_count || (bankJson?.items?.length || 0),
          equipmentCount: eqJson?.item_count || (eqJson?.items?.length || 0),
          quests: questsJson?.summary || null,
          diaries: diariesJson?.summary || null,
          combatAchievements: caJson?.summary || null,
          collectionLog: {
            scraped: clogJson?.entries_scraped || 0
          },
          lastUpdated: lastUpdated ? lastUpdated.toISOString() : null
        });
      }
    }

    res.json({ success: true, baseDir, accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/accounts/:name - Return full character export package
app.get('/api/accounts/:name', (req, res) => {
  const accountName = req.params.name;
  const baseDir = getCharacterDir();
  const charDir = path.join(baseDir, accountName);

  if (!fs.existsSync(charDir)) {
    return res.status(404).json({ success: false, error: `Account folder '${accountName}' not found.` });
  }

  const character = readJsonFile(path.join(charDir, 'character.json'));
  const equipment = readJsonFile(path.join(charDir, 'equipment.json'));
  const inventory = readJsonFile(path.join(charDir, 'inventory.json'));
  const bank = readJsonFile(path.join(charDir, 'bank.json'));
  const quests = readJsonFile(path.join(charDir, 'quests.json'));
  const diaries = readJsonFile(path.join(charDir, 'diaries.json'));
  const combatAchievements = readJsonFile(path.join(charDir, 'combat_achievements.json'));
  const collectionLog = readJsonFile(path.join(charDir, 'collection_log.json'));

  const stats = character?.stats || null;
  const combatLevel = calculateCombatLevel(stats);
  const totalLevel = calculateTotalLevel(stats);
  const totalXp = calculateTotalXp(stats);

  res.json({
    success: true,
    accountName,
    summary: {
      combatLevel,
      totalLevel,
      totalXp,
      world: character?.world,
      gameState: character?.game_state,
      exportedAt: character?.exported_at
    },
    data: {
      character,
      equipment,
      inventory,
      bank,
      quests,
      diaries,
      combatAchievements,
      collectionLog
    }
  });
});

// SSE endpoint for live file changes
app.get('/api/watch', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const baseDir = getCharacterDir();
  let watcher = null;

  if (fs.existsSync(baseDir)) {
    watcher = fs.watch(baseDir, { recursive: true }, (eventType, filename) => {
      res.write(`data: ${JSON.stringify({ eventType, filename, timestamp: new Date().toISOString() })}\n\n`);
    });
  }

  req.on('close', () => {
    if (watcher) watcher.close();
  });
});

// POST /api/accounts/:name/files/:filename - Save/update a specific character JSON file
app.post('/api/accounts/:name/files/:filename', (req, res) => {
  const { name, filename } = req.params;
  const baseDir = getCharacterDir();
  const charDir = path.join(baseDir, name);

  if (!filename.endsWith('.json')) {
    return res.status(400).json({ success: false, error: 'Filename must end with .json' });
  }

  try {
    if (!fs.existsSync(charDir)) {
      fs.mkdirSync(charDir, { recursive: true });
    }

    const filePath = path.join(charDir, filename);
    const content = typeof req.body === 'string' ? req.body : JSON.stringify(req.body, null, 2);

    fs.writeFileSync(filePath, content, 'utf-8');

    res.json({
      success: true,
      message: `File '${filename}' for account '${name}' saved successfully.`,
      accountName: name,
      filename,
      filePath
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/export - Generic endpoint for posting character export JSON payloads
app.post('/api/export', (req, res) => {
  const body = req.body || {};

  const accountName = body.accountName || body.account_name || body.character?.account_name || req.query.account;
  if (!accountName) {
    return res.status(400).json({
      success: false,
      error: "Missing account identifier. Provide 'accountName' or 'account_name' in JSON body or '?account=' query parameter."
    });
  }

  let filename = body.filename || req.query.filename;
  let data = body.data || body;

  if (!filename) {
    if (body.kind) {
      filename = `${body.kind}.json`;
    } else if (body.stats) {
      filename = 'character.json';
    } else if (body.summary?.finished !== undefined) {
      filename = 'quests.json';
    } else if (body.summary?.tiers_complete !== undefined) {
      filename = 'diaries.json';
    } else if (body.summary?.total_tasks_completed !== undefined) {
      filename = 'combat_achievements.json';
    } else if (body.entries_scraped !== undefined || body.tabs) {
      filename = 'collection_log.json';
    } else {
      filename = 'export.json';
    }
  }

  const baseDir = getCharacterDir();
  const charDir = path.join(baseDir, accountName);

  try {
    if (!fs.existsSync(charDir)) {
      fs.mkdirSync(charDir, { recursive: true });
    }

    const filePath = path.join(charDir, filename);
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, content, 'utf-8');

    res.json({
      success: true,
      message: `Export file '${filename}' for account '${accountName}' saved successfully.`,
      accountName,
      filename,
      filePath
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`OSRS Character Visualizer API server running on http://localhost:${PORT}`);
  console.log(`Monitoring directory: ${getCharacterDir()}`);
});
