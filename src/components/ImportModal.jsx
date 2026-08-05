import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function ImportModal({ isOpen, onClose, onImportData }) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          onImportData(file.name, parsed);
          onClose();
        } catch (err) {
          setError(`Invalid JSON file ${file.name}: ${err.message}`);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleTextImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImportData('pasted_export.json', parsed);
      onClose();
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel modal-dialog" style={{ width: '100%', maxWidth: '560px', padding: '1.5rem', background: '#121622', border: '1px solid rgba(229,192,123,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Upload color="var(--color-gold)" size={22} />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Import Character Export JSON</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', minHeight: '36px', minWidth: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(231, 76, 60, 0.15)', border: '1px solid rgba(231,76,60,0.4)', color: '#e74c3c', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            Select Character Export JSON File(s)
          </label>
          <input
            type="file"
            accept=".json"
            multiple
            onChange={handleFileUpload}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(0,0,0,0.4)',
              border: '1px dashed rgba(229,192,123,0.3)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ textAlign: 'center', color: 'var(--color-text-dim)', fontSize: '0.8rem', margin: '1rem 0' }}>
          — OR PASTE JSON CONTENT BELOW —
        </div>

        <textarea
          rows={6}
          placeholder="Paste content of character.json, equipment.json, bank.json..."
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setError(null); }}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(229,192,123,0.2)',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            outline: 'none',
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button onClick={onClose} style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Cancel
          </button>
          <button
            onClick={handleTextImport}
            className="badge badge-gold"
            style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Import JSON
          </button>
        </div>

      </div>
    </div>
  );
}
