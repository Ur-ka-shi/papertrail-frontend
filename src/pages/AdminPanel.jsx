import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ fetchGlobalData, studentRequests, refreshRequests }) {
    const [title, setTitle] = useState('');
    const [selectedBranches, setSelectedBranches] = useState([]); 
    const [semester, setSemester] = useState(1);
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('2025-26');
    const [type, setType] = useState('PAPER');
    const [examType, setExamType] = useState('End Sem');
    const [fileUrl, setFileUrl] = useState(''); // 🛠️ Changed from file to fileUrl

    const branchesList = ['AI', 'DS', 'CE', 'CST', 'ENC', 'IT'];

    const handleCheckboxChange = (branchName) => {
        if (selectedBranches.includes(branchName)) {
            setSelectedBranches(selectedBranches.filter(b => b !== branchName));
        } else {
            setSelectedBranches([...selectedBranches, branchName]);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        if (selectedBranches.length === 0) {
            alert('Please check at least one target branch stream.');
            return;
        }

        // Validate that it looks like a valid URL link
        if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
            alert('Please enter a valid document URL link starting with http:// or https://');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('semester', Number(semester)); 
        formData.append('subject', subject);
        formData.append('year', year); 
        formData.append('type', type);
        formData.append('examType', examType);
        formData.append('fileUrl', fileUrl); // 🛠️ Sending string link down the wire
        
        selectedBranches.forEach(b => {
            formData.append('branch', b);
        });

        try {
            console.log("Dispatching lightweight URL pointer payload to production backend...");
            const response = await axios.post('http://localhost:8080/resources/upload', formData);
            
            alert(response.data || 'Resource index published successfully!');
            
            setTitle(''); 
            setSubject(''); 
            setFileUrl(''); // Reset link field
            setSelectedBranches([]);
            
            if (typeof fetchGlobalData === 'function') {
                fetchGlobalData();
            }
        } catch (error) { 
            console.error("Upload handler dropped context trace:", error);
            if (error.response) {
                alert(`Backend rejected request: ${error.response.data}`);
            } else {
                alert("Network communication error. Verify local server state.");
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
                                    <option value="2025-26">2025-26</option>
                                    <option value="2024-25">2024-25</option>
                                    <option value="2023-24">2023-24</option>
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

                        {/* 🛠️ SWAPPED OUT FILE PICKER BOX FOR A SECURE URL LINK STRING FIELDS */}
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

                {/* INBOX CONTAINER */}
                <div style={{ background: '#171A21', border: '1px solid #2D323C', padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', margin: 0, color: '#F5F5F5' }}>Requests Inbox</h3>
                        <button onClick={refreshRequests} style={{ padding: '0.3rem 0.75rem', border: '1px solid #2D323C', background: '#0F1115', color: '#A9B0BB', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '3px' }}>Refresh</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                        {studentRequests.length === 0 ? (
                            <p style={{ color: '#A9B0BB', fontSize: '0.85rem', textAlign: 'center' }}>No current requests logged.</p>
                        ) : (
                            studentRequests.map(req => (
                                <div key={req.id} style={{ background: '#0F1115', border: '1px solid #2D323C', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #7eb3f5' }}>
                                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: '#F5F5F5' }}>{req.requestedDetails}</div>
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