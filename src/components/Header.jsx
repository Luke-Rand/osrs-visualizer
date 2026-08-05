import React, { useState } from 'react';
import { User, Shield, Zap, RefreshCw, Upload, Sparkles, CheckCircle2, Globe, Database } from 'lucide-react';
import { formatQuantity, formatNumber } from '../utils/osrsUtils';

export default function Header({ accounts, currentAccount, onSelectAccount, onRefresh, isLive, onOpenImport }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Left: Branding & Account Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div 
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e5c07b, #8a641a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(229, 192, 123, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Shield size={28} color="#0d0f17" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 700, letterSpacing: '0.5px' }}>
                {currentAccount ? currentAccount.name : 'OSRS Visualizer'}
              </h1>

              {/* Account Dropdown Switcher */}
              {accounts && accounts.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="badge badge-gold"
                    style={{ padding: '0.3rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>Switch Account ({accounts.length})</span>
                    <span style={{ fontSize: '0.7rem' }}>▼</span>
                  </button>

                  {dropdownOpen && (
                    <div 
                      className="glass-panel"
                      style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        zIndex: 100,
                        minWidth: '220px',
                        padding: '0.5rem',
                        background: '#121622',
                        border: '1px solid rgba(229,192,123,0.3)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        LOCAL CHARACTERS
                      </div>
                      {accounts.map((acc) => (
                        <button
                          key={acc.name}
                          onClick={() => {
                            onSelectAccount(acc.name);
                            setDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.6rem 0.8rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: acc.name === currentAccount?.name ? 'rgba(229,192,123,0.15)' : 'transparent',
                            color: acc.name === currentAccount?.name ? 'var(--color-gold)' : 'var(--color-text-main)',
                            fontWeight: acc.name === currentAccount?.name ? 600 : 400
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={16} />
                            <span>{acc.name}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Lvl {acc.combatLevel}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.3rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {currentAccount?.world && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Globe size={14} color="var(--color-gold)" /> World {currentAccount.world}
                </span>
              )}
              {currentAccount?.gameState && (
                <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                  {currentAccount.gameState}
                </span>
              )}
              {currentAccount?.lastUpdated && (
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                  Exported {new Date(currentAccount.lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Key Stats Summary & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          {currentAccount && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Combat</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>
                  {currentAccount.combatLevel}
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />

              <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Lvl</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  {formatNumber(currentAccount.totalLevel)}
                </div>
              </div>

              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />

              <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total XP</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>
                  {formatQuantity(currentAccount.totalXp)}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onRefresh}
              className="glass-panel"
              title="Refresh character export files"
              style={{
                padding: '0.6rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-text-main)',
                fontSize: '0.85rem'
              }}
            >
              <RefreshCw size={16} className={isLive ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onOpenImport}
              className="badge badge-gold"
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Upload size={16} />
              <span>Import JSON</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
