import React, { useState, useMemo } from 'react';
import { Database, Search, ArrowUpDown, Filter, Sparkles, ExternalLink } from 'lucide-react';
import { getItemIconUrl, formatQuantity, formatNumber, getWikiUrl } from '../utils/osrsUtils';


export default function BankTab({ bank }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('slot'); // 'slot' | 'qty-desc' | 'qty-asc' | 'name'
  const [selectedItem, setSelectedItem] = useState(null);

  const rawItems = bank?.items || [];
  const itemCount = bank?.item_count || rawItems.length;

  const filteredItems = useMemo(() => {
    let result = [...rawItems];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || item.id.toString() === term
      );
    }

    if (sortBy === 'qty-desc') {
      result.sort((a, b) => b.quantity - a.quantity);
    } else if (sortBy === 'qty-asc') {
      result.sort((a, b) => a.quantity - b.quantity);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => a.slot - b.slot);
    }

    return result;
  }, [rawItems, searchTerm, sortBy]);

  return (
    <div className="bank-layout">
      
      {/* Header & Controls Bar */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database color="var(--color-gold)" size={24} />
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Bank Viewer</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Showing {filteredItems.length} of {itemCount} unique bank items
            </div>
          </div>
        </div>

        {/* Controls: Search & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search item name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(229,192,123,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '8px', flexWrap: 'wrap' }}>
            <ArrowUpDown size={14} color="var(--color-gold)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sort:</span>
            {[
              { id: 'slot', label: 'Bank Order' },
              { id: 'qty-desc', label: 'Highest Qty' },
              { id: 'name', label: 'Name' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: sortBy === s.id ? 600 : 400,
                  background: sortBy === s.id ? 'var(--color-gold)' : 'transparent',
                  color: sortBy === s.id ? '#0d1017' : 'var(--color-text-main)',
                  minHeight: '36px'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bank Item Grid */}
      <div className="glass-panel bank-main-col" style={{ padding: '1.25rem', maxHeight: '640px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))', gap: '0.6rem' }}>
          {filteredItems.map((item) => (
            <div
              key={item.slot}
              className="item-slot"
              style={{
                width: '52px',
                height: '52px',
                border: selectedItem?.slot === item.slot ? '2px solid var(--color-gold)' : '1px solid rgba(229,192,123,0.15)',
                background: selectedItem?.slot === item.slot ? 'rgba(229,192,123,0.15)' : 'rgba(15,18,26,0.9)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedItem(item)}
              title={`${item.name} (${item.quantity.toLocaleString()})`}
            >
              <img src={getItemIconUrl(item.id)} alt={item.name} loading="lazy" />
              <span className="qty">{formatQuantity(item.quantity)}</span>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No bank items found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>

      {/* Item Details Inspector Panel */}
      <div className="glass-panel bank-side-col" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          Item Inspector
        </h3>

        {selectedItem ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px' }}>
              <div className="item-slot" style={{ width: '60px', height: '60px' }}>
                <img src={getItemIconUrl(selectedItem.id)} alt={selectedItem.name} style={{ width: '44px', height: '44px' }} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gold)' }}>{selectedItem.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Item ID: {selectedItem.id}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Quantity</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  {formatNumber(selectedItem.quantity)}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Bank Slot</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>
                  #{selectedItem.slot + 1}
                </div>
              </div>
            </div>

            <a
              href={getWikiUrl(selectedItem.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="wiki-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1rem', marginTop: '0.25rem' }}
            >
              <span>View {selectedItem.name} on OSRS Wiki</span>
              <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
            Click any item in the bank grid to inspect item properties.
          </div>
        )}
      </div>

    </div>
  );
}
