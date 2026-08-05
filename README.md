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

## 🖥️ Cross-Platform Terminal TUI Tool

We provide an interactive Terminal User Interface (TUI) tool to push local character JSON files to the API server from any device.

```bash
# Launch interactive TUI tool
npm run tui
```

### TUI Features:
- 📤 **Push Account(s)**: Select any local RuneLite account folder and post all JSON export files to the API server.
- 📄 **Push Custom File**: Select any `.json` file on disk and push it to a chosen account on the API server.
- ⚡ **Continuous Live Auto-Sync Mode**: Watch your local `.runelite/character-exporter` folder and automatically post JSON changes to the server in real-time as RuneLite writes them.
- 🔍 **Test Connection**: Verify API server health and active account counts.
- ⚙️ **Custom API Server URL**: Easily configure target API endpoints (e.g. `http://localhost:3001` or remote servers).


## 📡 API Endpoints & HTTP Import

You can submit or update character JSON files programmatically via POST requests:

### 1. Direct File Endpoint (`POST /api/accounts/:name/files/:filename`)

Saves a specific JSON file for an account.

```bash
curl -X POST http://localhost:3001/api/accounts/Zezima/files/character.json \
  -H "Content-Type: application/json" \
  -d '{
    "account_name": "Zezima",
    "world": 301,
    "game_state": "LOGGED_IN",
    "stats": {
      "Attack": { "real_level": 99, "boosted_level": 99, "experience": 13034431 },
      "Strength": { "real_level": 99, "boosted_level": 99, "experience": 13034431 }
    }
  }'
```

### 2. Auto-Detecting Export Endpoint (`POST /api/export`)

Automatically determines filename from payload properties (`kind`, `stats`, `summary`, etc.) and writes to the account folder.

```bash
curl -X POST http://localhost:3001/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "account_name": "Zezima",
    "kind": "bank",
    "item_count": 1,
    "items": [
      { "slot": 0, "id": 4151, "quantity": 1, "name": "Abyssal whip" }
    ]
  }'
```


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

## 🐳 Containerization & Deployment

### Option A: Docker Compose (Recommended)

Build and start the application in containerized mode with volume mapping for your local `.runelite/character-exporter` directory:

```bash
# Build and run container in background
docker compose up -d --build
```

Access the app at **[http://localhost:3001/](http://localhost:3001/)**.

### Option B: Docker CLI

```bash
# Build Docker image
docker build -t osrs-visualizer .

# Run container with volume mount
docker run -d \
  -p 3001:3001 \
  -v ~/.runelite/character-exporter:/app/character-exporter \
  --name osrs-visualizer \
  osrs-visualizer
```

---

## ☸️ Kubernetes Deployment

Deploy the application, persistent volume, and service into a Kubernetes cluster:

```bash
# Apply PVC, Deployment, and Service manifests
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify resources
kubectl get pods -l app=osrs-visualizer
kubectl get svc osrs-visualizer-service
```

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite 5, Vanilla CSS (Glassmorphism & OSRS Dark Aesthetics), Lucide Icons
- **Backend**: Express.js (Node.js), Cors, Server-Sent Events (SSE)
- **Containerization**: Docker (Multi-stage build), Docker Compose, Kubernetes (K8s)
- **Item Assets**: RuneLite Static Cache Icon CDN (`https://static.runelite.net/cache/item/icon/{id}.png`) & OSRS Wiki Media

