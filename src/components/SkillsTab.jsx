import React, { useState } from 'react';
import { OSRS_SKILLS, getSkillProgress, formatNumber, formatQuantity } from '../utils/osrsUtils';
import { Zap, Award, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';

export default function SkillsTab({ character }) {
  const stats = character?.stats || {};
  const [selectedSkill, setSelectedSkill] = useState('Attack');
  const [levelMode, setLevelMode] = useState('real'); // 'real' | 'boosted' | 'virtual'

  // Count total 99s
  const total99s = Object.values(stats).filter(s => (s.real_level || 0) >= 99).length;

  const currentSkillData = stats[selectedSkill] || { real_level: 1, boosted_level: 1, experience: 0 };
  const skillMeta = OSRS_SKILLS.find(s => s.name === selectedSkill) || { name: selectedSkill, icon: '' };
  const skillProgress = getSkillProgress(currentSkillData.experience, currentSkillData.real_level);

  return (
    <div className="skills-layout">
      
      {/* Skill Selector Controls & Overview Header */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Zap color="var(--color-gold)" size={24} />
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Skill Overview</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Click any skill card to view detailed XP milestones and progress to 99 / 200M.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', paddingRight: '0.3rem' }}>Display:</span>
            {[
              { id: 'real', label: 'Real Lvl' },
              { id: 'boosted', label: 'Boosted' },
              { id: 'virtual', label: 'Virtual (126)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setLevelMode(m.id)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: levelMode === m.id ? 600 : 400,
                  background: levelMode === m.id ? 'var(--color-gold)' : 'transparent',
                  color: levelMode === m.id ? '#0e1118' : 'var(--color-text-main)',
                  minHeight: '36px'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="badge badge-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.4rem' }}>
            <Award size={16} />
            <span>99 Capes: {total99s} / 23</span>
          </div>
        </div>
      </div>

      {/* Main 24 Skills Grid */}
      <div className="skills-main-col">
        {OSRS_SKILLS.map(skill => {
          const sData = stats[skill.name] || { real_level: 1, boosted_level: 1, experience: 0 };
          const pInfo = getSkillProgress(sData.experience, sData.real_level);
          const isSelected = selectedSkill === skill.name;
          const isMaxed = sData.real_level >= 99;

          let displayLevel = sData.real_level;
          if (levelMode === 'boosted') displayLevel = sData.boosted_level;
          if (levelMode === 'virtual') displayLevel = pInfo.virtualLevel;

          return (
            <div
              key={skill.name}
              onClick={() => setSelectedSkill(skill.name)}
              className="glass-panel"
              style={{
                padding: '0.9rem 1rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--color-gold)' : '1px solid rgba(229,192,123,0.15)',
                background: isSelected ? 'rgba(229,192,123,0.08)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 16px rgba(229,192,123,0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img 
                    src={skill.icon} 
                    alt={skill.name} 
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{skill.name}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {isMaxed && <Sparkles size={14} color="var(--color-gold-bright)" />}
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: isMaxed ? 'var(--color-gold-bright)' : '#fff'
                    }}
                  >
                    {displayLevel}
                  </span>
                </div>
              </div>

              {/* Progress bar to next level */}
              <div className="progress-bar-bg" style={{ height: '6px' }}>
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${pInfo.progressPercent}%`,
                    background: isMaxed ? 'linear-gradient(90deg, #ffd700, #ff9800)' : 'linear-gradient(90deg, #b38f38, #e5c07b)'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>{formatQuantity(sData.experience)} XP</span>
                <span>{isMaxed ? 'MAX' : `${Math.floor(pInfo.progressPercent)}%`}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Skill Detail Inspector Panel */}
      <div className="glass-panel skills-side-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <img src={skillMeta.icon} alt={selectedSkill} style={{ width: '36px', height: '36px' }} />
          <div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{selectedSkill}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
              {skillMeta.category} Skill
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Real Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>
              {currentSkillData.real_level}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Virtual Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {skillProgress.virtualLevel}
            </div>
          </div>
        </div>

        {/* XP Details List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Current Experience:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
                {formatNumber(currentSkillData.experience)} XP
              </span>
            </div>
          </div>

          {!skillProgress.isMax99 ? (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(229,192,123,0.1)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Next Level ({skillProgress.currentLevel + 1})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>XP Needed:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatNumber(skillProgress.xpRemainingToNext)} XP</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${skillProgress.progressPercent}%` }} />
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.3)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle color="var(--color-gold-bright)" size={20} />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gold-bright)', fontWeight: 600 }}>
                Skill Maxed at Level 99!
              </span>
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>XP Remaining to 99:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)' }}>
                {formatNumber(skillProgress.xpRemainingTo99)} XP
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>XP Remaining to 200M:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-main)' }}>
                {formatNumber(skillProgress.xpRemainingTo200m)} XP
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
