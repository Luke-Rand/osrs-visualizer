import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import SkillsTab from './components/SkillsTab';
import EquipmentInventoryTab from './components/EquipmentInventoryTab';
import BankTab from './components/BankTab';
import QuestsTab from './components/QuestsTab';
import DiariesTab from './components/DiariesTab';
import CombatAchievementsTab from './components/CombatAchievementsTab';
import CollectionLogTab from './components/CollectionLogTab';
import ImportModal from './components/ImportModal';

import { Shield, Zap, Package, Database, Scroll, BookOpen, Trophy, Compass, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [activeAccountName, setActiveAccountName] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // 1. Fetch available character accounts from API
  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const json = await res.json();
      if (json.success && json.accounts) {
        setAccounts(json.accounts);
        if (!activeAccountName && json.accounts.length > 0) {
          setActiveAccountName(json.accounts[0].name);
        }
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  // 2. Fetch full character dataset for selected account
  const fetchAccountData = async (name) => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/${name}`);
      const json = await res.json();
      if (json.success) {
        setAccountData(json.data);
      }
    } catch (err) {
      console.error(`Error loading account data for ${name}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (activeAccountName) {
      fetchAccountData(activeAccountName);
    }
  }, [activeAccountName]);

  // 3. Connect to Live Server-Sent Events (SSE) for automatic auto-sync
  useEffect(() => {
    let eventSource;
    try {
      eventSource = new EventSource('/api/watch');
      eventSource.onmessage = (event) => {
        setIsLive(true);
        setTimeout(() => setIsLive(false), 2000);
        fetchAccounts();
        if (activeAccountName) {
          fetchAccountData(activeAccountName);
        }
      };
    } catch (e) {
      console.log('Live watch not connected');
    }
    return () => {
      if (eventSource) eventSource.close();
    };
  }, [activeAccountName]);

  // Handler for manual JSON import
  const handleImportData = (filename, jsonContent) => {
    if (!accountData) {
      setAccountData({});
    }

    const updated = { ...accountData };

    if (jsonContent.kind === 'bank' || filename.includes('bank')) {
      updated.bank = jsonContent;
    } else if (jsonContent.kind === 'equipment' || filename.includes('equipment')) {
      updated.equipment = jsonContent;
    } else if (jsonContent.kind === 'inventory' || filename.includes('inventory')) {
      updated.inventory = jsonContent;
    } else if (jsonContent.quests || filename.includes('quests')) {
      updated.quests = jsonContent;
    } else if (jsonContent.diaries || filename.includes('diaries')) {
      updated.diaries = jsonContent;
    } else if (jsonContent.tiers || filename.includes('combat')) {
      updated.combatAchievements = jsonContent;
    } else if (jsonContent.stats || filename.includes('character')) {
      updated.character = jsonContent;
    } else if (jsonContent.tabs || filename.includes('collection')) {
      updated.collectionLog = jsonContent;
    } else {
      updated.character = jsonContent;
    }

    setAccountData(updated);
  };

  const currentSummary = accounts.find(a => a.name === activeAccountName) || {
    name: activeAccountName || 'Imported Account',
    combatLevel: accountData?.character?.combatLevel || 3,
    totalLevel: accountData?.character?.totalLevel || 32,
    totalXp: accountData?.character?.totalXp || 0
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'equipment', label: 'Gear & Inventory', icon: Shield },
    { id: 'bank', label: 'Bank', icon: Database },
    { id: 'quests', label: 'Quests', icon: Scroll },
    { id: 'diaries', label: 'Diaries', icon: BookOpen },
    { id: 'combatAchievements', label: 'Combat Tasks', icon: Trophy },
    { id: 'collectionLog', label: 'Collection Log', icon: Compass }
  ];

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header
        accounts={accounts}
        currentAccount={currentSummary}
        onSelectAccount={(name) => setActiveAccountName(name)}
        onRefresh={() => {
          fetchAccounts();
          if (activeAccountName) fetchAccountData(activeAccountName);
        }}
        isLive={isLive}
        onOpenImport={() => setIsImportOpen(true)}
      />

      {/* Navigation Tab Bar */}
      <nav className="glass-panel nav-tab-container">
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="nav-tab-button"
              style={{
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'linear-gradient(135deg, rgba(229,192,123,0.2), rgba(18,22,33,0.9))' : 'transparent',
                color: isActive ? 'var(--color-gold)' : 'var(--color-text-main)',
                border: isActive ? '1px solid rgba(229,192,123,0.35)' : '1px solid transparent'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--color-gold)' : 'var(--color-text-muted)'} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="animate-fade-in">
        {loading && !accountData ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Loading character data...</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Scanning ~/.runelite/character-exporter</div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                character={accountData?.character}
                equipment={accountData?.equipment}
                quests={accountData?.quests}
                diaries={accountData?.diaries}
                combatAchievements={accountData?.combatAchievements}
                collectionLog={accountData?.collectionLog}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsTab character={accountData?.character} />
            )}

            {activeTab === 'equipment' && (
              <EquipmentInventoryTab equipment={accountData?.equipment} inventory={accountData?.inventory} />
            )}

            {activeTab === 'bank' && (
              <BankTab bank={accountData?.bank} />
            )}

            {activeTab === 'quests' && (
              <QuestsTab quests={accountData?.quests} />
            )}

            {activeTab === 'diaries' && (
              <DiariesTab diaries={accountData?.diaries} />
            )}

            {activeTab === 'combatAchievements' && (
              <CombatAchievementsTab combatAchievements={accountData?.combatAchievements} />
            )}

            {activeTab === 'collectionLog' && (
              <CollectionLogTab collectionLog={accountData?.collectionLog} />
            )}
          </>
        )}
      </main>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportData={handleImportData}
      />
    </div>
  );
}
