import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ fetchGlobalData, studentRequests, refreshRequests }) {
    const [title, setTitle] = useState('');
    const [selectedBranches, setSelectedBranches] = useState([]); 
    const [semester, setSemester] = useState(1);
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('2026'); 
    const [type, setType] = useState('PAPER');
    const [examType, setExamType] = useState('End Sem');
    const [fileUrl, setFileUrl] = useState(''); 

    const branchesList = ['AI', 'DS', 'CE', 'CST', 'ENC', 'IT'];

    const handleCheckboxChange = (branchName) => {
        if (selectedBranches.includes(branchName)) {
            setSelectedBranches(selectedBranches.filter(b => b !== branchName));
        } else {
            setSelectedBranches([...selectedBranches, branchName]);
        }
    };

    // 🚀 NEW: Axios handler to delete/clear a resolved student request from the inbox
    const handleClearRequest = async (id) => {
        if (window.confirm("Mark this student request as resolved and clear it from the inbox?")) {
            try {
                console.log(`Sending DELETE pointer context trace for Request ID: ${id}...`);
                await axios.delete(`https://papertrail-backend-quej.onrender.com/requests/${id}`);
                
                alert('Request marked as resolved and removed.');
                
                if (typeof refreshRequests === 'function') {
                    refreshRequests(); // Refresh the list state dynamically
                }
            } catch (error) {
                console.error("Failed to clear request row context trace:", error);
                alert("Error communicating with backend to drop request asset.");
            }
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        if (selectedBranches.length === 0) {
            alert('Please check at least one target branch stream.');
            return;
        }

        if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
            alert('Please enter a valid document URL link starting with http:// or https://');
            return;
        }

        // 🚀 Switch to FormData because the backend uses @RequestParam parameters!
        const formData = new FormData();
        formData.append('title', title);
        formData.append('semester', Number(semester)); 
        formData.append('subject', subject);
        formData.append('year', year); 
        formData.append('type', type);
        formData.append('examType', examType);
        formData.append('fileUrl', fileUrl); 
        
        // Append each selected branch name cleanly so Java receives it as a List<String>
        selectedBranches.forEach(b => {
            formData.append('branch', b);
        });

        try {
            console.log("Dispatching multipart form payload to production backend...");
            
            await axios.post('https://papertrail-backend-quej.onrender.com/resources/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            alert('Resource index published successfully!');
            
            // Flush all layout form fields back to standard empty states
            setTitle(''); 
            setSubject(''); 
            setFileUrl(''); 
            setSelectedBranches([]);
            setSemester(1);
            setYear('2026'); 
            setType('PAPER');
            setExamType('End Sem');
            
            if (typeof fetchGlobalData === 'function') {
                fetchGlobalData();
            }
        } catch (error) { 
            console.error("Upload handler dropped context trace:", error);
            if (error.response) {
                alert(`Backend rejected request: ${error.response.data || 'Validation failed.'}`);
            } else {
                alert("Network communication error. Verify your live backend deployment status.");
            }
        }
    };

    return (
        <div style={{ background: '#0F1115', minHeight: '80vh', padding: '2rem 0', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                
                {/* UPLOAD PANEL COMPONENT */}
                <div style={{ background: '#171A21', border: '1px solid #2D323C', padding: '2.5rem', borderRadius: '4px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', marginBottom: '1.5rem', color: '#F5F5F5' }}>Index Google Drive Document</h3>
                    <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        <div style={groupStyle}>
                            <label style={labelStyle}>Document Title</label>
                            <input type="text" placeholder="e.g. Operating Systems Module 1" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                        </div>

                        <div style={groupStyle}>
                            <label style={labelStyle}>Course Subject Code</label>
                            <input type="text" placeholder="e.g. OS" value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle} required />
                        </div>
                        
                        <div style={groupStyle}>
                            <label style={labelStyle}>Target Branches (Check all applicable options)</label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px', background: '#0F1115', padding: '12px', borderRadius: '4px', border: '1px solid #2D323C' }}>
                                {branchesList.map(b => (
                                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#A9B0BB', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedBranches.includes(b)} 
                                            onChange={() => handleCheckboxChange(b)}
                                            style={{ accentColor: '#7eb3f5' }}
                                        />
                                        {b}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Semester</label>
                                <select value={semester} onChange={e => setSemester(parseInt(e.target.value))} style={selectStyle}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Academic Year</label>
                                <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Material Type</label>
                                <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
                                    <option value="PAPER">Paper</option>
                                    <option value="NOTE">Note</option>
                                    <option value="LAB">Lab Manual</option>
                                    <option value="SYLLABUS">Syllabus</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Exam Scope</label>
                                <select value={examType} onChange={e => setExamType(e.target.value)} style={selectStyle}>
                                    <option value="End Sem">End Sem</option>
                                    <option value="Mid Sem">Mid Sem</option>
                                </select>
                            </div>
                        </div>

                        <div style={groupStyle}>
                            <label style={labelStyle}>Google Drive Sharable Link</label>
                            <input 
                                type="text" 
                                placeholder="https://drive.google.com/file/d/.../view?usp=sharing" 
                                value={fileUrl} 
                                onChange={e => setFileUrl(e.target.value)} 
                                style={inputStyle} 
                                required 
                            />
                        </div>

                        <button type="submit" style={{ background: '#7eb3f5', color: '#0F1115', border: 'none', padding: '0.75rem', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
                            Publish Link to Live Directory
                        </button>
                    </form>
                </div>

                {/* INBOX CONTAINER WITH RESOLUTION CONTROLS */}
                <div style={{ background: '#171A21', border: '1px solid #2D323C', padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', margin: 0, color: '#F5F5F5' }}>Requests Inbox</h3>
                        <button onClick={refreshRequests} style={{ padding: '0.3rem 0.75rem', border: '1px solid #2D323C', background: '#0F1115', color: '#A9B0BB', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '3px' }}>Refresh</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                        {!studentRequests || studentRequests.length === 0 ? (
                            <p style={{ color: '#A9B0BB', fontSize: '0.85rem', textAlign: 'center' }}>No current requests logged.</p>
                        ) : (
                            studentRequests.map(req => (
                                <div key={req.id} style={{ background: '#0F1115', border: '1px solid #2D323C', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #7eb3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '13.5px', fontWeight: '500', color: '#F5F5F5' }}>{req.requestedDetails}</div>
                                        <div style={{ fontSize: '11px', color: '#A9B0BB', marginTop: '4px' }}>Sem {req.semester} • {req.branch}</div>
                                    </div>
                                    
                                    {/* 🚀 NEW: Interactive Clear Button */}
                                    <button 
                                        onClick={() => handleClearRequest(req.id)}
                                        style={{ 
                                            background: 'transparent', 
                                            border: '1px solid #E06C75', 
                                            color: '#E06C75', 
                                            padding: '4px 8px', 
                                            borderRadius: '3px', 
                                            fontSize: '11px', 
                                            fontWeight: '600', 
                                            cursor: 'pointer', 
                                            transition: 'all 0.2s',
                                            marginLeft: '12px'
                                        }}
                                        onMouseEnter={(e) => { e.target.style.background = '#E06C75'; e.target.style.color = '#0F1115'; }}
                                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#E06C75'; }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

const groupStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const labelStyle = { fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A9B0BB' };
const inputStyle = { background: '#0F1115', border: '1px solid #2D323C', color: '#F5F5F5', borderRadius: '4px', padding: '0.65rem 0.8rem', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const selectStyle = { background: '#0F1115', border: '1px solid #2D323C', color: '#F5F5F5', borderRadius: '4px', padding: '0.6rem', fontSize: '0.85rem', outline: 'none', width: '100%', cursor: 'pointer', marginTop: '4px' };