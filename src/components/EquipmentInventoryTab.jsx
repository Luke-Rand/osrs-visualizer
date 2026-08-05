import React, { useState } from 'react';
import { EQUIPMENT_SLOTS, getItemIconUrl, formatQuantity, getWikiUrl } from '../utils/osrsUtils';
import { Shield, Package, Info, ExternalLink } from 'lucide-react';


export default function EquipmentInventoryTab({ equipment, inventory }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const eqItems = equipment?.items || [];
  const invItems = inventory?.items || [];

  // Map equipment items by slot number
  const eqBySlot = {};
  eqItems.forEach(item => {
    eqBySlot[item.slot] = item;
  });

  // Map inventory items by slot 0-27
  const invBySlot = {};
  invItems.forEach(item => {
    invBySlot[item.slot] = item;
  });

  return (
    <div className="equipment-inventory-layout">
      
      {/* Left: Authentic Equipment Paperdoll */}
      <div className="glass-panel equipment-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield color="var(--color-gold)" size={24} />
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Equipped Gear ({eqItems.length} Items)</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative', minHeight: '340px' }}>
          
          {/* Row 1: Head */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[0]} item={eqBySlot[0]} onHover={setHoveredItem} />
          </div>

          {/* Row 2: Cape, Neck, Ammo */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[1]} item={eqBySlot[1]} onHover={setHoveredItem} />
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[2]} item={eqBySlot[2]} onHover={setHoveredItem} />
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[10]} item={eqBySlot[13]} onHover={setHoveredItem} />
          </div>

          {/* Row 3: Weapon, Body, Shield */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[3]} item={eqBySlot[3]} onHover={setHoveredItem} />
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[4]} item={eqBySlot[4]} onHover={setHoveredItem} />
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[5]} item={eqBySlot[5]} onHover={setHoveredItem} />
          </div>

          {/* Row 4: Legs */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[6]} item={eqBySlot[7]} onHover={setHoveredItem} />
          </div>

          {/* Row 5: Gloves, Boots, Ring */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[7]} item={eqBySlot[9]} onHover={setHoveredItem} />
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[8]} item={eqBySlot[10]} onHover={setHoveredItem} />
            <EquipmentSlot slotMeta={EQUIPMENT_SLOTS[9]} item={eqBySlot[12]} onHover={setHoveredItem} />
          </div>

        </div>

        {/* List view of equipped items */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Equipped Items Summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
            {eqItems.map(item => (
              <div 
                key={item.slot}
                onClick={() => setHoveredItem(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <img src={getItemIconUrl(item.id)} alt={item.name} style={{ width: '24px', height: '24px' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right: Authentic 28-slot Inventory Grid */}
      <div className="glass-panel inventory-col" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package color="var(--color-gold)" size={24} />
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Inventory ({inventory?.item_count || 0} / 28)</h2>
          </div>
        </div>

        {/* 4 columns x 7 rows Inventory Grid */}
        <div 
          className="inventory-grid-box"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '0.65rem',
            background: '#121620',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '2px solid rgba(229, 192, 123, 0.2)',
            maxWidth: '320px',
            margin: '0 auto'
          }}
        >
          {Array.from({ length: 28 }).map((_, slotIndex) => {
            const item = invBySlot[slotIndex];
            return (
              <div
                key={slotIndex}
                className="item-slot"
                style={{ width: '52px', height: '52px', cursor: item ? 'pointer' : 'default' }}
                onMouseEnter={() => item && setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => item && setHoveredItem(item)}
              >
                {item ? (
                  <>
                    <img src={getItemIconUrl(item.id)} alt={item.name} />
                    {item.quantity > 1 && <span className="qty">{formatQuantity(item.quantity)}</span>}
                  </>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.08)' }}>{slotIndex + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hovered/Selected Item Info Bar */}
        <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(229,192,123,0.1)', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          {hoveredItem ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={getItemIconUrl(hoveredItem.id)} alt={hoveredItem.name} style={{ width: '32px', height: '32px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-gold)', fontSize: '0.9rem' }}>{hoveredItem.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ID: {hoveredItem.id} • Quantity: {hoveredItem.quantity.toLocaleString()}
                  </div>
                </div>
              </div>

              <a
                href={getWikiUrl(hoveredItem.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-btn"
                title={`View ${hoveredItem.name} on OSRS Wiki`}
              >
                <span>Wiki</span>
                <ExternalLink size={12} />
              </a>
            </>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} /> Tap or hover over an item to view details
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

function EquipmentSlot({ slotMeta, item, onHover }) {
  return (
    <div
      className="item-slot"
      style={{ width: '54px', height: '54px', cursor: item ? 'pointer' : 'default' }}
      onMouseEnter={() => item && onHover(item)}
      onMouseLeave={() => onHover(null)}
      onClick={() => item && onHover(item)}
    >
      {item ? (
        <>
          <img src={getItemIconUrl(item.id)} alt={item.name} />
          {item.quantity > 1 && <span className="qty">{formatQuantity(item.quantity)}</span>}
        </>
      ) : (
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', textAlign: 'center' }}>
          {slotMeta?.name || 'Slot'}
        </span>
      )}
    </div>
  );
}
