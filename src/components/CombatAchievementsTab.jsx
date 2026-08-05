import React, { useState } from 'react';
import { Trophy, CheckCircle2, Search, Filter, ExternalLink } from 'lucide-react';
import { getWikiSearchUrl, getWikiUrl } from '../utils/osrsUtils';

export default function CombatAchievementsTab({ combatAchievements }) {
  const [selectedTier, setSelectedTier] = useState('easy');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'INCOMPLETE'
  const [searchTerm, setSearchTerm] = useState('');

  const summary = combatAchievements?.summary || { total_tasks_completed: 0, total_tiers_completed: 0 };
  const tiers = combatAchievements?.tiers || {};

  const currentTierData = tiers[selectedTier] || { complete: false, tasks_completed: 0, tasks_total: 0, tasks: [] };
  const tasks = currentTierData.tasks || [];

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'COMPLETED' ? t.complete : !t.complete);
    return matchSearch && matchStatus;
  });

  const tierKeys = ['easy', 'medium', 'hard', 'elite', 'master', 'grandmaster'];

  return (
    <div className="combat-achievements-layout">
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Trophy color="var(--tier-hard)" size={28} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Combat Achievements</h2>
              <a
                href="https://oldschool.runescape.wiki/w/Combat_Achievements"
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-btn"
                title="View Combat Achievements Guide on OSRS Wiki"
              >
                <span>CA Wiki</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Boss mechanics, speedruns, and combat challenges across 6 difficulty tiers
            </div>
          </div>
        </div>

        <div className="badge badge-hard" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem' }}>
          <Trophy size={16} />
          <span>{summary.total_tasks_completed} Tasks Completed</span>
        </div>
      </div>

      {/* Tier Selector Row */}
      <div className="glass-panel combat-tiers-grid" style={{ padding: '1.25rem' }}>
        {tierKeys.map(key => {
          const t = tiers[key] || { complete: false, tasks_completed: 0, tasks_total: 0 };
          const isSelected = selectedTier === key;
          const pct = t.tasks_total > 0 ? Math.round((t.tasks_completed / t.tasks_total) * 100) : 0;

          return (
            <button
              key={key}
              onClick={() => setSelectedTier(key)}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.3)',
                padding: '0.85rem 0.6rem',
                borderRadius: '8px',
                border: isSelected ? `2px solid var(--tier-${key})` : '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '44px'
              }}
            >
              <div style={{ fontSize: '0.8rem', textTransform: 'capitalize', fontWeight: 700, color: `var(--tier-${key})`, marginBottom: '0.2rem' }}>
                {key}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {t.tasks_completed} / {t.tasks_total}
              </div>
              <div className="progress-bar-bg" style={{ height: '4px', marginTop: '0.4rem' }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%`, background: `var(--tier-${key})` }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Task List Panel */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search ${selectedTier} tasks...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(229,192,123,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All (${tasks.length})` },
              { id: 'COMPLETED', label: `Completed (${currentTierData.tasks_completed})` },
              { id: 'INCOMPLETE', label: `Incomplete (${tasks.length - currentTierData.tasks_completed})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: statusFilter === f.id ? 600 : 400,
                  background: statusFilter === f.id ? `var(--tier-${selectedTier})` : 'rgba(0,0,0,0.3)',
                  color: statusFilter === f.id ? '#0d1017' : 'var(--color-text-main)',
                  minHeight: '36px'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto' }}>
          {filteredTasks.map(task => (
            <div
              key={task.id}
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: task.complete ? '1px solid rgba(78, 175, 84, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: task.complete ? '#fff' : 'var(--color-text-muted)' }}>
                  {task.name}
                </span>
                <a
                  href={getWikiSearchUrl(task.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wiki-link-icon"
                  title={`Search ${task.name} on OSRS Wiki`}
                >
                  <ExternalLink size={13} />
                </a>
              </div>

              {task.complete ? (
                <span className="badge badge-easy" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle2 size={12} /> Done
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Locked</span>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
