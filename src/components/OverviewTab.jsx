import React from 'react';
import { Shield, Sword, Award, Scroll, BookOpen, Trophy, Compass, Sparkles, Target, ExternalLink } from 'lucide-react';
import { calculateCombatDetails, getItemIconUrl, EQUIPMENT_SLOTS, formatNumber, getWikiUrl } from '../utils/osrsUtils';

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
    <div className="overview-grid">
      
      {/* 1. Combat Calculator & Breakdown */}
      <div className="glass-panel overview-main-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sword color="var(--color-gold)" size={24} />
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Combat Breakdown</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
              Level {combatDetails.combatLevel} ({combatDetails.maxStyle} Focus)
            </div>
            <a
              href="https://oldschool.runescape.wiki/w/Combat_level"
              target="_blank"
              rel="noopener noreferrer"
              className="wiki-btn"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              title="View Combat Level Formula on OSRS Wiki"
            >
              <span>Combat Wiki</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <div className="combat-breakdown-stats">
          {[
            { name: 'Attack', val: combatDetails.atk, color: '#e74c3c' },
            { name: 'Strength', val: combatDetails.str, color: '#e67e22' },
            { name: 'Defence', val: combatDetails.def, color: '#3498db' },
            { name: 'Hitpoints', val: combatDetails.hp, color: '#2ecc71' },
            { name: 'Ranged', val: combatDetails.range, color: '#27ae60' },
            { name: 'Prayer', val: combatDetails.pray, color: '#f1c40f' },
            { name: 'Magic', val: combatDetails.mage, color: '#9b59b6' }
          ].map(s => (
            <a
              key={s.name}
              href={getWikiUrl(s.name)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', display: 'block' }}
              title={`View ${s.name} guide on OSRS Wiki`}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>{s.name}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.val}</div>
            </a>
          ))}
        </div>

        {/* Formula Math Card */}
        <div className="combat-math-grid" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(229,192,123,0.1)' }}>
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
      <div className="glass-panel overview-side-col" style={{ padding: '1.5rem' }}>
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
                  <a
                    href={getWikiUrl(item.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                  >
                    <img src={getItemIconUrl(item.id)} alt={item.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    {item.quantity > 1 && <span className="qty">{item.quantity}</span>}
                  </a>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>{slot.name[0]}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Account Highlights & Accomplishments */}
      <div className="glass-panel overview-full-col" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Account Milestone Summaries</h3>

        <div className="milestone-grid">
          
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

      {/* 4. OSRS Wiki Quick Resources Hub */}
      <div className="glass-panel overview-full-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ExternalLink color="var(--color-gold)" size={22} />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Official OSRS Wiki Quick Links</h3>
          </div>
          <a
            href="https://oldschool.runescape.wiki/"
            target="_blank"
            rel="noopener noreferrer"
            className="wiki-btn"
          >
            <span>Visit OSRS Wiki Main Page</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { name: 'Skill Training Guides', url: 'https://oldschool.runescape.wiki/w/Skill_training_guides' },
            { name: 'Quest Experience Rewards', url: 'https://oldschool.runescape.wiki/w/Quest_experience_rewards' },
            { name: 'Optimal Quest Guide', url: 'https://oldschool.runescape.wiki/w/Optimal_quest_guide' },
            { name: 'Bossing & PvM Guides', url: 'https://oldschool.runescape.wiki/w/Boss' },
            { name: 'Money Making Guides', url: 'https://oldschool.runescape.wiki/w/Money_making_guide' },
            { name: 'Calculators & Tools', url: 'https://oldschool.runescape.wiki/w/Calculators' }
          ].map(res => (
            <a
              key={res.name}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(229,192,123,0.15)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                color: 'var(--color-text-main)',
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="hover-card"
            >
              <span>{res.name}</span>
              <ExternalLink size={14} color="var(--color-gold)" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}

