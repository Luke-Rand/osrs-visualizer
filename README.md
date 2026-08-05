# ⚔️ OSRS Account Visualizer

An optimal, cross-platform **Old School RuneScape (OSRS)** account visualizer and dashboard powered by exported character data from the RuneLite [character-export](https://runelite.net/plugin-hub/show/character-export) plugin.

Works out of the box on **Windows**, **macOS**, and **Linux**. Automatically monitors character export files in your RuneLite user directory and visualizes character stats, worn equipment, 28-slot inventory, 700+ item bank, quest progress, regional achievement diaries, combat tasks, and collection logs in real time.

---

## 💻 Platform Compatibility & Default Paths

The application dynamically detects your system's user home directory across all platforms:

| Operating System | Default Character Export Path |
| :--- | :--- |
| **Windows** | `C:\Users\<Username>\.runelite\character-exporter` |
| **macOS** | `/Users/<Username>/.runelite/character-exporter` |
| **Linux** | `/home/<Username>/.runelite/character-exporter` |

> 💡 **Custom Directory Support**: If your RuneLite exports are located in a custom folder, you can set the `OSRS_CHAR_DIR` environment variable:
> ```bash
> # Linux / macOS
> OSRS_CHAR_DIR="/custom/path/to/character-exporter" npm run dev
>
> # Windows (PowerShell)
> $env:OSRS_CHAR_DIR="C:\custom\path\to\character-exporter"; npm run dev
> ```

---

## ✨ Features

- **🔄 Automatic Discovery & Live Sync**:
  - Scans your local `.runelite/character-exporter` directory for all character folders.
  - Listens for real-time file updates via Server-Sent Events (SSE) when RuneLite exports new game state.
  - Account switcher dropdown menu for multi-account support.

- **⚔️ Combat & Overview Dashboard**:
  - Accurate OSRS combat level calculation formula (Melee, Ranged, and Magic focus ratings).
  - High-level progress cards for Quests, Achievement Diaries, Combat Tasks, and Collection Log entries.

- **📈 Skills & Virtual Levels Inspector**:
  - Tracks all 23 OSRS skills (+ Sailing ready) with Real Levels, Boosted Levels, and Virtual Levels (up to level 126 for 200M XP).
  - XP progress bars, XP remaining to level 99, and XP remaining to 200M.
  - 99 Skill Capes count badge.

- **🛡️ Equipment Paperdoll & Inventory Grid**:
  - Authentic 11-slot equipment paperdoll with crisp item icons dynamically fetched from RuneLite CDN.
  - Authentic 4x7 (28-slot) inventory grid with item stack quantities and hover detail inspection.

- **🏦 High-Performance Bank Viewer**:
  - Searchable, sortable view for 700+ bank items.
  - Sort by Bank Order, Highest Quantity, or Name.
  - Item detail inspector for stack numbers, item IDs, and slot numbers.

- **📜 Quests, Diaries, Combat Tasks & Collection Log**:
  - **Quests**: Completion progress bar with filters for Finished, In Progress, and Unstarted quests.
  - **Diaries**: Regional matrix tracking task completions across 12 OSRS regions and 4 difficulty tiers.
  - **Combat Tasks**: Completed task counters across Easy, Medium, Hard, Elite, Master, and Grandmaster tiers.
  - **Collection Log**: Scraped log entry visualizer highlighting obtained vs missing items.

- **📁 Manual JSON Importer**:
  - Drag-and-drop modal to manually load or inspect export files offline on any device.

---

## 🛠️ Data Source

Data is exported using the RuneLite plugin **character-export**:
- Plugin Hub: [https://runelite.net/plugin-hub/show/character-export](https://runelite.net/plugin-hub/show/character-export)
- Supported files parsed: `character.json`, `equipment.json`, `inventory.json`, `bank.json`, `quests.json`, `diaries.json`, `combat_achievements.json`, `collection_log.json`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# Navigate to repository directory
cd osrs-visualizer

# Install dependencies
npm install
```

### Running the App

Run both the Express API server (port 3001) and Vite dev server (port 5173) concurrently:

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite 5, Vanilla CSS (Glassmorphism & OSRS Dark Aesthetics), Lucide Icons
- **Backend**: Express.js (Node.js), Cors, Server-Sent Events (SSE)
- **Item Assets**: RuneLite Static Cache Icon CDN (`https://static.runelite.net/cache/item/icon/{id}.png`) & OSRS Wiki Media
