#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';

// Default configuration
let serverUrl = process.env.OSRS_API_URL || 'http://localhost:3001';
const localDir = process.env.OSRS_CHAR_DIR || path.join(os.homedir(), '.runelite', 'character-exporter');

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  gold: '\x1b[38;2;229;192;123m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m'
};

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function printHeader() {
  console.log(`${colors.gold}${colors.bright}`);
  console.log(` ⚔️  OSRS CHARACTER EXPORTER - API TUI TOOL ⚔️ `);
  console.log(`=================================================${colors.reset}`);
  console.log(`${colors.dim} Server API : ${colors.cyan}${serverUrl}${colors.reset}`);
  console.log(`${colors.dim} Local Dir  : ${colors.cyan}${localDir}${colors.reset}`);
  console.log(`${colors.gold}=================================================${colors.reset}\n`);
}

function createRL() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function prompt(question) {
  const rl = createRL();
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// POST helper using native fetch
async function pushJsonFile(accountName, filename, filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);

    const url = `${serverUrl.replace(/\/$/, '')}/api/accounts/${encodeURIComponent(accountName)}/files/${encodeURIComponent(filename)}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`  ${colors.green}✓ Success:${colors.reset} Pushed ${colors.cyan}${filename}${colors.reset} for ${colors.gold}${accountName}${colors.reset}`);
      return true;
    } else {
      const text = await res.text();
      console.log(`  ${colors.red}✗ Failed:${colors.reset} ${filename} (${res.status}): ${text}`);
      return false;
    }
  } catch (err) {
    console.log(`  ${colors.red}✗ Error:${colors.reset} pushing ${filename}: ${err.message}`);
    return false;
  }
}

// Option 1: Push All JSON files for a local account
async function pushAccount() {
  clearScreen();
  printHeader();

  if (!fs.existsSync(localDir)) {
    console.log(`${colors.red}Local directory '${localDir}' not found.${colors.reset}\n`);
    await prompt('Press ENTER to return to menu...');
    return;
  }

  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  const accounts = entries.filter(e => e.isDirectory()).map(e => e.name);

  if (accounts.length === 0) {
    console.log(`${colors.yellow}No character directories found in '${localDir}'.${colors.reset}\n`);
    await prompt('Press ENTER to return to menu...');
    return;
  }

  console.log(`${colors.bright}Available Accounts:${colors.reset}`);
  accounts.forEach((acc, idx) => {
    console.log(`  [${idx + 1}] ${colors.gold}${acc}${colors.reset}`);
  });
  console.log(`  [A] All Accounts`);
  console.log(`  [B] Back to Main Menu\n`);

  const choice = await prompt('Select an account to push: ');

  if (choice.toUpperCase() === 'B' || !choice) return;

  let targetAccounts = [];
  if (choice.toUpperCase() === 'A') {
    targetAccounts = accounts;
  } else {
    const idx = parseInt(choice, 10) - 1;
    if (idx >= 0 && idx < accounts.length) {
      targetAccounts = [accounts[idx]];
    } else {
      console.log(`${colors.red}Invalid selection.${colors.reset}`);
      await prompt('Press ENTER to return to menu...');
      return;
    }
  }

  console.log(`\n${colors.cyan}Pushing character data to API...${colors.reset}\n`);

  for (const accName of targetAccounts) {
    const accountFolder = path.join(localDir, accName);
    const files = fs.readdirSync(accountFolder).filter(f => f.endsWith('.json'));

    console.log(`${colors.bright}Account: ${colors.gold}${accName}${colors.reset} (${files.length} JSON files)`);
    for (const file of files) {
      await pushJsonFile(accName, file, path.join(accountFolder, file));
    }
    console.log('');
  }

  await prompt('Push complete! Press ENTER to return to menu...');
}

// Option 2: Push a custom single JSON file
async function pushSingleFile() {
  clearScreen();
  printHeader();

  const customPath = await prompt('Enter path to JSON file: ');
  if (!customPath) return;

  const resolvedPath = path.resolve(customPath.replace(/^~/, os.homedir()));

  if (!fs.existsSync(resolvedPath)) {
    console.log(`${colors.red}File not found: ${resolvedPath}${colors.reset}\n`);
    await prompt('Press ENTER to return to menu...');
    return;
  }

  let defaultAcc = 'CustomAccount';
  try {
    const raw = fs.readFileSync(resolvedPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.account_name) defaultAcc = parsed.account_name;
  } catch (e) {}

  const accName = await prompt(`Enter Account Name [Default: ${defaultAcc}]: `) || defaultAcc;
  const filename = path.basename(resolvedPath);

  console.log(`\n${colors.cyan}Pushing ${filename} for ${accName}...${colors.reset}`);
  await pushJsonFile(accName, filename, resolvedPath);

  await prompt('\nPress ENTER to return to menu...');
}

// Option 3: Continuous Live Watcher Mode
async function startLiveSync() {
  clearScreen();
  printHeader();

  console.log(`${colors.bright}${colors.green}⚡ LIVE SYNC MODE STARTED${colors.reset}`);
  console.log(`${colors.dim}Watching local folder:${colors.reset} ${localDir}`);
  console.log(`${colors.dim}Target API server :${colors.reset} ${serverUrl}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop live sync and return to terminal.${colors.reset}\n`);

  if (!fs.existsSync(localDir)) {
    console.log(`${colors.red}Directory '${localDir}' does not exist.${colors.reset}\n`);
    await prompt('Press ENTER to return...');
    return;
  }

  let watcher;
  try {
    watcher = fs.watch(localDir, { recursive: true }, async (eventType, filename) => {
      if (!filename || !filename.endsWith('.json')) return;

      const parts = filename.split(path.sep);
      if (parts.length >= 2) {
        const accountName = parts[0];
        const jsonFile = parts[parts.length - 1];
        const fullPath = path.join(localDir, filename);

        if (fs.existsSync(fullPath)) {
          const timestamp = new Date().toLocaleTimeString();
          console.log(`[${timestamp}] Detected change in ${colors.cyan}${filename}${colors.reset}`);
          await pushJsonFile(accountName, jsonFile, fullPath);
        }
      }
    });
  } catch (err) {
    console.log(`${colors.red}Watch error: ${err.message}${colors.reset}`);
  }

  return new Promise(() => {}); // Keep alive until Ctrl+C
}

// Option 4: Test Connection
async function testConnection() {
  clearScreen();
  printHeader();

  console.log(`${colors.cyan}Testing connection to ${serverUrl}/api/accounts...${colors.reset}\n`);

  try {
    const res = await fetch(`${serverUrl.replace(/\/$/, '')}/api/accounts`);
    if (res.ok) {
      const data = await res.json();
      console.log(`${colors.green}✓ Connected successfully!${colors.reset}`);
      console.log(`  Accounts on Server: ${colors.gold}${data.accounts?.length || 0}${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Server returned status ${res.status}${colors.reset}`);
    }
  } catch (err) {
    console.log(`${colors.red}✗ Connection failed:${colors.reset} ${err.message}`);
    console.log(`${colors.yellow}Make sure your server is running with 'npm run server'.${colors.reset}`);
  }

  await prompt('\nPress ENTER to return to menu...');
}

// Option 5: Change API URL
async function changeApiUrl() {
  clearScreen();
  printHeader();

  const newUrl = await prompt(`Enter new API Server URL [Current: ${serverUrl}]: `);
  if (newUrl) {
    serverUrl = newUrl;
    console.log(`${colors.green}API Server URL updated to '${serverUrl}'.${colors.reset}`);
  }
  await prompt('\nPress ENTER to return to menu...');
}

// Main Menu Loop
async function mainMenu() {
  while (true) {
    clearScreen();
    printHeader();

    console.log(`${colors.bright}SELECT AN ACTION:${colors.reset}\n`);
    console.log(`  ${colors.gold}[1]${colors.reset} 📤  Push Account(s) to Server API`);
    console.log(`  ${colors.gold}[2]${colors.reset} 📄  Push Single Custom JSON File`);
    console.log(`  ${colors.gold}[3]${colors.reset} ⚡  Start Continuous Live Watch & Auto-Sync`);
    console.log(`  ${colors.gold}[4]${colors.reset} 🔍  Test API Server Connection`);
    console.log(`  ${colors.gold}[5]${colors.reset} ⚙️   Configure API Server URL`);
    console.log(`  ${colors.gold}[6]${colors.reset} ❌  Exit TUI\n`);

    const choice = await prompt('Enter choice (1-6): ');

    switch (choice) {
      case '1':
        await pushAccount();
        break;
      case '2':
        await pushSingleFile();
        break;
      case '3':
        await startLiveSync();
        break;
      case '4':
        await testConnection();
        break;
      case '5':
        await changeApiUrl();
        break;
      case '6':
      case 'exit':
      case 'q':
        console.log(`\n${colors.gold}Goodbye! 👋${colors.reset}\n`);
        process.exit(0);
      default:
        break;
    }
  }
}

mainMenu().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
