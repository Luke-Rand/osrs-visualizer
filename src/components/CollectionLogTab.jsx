import React, { useState } from 'react';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { getItemIconUrl } from '../utils/osrsUtils';

export default function CollectionLogTab({ collectionLog }) {
  const tabs = collectionLog?.tabs || {};
  const mainTabKeys = Object.keys(tabs);

  const [selectedMainTab, setSelectedMainTab] = useState(mainTabKeys[0] || 'Bosses');
  const activeMainTabObj = tabs[selectedMainTab] || {};
  const categoryNames = Object.keys(activeMainTabObj);

  const [selectedCategory, setSelectedCategory] = useState(categoryNames[0] || '');

  // Reset category if main tab changes
  const handleSelectTab = (tabName) => {
    setSelectedMainTab(tabName);
    const subCats = Object.keys(tabs[tabName] || {});
    setSelectedCategory(subCats[0] || '');
  };

  const currentCategoryData = activeMainTabObj[selectedCategory] || { obtained_count: 0, total_items: 0, items: [] };
  const items = currentCategoryData.items || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Compass color="var(--tier-elite)" size={28} />
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Collection Log</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Scraped in-game log entries ({collectionLog?.entries_scraped || 0} pages recorded)
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} color="var(--color-gold)" />
          <span>Note: Open each collection log page in-game in RuneLite to scrape its items into your local character export.</span>
        </div>
      </div>

      {/* Main Collection Log Tabs */}
      {mainTabKeys.length > 0 ? (
        <>
          <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            {mainTabKeys.map(tabName => (
              <button
                key={tabName}
                onClick={() => handleSelectTab(tabName)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: selectedMainTab === tabName ? 600 : 400,
                  background: selectedMainTab === tabName ? 'var(--color-gold)' : 'transparent',
                  color: selectedMainTab === tabName ? '#0d1017' : 'var(--color-text-main)'
                }}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Sub-Category Selector Sidebar & Item Grid */}
          <div className="glass-panel" style={{ gridColumn: 'span 4', padding: '1.25rem', maxHeight: '560px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Categories ({categoryNames.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {categoryNames.map(catName => {
                const catObj = activeMainTabObj[catName];
                const isSelected = selectedCategory === catName;

                return (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    style={{
                      textAlign: 'left',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      background: isSelected ? 'rgba(229,192,123,0.15)' : 'rgba(0,0,0,0.2)',
                      color: isSelected ? 'var(--color-gold)' : 'var(--color-text-main)',
                      fontWeight: isSelected ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: isSelected ? '1px solid rgba(229,192,123,0.3)' : '1px solid rgba(255,255,255,0.03)'
                    }}
                  >
                    <span>{catName}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>
                      {catObj.obtained_count} / {catObj.total_items}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Grid Display */}
          <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedCategory}</h3>
              <span className="badge badge-gold">
                Obtained: {currentCategoryData.obtained_count} / {currentCategoryData.total_items}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '1rem' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: item.obtained ? 'rgba(78, 175, 84, 0.12)' : 'rgba(0,0,0,0.3)',
                    border: item.obtained ? '1px solid rgba(78, 175, 84, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                    padding: '0.85rem 0.5rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    opacity: item.obtained ? 1 : 0.45,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={getItemIconUrl(item.id)}
                    alt={item.name}
                    style={{ width: '40px', height: '40px', objectFit: 'contain', filter: item.obtained ? 'none' : 'grayscale(100%)' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: item.obtained ? '#fff' : 'var(--color-text-dim)', marginTop: '0.4rem', lineHeight: '1.2' }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No collection log entries scraped yet. Open collection log pages in RuneLite to populate this view.
        </div>
      )}

    </div>
  );
}
