import React from 'react';
import { Shield, Sword, Award, Scroll, BookOpen, Trophy, Compass, Sparkles, Target } from 'lucide-react';
import { calculateCombatDetails, getItemIconUrl, EQUIPMENT_SLOTS, formatNumber } from '../utils/osrsUtils';

export default function OverviewTab({ character, equipment, quests, diaries, combatAchievements, collectionLog, onNavigateTab }) {
  const stats = character?.stats || {};
  const combatDetails = calculateCombatDetails(stats);
  const eqItems = equipment?.items || [];

  // Map equipment items by slot
  const equippedBySlot = {};
  eqItems.forEach(item => {
    equippedBySlot[item.slot] = item;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
      
      {/* 1. Combat Calculator & Breakdown */}
      <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sword color="var(--color-gold)" size={24} />
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Combat Breakdown</h2>
          </div>
          <div className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
            Level {combatDetails.combatLevel} ({combatDetails.maxStyle} Focus)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { name: 'Attack', val: combatDetails.atk, color: '#e74c3c' },
            { name: 'Strength', val: combatDetails.str, color: '#e67e22' },
            { name: 'Defence', val: combatDetails.def, color: '#3498db' },
            { name: 'Hitpoints', val: combatDetails.hp, color: '#2ecc71' },
            { name: 'Ranged', val: combatDetails.range, color: '#27ae60' },
            { name: 'Prayer', val: combatDetails.pray, color: '#f1c40f' },
            { name: 'Magic', val: combatDetails.mage, color: '#9b59b6' }
          ].map(s => (
            <div key={s.name} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>{s.name}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Formula Math Card */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(229,192,123,0.1)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Base Rating</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>{combatDetails.base}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Melee Rating</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e74c3c', fontFamily: 'var(--font-mono)' }}>{combatDetails.melee}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Ranged Rating</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#27ae60', fontFamily: 'var(--font-mono)' }}>{combatDetails.ranged}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Magic Rating</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#9b59b6', fontFamily: 'var(--font-mono)' }}>{combatDetails.magic}</div>
          </div>
        </div>
      </div>

      {/* 2. Equipment Paperdoll Mini-Preview */}
      <div className="glass-panel" style={{ gridColumn: 'span 4', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield color="var(--color-gold)" size={20} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Worn Gear</h3>
          </div>
          <button 
            onClick={() => onNavigateTab('equipment')} 
            style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textDecoration: 'underline' }}
          >
            View All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', justifyItems: 'center', margin: '0 auto', maxWidth: '200px' }}>
          {EQUIPMENT_SLOTS.slice(0, 9).map(slot => {
            const item = equippedBySlot[slot.slot];
            return (
              <div key={slot.slot} className="item-slot" title={item ? `${item.name} (${item.quantity})` : slot.name}>
                {item ? (
                  <>
                    <img src={getItemIconUrl(item.id)} alt={item.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    {item.quantity > 1 && <span className="qty">{item.quantity}</span>}
                  </>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>{slot.name[0]}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Account Highlights & Accomplishments */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Account Milestone Summaries</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          
          {/* Quests Summary Card */}
          <div 
            onClick={() => onNavigateTab('quests')}
            style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Scroll color="var(--color-gold)" size={22} />
              <span className="badge badge-gold">Quests</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {quests?.summary?.finished || 0} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Done</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              {quests?.summary?.in_progress || 0} In Progress • {quests?.summary?.not_started || 0} Unstarted
            </div>
          </div>

          {/* Achievement Diaries Summary Card */}
          <div 
            onClick={() => onNavigateTab('diaries')}
            style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <BookOpen color="var(--tier-medium)" size={22} />
              <span className="badge badge-medium">Diaries</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {diaries?.summary?.tiers_complete || 0} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>/ {diaries?.summary?.tiers_possible || 48} Tiers</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              Completed Regional Diaries
            </div>
          </div>

          {/* Combat Achievements Card */}
          <div 
            onClick={() => onNavigateTab('combatAchievements')}
            style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Trophy color="var(--tier-hard)" size={22} />
              <span className="badge badge-hard">Combat Tasks</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {combatAchievements?.summary?.total_tasks_completed || 0} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Tasks</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              {combatAchievements?.summary?.total_tiers_completed || 0} Tiers Mastered
            </div>
          </div>

          {/* Collection Log Card */}
          <div 
            onClick={() => onNavigateTab('collectionLog')}
            style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <Compass color="var(--tier-elite)" size={22} />
              <span className="badge badge-elite">Collection Log</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {collectionLog?.entries_scraped || 0} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Scraped</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
              Bosses, Minigames & Clues
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
