import React from 'react';

export default function Hero({ livePapersCount, liveNotesCount }) {
    return (
        <div>
            {/* Compressed Hero Footprint — Height reduced by 30% */}
            <section style={{ background: '#0f0f0f', color: '#fff', padding: '4rem 2rem 3.5rem', textAlign: 'center', borderBottom: '1px solid #d4cfc7' }}>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7eb3f5', fontWeight: '600', marginBottom: '1rem' }}>
                    SNDT Women's University · UMIT
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.75rem', lineHeight: '1.2', marginBottom: '1.25rem', fontWeight: '700', maxWidth: '700px', margin: '0 auto 1.25rem auto' }}>
                    Paper<span style={{ color: '#7eb3f5' }}>Trail</span> - Academic Resource Platform
                </h1>
                <p style={{ fontSize: '1rem', color: '#aaa', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
                    Find Previous-Year Papers, Notes, and Lab Manuals in One Place. <br />
                    Centralized, searchable, downloadable. <span style={{ color: '#7eb3f5' }}>No more Whatsapp Hunting</span>
                </p>
            </section>

            {/* Live Statistics Strip Block */}
            <div style={{ background: '#f3f0eb', borderBottom: '1px solid #d4cfc7', display: 'flex', justifyContent: 'center', gap: '0' }}>
                <div style={statBox}><span style={statNum}>{livePapersCount}</span><span style={statLabel}>Papers</span></div>
                <div style={statBox}><span style={statNum}>{liveNotesCount}</span><span style={statLabel}>Notes</span></div>
                <div style={statBox}><span style={statNum}>6</span><span style={statLabel}>Branches</span></div>
                <div style={statBox}><span style={statNum}>8</span><span style={statLabel}>Semesters</span></div>
            </div>
        </div>
    );
}

// Enterprise Light Editorial Stats Styling
const statBox = { padding: '1rem 2.5rem', textAlign: 'center', borderRight: '1px solid #d4cfc7' };
const statNum = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', color: '#1a4a8a', display: 'block', fontWeight: '700' };
const statLabel = { fontSize: '0.7rem', color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' };