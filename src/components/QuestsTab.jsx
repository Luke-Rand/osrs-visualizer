import React, { useState, useMemo } from 'react';
import { Scroll, Search, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { getWikiUrl } from '../utils/osrsUtils';

export default function QuestsTab({ quests }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'FINISHED' | 'IN_PROGRESS' | 'NOT_STARTED'

  const summary = quests?.summary || { finished: 0, in_progress: 0, not_started: 0 };
  const questList = quests?.quests || [];
  const totalQuests = questList.length || 211;

  const filteredQuests = useMemo(() => {
    return questList.filter(q => {
      const matchSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || q.state === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [questList, searchTerm, statusFilter]);

  const completionPercent = totalQuests > 0 ? Math.round((summary.finished / totalQuests) * 100) : 0;

  return (
    <div className="quests-layout">
      
      {/* Top Summary Banner */}
      <div className="glass-panel quests-full-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Scroll color="var(--color-gold)" size={28} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Quest Progress</h2>
                <a
                  href="https://oldschool.runescape.wiki/w/Quests/Guides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wiki-btn"
                  title="View Quest Guides on OSRS Wiki"
                >
                  <span>Quest Guides</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {summary.finished} Finished • {summary.in_progress} In Progress • {summary.not_started} Unstarted
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 240px', maxWidth: '340px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Quest Completion Rate</span>
              <span style={{ fontWeight: 700, color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>{completionPercent}%</span>
            </div>
            <div className="progress-bar-bg" style={{ height: '10px' }}>
              <div className="progress-bar-fill" style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Quest Grid List */}
      <div className="glass-panel quests-full-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search quest name..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All (${questList.length})` },
              { id: 'FINISHED', label: `Finished (${summary.finished})` },
              { id: 'IN_PROGRESS', label: `In Progress (${summary.in_progress})` },
              { id: 'NOT_STARTED', label: `Unstarted (${summary.not_started})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: statusFilter === tab.id ? 600 : 400,
                  background: statusFilter === tab.id ? 'var(--color-gold)' : 'rgba(0,0,0,0.3)',
                  color: statusFilter === tab.id ? '#0d1017' : 'var(--color-text-main)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  minHeight: '36px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Quest List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem', maxHeight: '560px', overflowY: 'auto' }}>
          {filteredQuests.map((quest) => {
            const isFinished = quest.state === 'FINISHED';
            const isInProgress = quest.state === 'IN_PROGRESS';

            return (
              <div
                key={quest.id}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: isFinished ? '1px solid rgba(78, 175, 84, 0.2)' : isInProgress ? '1px solid rgba(52, 152, 219, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: isFinished ? '#fff' : 'var(--color-text-muted)' }}>
                    {quest.name}
                  </span>
                  <a
                    href={getWikiUrl(quest.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wiki-link-icon"
                    title={`View ${quest.name} on OSRS Wiki`}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div>
                  {isFinished && (
                    <span className="badge badge-easy" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> Done
                    </span>
                  )}
                  {isInProgress && (
                    <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>
                      <Clock size={12} /> In Progress
                    </span>
                  )}
                  {!isFinished && !isInProgress && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
                      Unstarted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
