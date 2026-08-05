import React from 'react';
import { BookOpen, CheckCircle, CheckCircle2 } from 'lucide-react';

export default function DiariesTab({ diaries }) {
  const diaryData = diaries?.diaries || {};
  const summary = diaries?.summary || { tiers_complete: 0, tiers_possible: 48 };

  const regions = Object.keys(diaryData);

  return (
    <div className="diaries-layout">
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen color="var(--tier-medium)" size={28} />
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Achievement Diaries</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Track regional task completions across Easy, Medium, Hard, and Elite tiers
            </div>
          </div>
        </div>

        <div className="badge badge-medium" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem' }}>
          <CheckCircle size={16} />
          <span>{summary.tiers_complete} / {summary.tiers_possible} Tiers Complete</span>
        </div>
      </div>

      {/* 12 Regions Grid */}
      <div className="diaries-grid">
        {regions.map(regionName => {
          const reg = diaryData[regionName];
          const tiers = ['easy', 'medium', 'hard', 'elite'];
          const completedTiersCount = tiers.filter(t => reg[t]?.complete).length;

          return (
            <div
              key={regionName}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                border: completedTiersCount === 4 ? '1px solid rgba(78, 175, 84, 0.4)' : '1px solid rgba(229,192,123,0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#fff' }}>{regionName}</h3>
                <span className={completedTiersCount === 4 ? "badge badge-easy" : "badge badge-gold"}>
                  {completedTiersCount} / 4 Tiers
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {tiers.map(tier => {
                  const tData = reg[tier] || { complete: false, tasks_done: 0 };
                  const isDone = tData.complete;

                  return (
                    <div
                      key={tier}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: isDone ? '1px solid rgba(78, 175, 84, 0.3)' : '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', fontWeight: 600, color: `var(--tier-${tier})` }}>
                        {tier} Tier
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {tData.tasks_done} tasks
                        </span>

                        {isDone ? (
                          <CheckCircle2 size={14} color="var(--tier-easy)" />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>Incomplete</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
