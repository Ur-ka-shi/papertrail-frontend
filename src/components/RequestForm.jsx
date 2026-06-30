import React from 'react';

export default function RequestForm({ requestDetails, setRequestDetails, onSubmit }) {
    return (
        <div style={{ background: '#171A21', border: '1px solid #2D323C', padding: '2.5rem', borderRadius: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#F5F5F5' }}>Can't find a Resource?</h3>
                <p style={{ fontSize: '0.875rem', color: '#A9B0BB', lineHeight: '1.6' }}>
                    Tell us what you're looking for and we'll add it when available.
                </p>
            </div>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <textarea 
                        placeholder={`Example:\nOperating Systems Midsem 2025\nComputer Engineering\nSemester 4`} 
                        value={requestDetails}
                        onChange={e => setRequestDetails(e.target.value)}
                        style={{ background: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '4px', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', minHeight: '110px', resize: 'vertical', lineHeight: '1.5' }}
                        required
                    />
                </div>
                <button type="submit" style={{ background: '#4F8DFF', color: '#0F1115', border: 'none', padding: '0.65rem 1.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start' }}>
                    Request Resource
                </button>
            </form>
        </div>
    );
}