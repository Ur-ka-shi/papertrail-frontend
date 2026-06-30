import React from 'react';

export default function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div style={{ background: '#08090a', color: '#fff', padding: '1.5rem 0 3rem 0', textAlign: 'center', borderBottom: '1px solid #d4cfc7' }}>
            <div style={{ maxWidth: '820px', margin: '0 auto', padding: '0 1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7eb3f5', marginBottom: '0.5rem', display: 'block' }}>
                    Find Resources
                </span>
                <div style={{ display: 'flex', border: '1.5px solid #fff', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
                    <input 
                        type="text" 
                        placeholder="Search by subject name, topic, or keyword..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, border: 'none', padding: '0.85rem 1rem', fontSize: '0.95rem', outline: 'none', color: '#0f0f0f' }}
                    />
                </div>
            </div>
        </div>
    );
}