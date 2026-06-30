import React from 'react';

export default function ResourceCard({ resource, isAdmin, onDelete }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #d4cfc7', borderRadius: '4px', padding: '1.1rem 1.25rem', marginBottom: '0.75rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '48px', background: resource.type === 'NOTE' ? '#e8f5ee' : '#e8eef7', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', color: resource.type === 'NOTE' ? '#1a6b3c' : '#1a4a8a', border: '1px solid rgba(0,0,0,0.05)', flexDirection: 'column', gap: '2px' }}>
                {resource.type}<br />PDF
            </div>
            <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f0f0f', marginBottom: '0.3rem' }}>{resource.title}</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#7a7a7a', flexWrap: 'wrap' }}>
                    <span style={{ background: resource.type === 'NOTE' ? '#e8f5ee' : '#e8eef7', color: resource.type === 'NOTE' ? '#1a6b3c' : '#1a4a8a', fontSize: '0.7rem', fontWeight: '600', padding: '0.15rem 0.5rem', borderRadius: '2px' }}>
                        {resource.type}
                    </span>
                    <span>{resource.branch}</span>
                    {resource.type !== 'SYLLABUS' && <span>Sem {resource.semester}</span>}
                    {resource.examType && <span>{resource.examType}</span>}
                    <span>{resource.year}</span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <a href={`http://https://papertrail-backend-quej.onrender.com/resources/${resource.id}/download`} style={{ background: '#0f0f0f', color: '#fff', textDecoration: 'none', padding: '0.45rem 1rem', borderRadius: '3px', fontSize: '0.78rem', fontWeight: '600' }}>
                    ↓ Download
                </a>
                {isAdmin && (
                    <button onClick={() => onDelete(resource.id)} style={{ background: 'transparent', color: '#c0392b', border: '1px solid #d4cfc7', padding: '0.45rem 1rem', borderRadius: '3px', fontSize: '0.78rem', cursor: 'pointer' }}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}