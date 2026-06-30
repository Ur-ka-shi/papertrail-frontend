import React, { useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import RequestForm from '../components/RequestForm';

export default function StudentHub({ resources, fetchGlobalData, isAdminMode }) {
    const [activeTab, setActiveTab] = useState('papers'); 
    
    // Core filtration limits
    const [branch, setBranch] = useState('');
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [requestDetails, setRequestDetails] = useState('');

    // Chained Automated Calculation Matrix State
    const [semestersList, setSemestersList] = useState([
        { id: 1, sgpa: '', credits: '' }, { id: 2, sgpa: '', credits: '' },
        { id: 3, sgpa: '', credits: '' }, { id: 4, sgpa: '', credits: '' }
    ]);
    const [finalCgpaResult, setFinalCgpaResult] = useState(null);
    const [convertedPercentage, setConvertedPercentage] = useState(null);

    const livePapersCount = resources.filter(r => r.type === 'PAPER').length;
    const liveNotesCount = resources.filter(r => r.type === 'NOTE').length;

    const filteredResources = resources.filter(res => {
        const matchesTab = 
            (activeTab === 'papers' && res.type === 'PAPER') || 
            (activeTab === 'notes' && res.type === 'NOTE') || 
            (activeTab === 'lab' && res.type === 'LAB') || 
            (activeTab === 'syllabus' && res.type === 'SYLLABUS');
        const matchesBranch = !branch || res.branch === branch;
        const matchesSemester = !semester || res.semester === parseInt(semester);
        
        // 🛠️ Year Matching Strategy: Check string match gracefully 
        const matchesYear = !year || String(res.year).includes(year.split('-')[0]);
        
        const matchesSearch = !searchQuery || 
            res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            res.subject.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesTab && matchesBranch && matchesSemester && matchesYear && matchesSearch;
    });

    const handleDownloadClick = async (res) => {
        if (!res.fileUrl) {
            alert("No cloud storage reference link available for this item.");
            return;
        }
        // 🛠️ Redirect directly to your personal Google Drive in a fresh clean window frame
        window.open(res.fileUrl, '_blank', 'noopener,noreferrer');

        // Fire metric tracker background request
        try {
            // 🛠️ Updated to live Render URL
            await axios.post(`https://papertrail-backend-quej.onrender.com/resources/${res.id}/increment-download`);
            setTimeout(() => { fetchGlobalData(); }, 300);
        } catch (e) { console.error("Increment tracker metric skipped:", e); }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            // 🛠️ Updated to live Render URL
            await axios.post('https://papertrail-backend-quej.onrender.com/requests', { 
                requestedDetails: requestDetails, 
                branch: branch || 'GENERAL', 
                semester: parseInt(semester) || 1, 
                status: 'PENDING' 
            });
            alert('Request submitted successfully.');
            setRequestDetails('');
        } catch (error) { alert('Backend validation connectivity trace error.'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently erase this resource item?")) {
            try {
                // 🛠️ Updated to live Render URL
                await axios.delete(`https://papertrail-backend-quej.onrender.com/resources/${id}`);
                fetchGlobalData();
            } catch (error) { console.error(error); }
        }
    };

    // Automated Chained pipeline calculation math logic
    const calculateAutomatedPipeline = () => {
        let totalPoints = 0, totalCredits = 0;
        semestersList.forEach(sem => {
            const sgpa = parseFloat(sem.sgpa);
            const credits = parseFloat(sem.credits);
            if (!isNaN(sgpa) && !isNaN(credits) && credits > 0) {
                totalPoints += (sgpa * credits);
                totalCredits += credits;
            }
        });
        if (totalCredits > 0) {
            const cgpa = totalPoints / totalCredits;
            setFinalCgpaResult(cgpa.toFixed(2));
            setConvertedPercentage(((7.1 * cgpa) + 11).toFixed(2));
        } else {
            setFinalCgpaResult(null);
            setConvertedPercentage(null);
        }
    };

    return (
        <div id="top-root" style={{ background: '#0F1115', color: '#F5F5F5', minHeight: '100vh', paddingBottom: '6rem', fontFamily: "'Inter', sans-serif" }}>
            <Hero livePapersCount={livePapersCount} liveNotesCount={liveNotesCount} />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <section id="archive-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3.5rem', borderBottom: '1px solid #2D323C' }}>
                
                <aside style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={filterHeading}>Branch Stream</div>
                        <select value={branch} onChange={e => setBranch(e.target.value)} style={selectStyle}>
                            <option value="">All Branches</option>
                            <option value="AI">Artificial Intelligence</option>
                            <option value="DS">Data Science</option>
                            <option value="CE">Computer Engineering</option>
                            <option value="CST">Computer Science & Tech</option>
                            <option value="ENC">Electronics & Telecom</option>
                            <option value="IT">Information Technology</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={filterHeading}>Semester Term</div>
                        <select value={semester} onChange={e => setSemester(e.target.value)} style={selectStyle}>
                            <option value="">All Semesters</option>
                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                    </div>
                    <div>
                        <div style={filterHeading}>Academic Year</div>
                        <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
                            <option value="">All Years</option>
                            <option value="2025-26">2025-26</option>
                            <option value="2024-25">2024-25</option>
                            <option value="2023-24">2023-24</option>
                        </select>
                    </div>
                </aside>

                <main>
                    <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #2D323C', marginBottom: '2.5rem' }}>
                        <button onClick={() => setActiveTab('papers')} style={tabBtn(activeTab === 'papers')}>Question Papers</button>
                        <button onClick={() => setActiveTab('notes')} style={tabBtn(activeTab === 'notes')}>Study Notes</button>
                        <button onClick={() => setActiveTab('lab')} style={tabBtn(activeTab === 'lab')}>Lab Manuals</button>
                        <button onClick={() => setActiveTab('syllabus')} style={tabBtn(activeTab === 'syllabus')}>Syllabus</button>
                    </div>

                    <div style={{ minHeight: '350px' }}>
                        {filteredResources.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#171A21', border: '1px dashed #2D323C', borderRadius: '6px', color: '#A9B0BB' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#F5F5F5', marginBottom: '4px' }}>No resources found.</div>
                                <div style={{ fontSize: '0.85rem' }}>Try changing your filters or submit an indexing request block below.</div>
                            </div>
                        ) : (
                            filteredResources.map(res => (
                                <div key={res.id} style={{ background: '#171A21', border: '1px solid #2D323C', padding: '1.25rem 1.5rem', borderRadius: '4px', marginBottom: '0.85rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '42px', height: '48px', background: '#2D323C', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', color: '#4F8DFF', flexDirection: 'column' }}>PDF</div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#F5F5F5', marginBottom: '0.3rem' }}>{res.title}</div>
                                        <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.78rem', color: '#A9B0BB', flexWrap: 'wrap' }}>
                                            <span style={{ color: '#4F8DFF', fontWeight: '700' }}>[{res.type}]</span>
                                            <span>{res.branch}</span>
                                            <span>Sem {res.semester}</span>
                                            {res.examType && <span>{res.examType}</span>}
                                            <span>{res.year}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                        {/* 🛠️ CONVERTED TO A SECURE POINTER ONCLICK OPENER */}
                                        <button 
                                            onClick={() => handleDownloadClick(res)} 
                                            style={{ background: '#4F8DFF', color: '#0F1115', border: 'none', padding: '0.45rem 1.1rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                                        >
                                            ↓ Download
                                        </button>
                                        {isAdminMode && <button onClick={() => handleDelete(res.id)} style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid #2D323C', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.7rem', cursor: 'pointer', marginTop: '4px' }}>Delete</button>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </section>

            {/* CGPA CALCULATOR */}
            <section id="cgpa-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem', borderBottom: '1px solid #2D323C' }}>
                <h2 style={sectionHeader}>CGPA Calculator</h2>
                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
                    
                    <div style={{ flex: '1.4', background: '#171A21', border: '1px solid #2D323C', padding: '2.5rem', borderRadius: '6px' }}>
                        <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#F5F5F5' }}>Enter Semester-wise SGPA</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {semestersList.map((sem, idx) => (
                                <div key={sem.id} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', width: '90px', color: '#A9B0BB', fontWeight: '600' }}>Semester {idx + 1}</span>
                                    <input type="number" placeholder="SGPA" value={sem.sgpa} onChange={e => { const n = [...semestersList]; n[idx].sgpa = e.target.value; setSemestersList(n); }} style={calcInput} />
                                    <input type="number" placeholder="Credits" value={sem.credits} onChange={e => { const n = [...semestersList]; n[idx].credits = e.target.value; setSemestersList(n); }} style={calcInput} />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
                            <button onClick={() => setSemestersList([...semestersList, { id: Date.now(), sgpa: '', credits: '' }])} style={calcSecBtn}>+ Add Semester</button>
                            <button onClick={calculateAutomatedPipeline} style={calcPrimBtn}>Calculate Standing Metrics</button>
                        </div>
                    </div>

                    <div style={{ flex: '1', background: '#171A21', border: '1px solid #2D323C', padding: '2.5rem', borderRadius: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        {finalCgpaResult ? (
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#A9B0BB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weighted Graduation Standings</div>
                                <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#4F8DFF', margin: '0.5rem 0' }}>{finalCgpaResult}</div>
                                <div style={{ fontSize: '0.75rem', color: '#A9B0BB', marginBottom: '1.5rem' }}>CUMULATIVE CGPA</div>
                                <div style={{ borderTop: '1px solid #2D323C', paddingTop: '1rem', fontSize: '1rem', color: '#F5F5F5' }}>
                                    UMIT Percentage Equivalent: <strong style={{ color: '#4F8DFF' }}>{convertedPercentage}%</strong>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#A9B0BB', fontSize: '0.9rem' }}>Enter semester values to generate your automated CGPA metric and percentage profiles.</div>
                        )}
                    </div>

                </div>
            </section>

            <section id="request-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
                <h2 style={sectionHeader}>Request a Resource</h2>
                <div style={{ marginTop: '2.5rem' }}>
                    <RequestForm requestDetails={requestDetails} setRequestDetails={setRequestDetails} onSubmit={handleRequestSubmit} />
                </div>
            </section>

        </div>
    );
}

const filterHeading = { fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A9B0BB', marginBottom: '0.5rem' };
const selectStyle = { width: '100%', background: '#171A21', border: '1px solid #2D323C', color: '#F5F5F5', padding: '0.6rem 0.8rem', borderRadius: '4px', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' };
const tabBtn = (isActive) => ({ padding: '10px 20px', background: 'transparent', color: isActive ? '#4F8DFF' : '#A9B0BB', border: 'none', borderBottom: isActive ? '2px solid #4F8DFF' : '2px solid transparent', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', paddingBottom: '12px' });
const sectionHeader = { fontSize: '1.5rem', fontWeight: '700', color: '#F5F5F5', paddingBottom: '0.5rem', borderBottom: '1px solid #2D323C' };
const calcInput = { background: '#0F1115', border: '1px solid #2D323C', color: '#F5F5F5', padding: '0.5rem 0.7rem', fontSize: '0.875rem', outline: 'none', width: '110px', borderRadius: '4px', textAlign: 'center' };
const calcSecBtn = { padding: '8px 14px', background: 'transparent', border: '1px solid #2D323C', color: '#A9B0BB', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', borderRadius: '4px' };
const calcPrimBtn = { padding: '8px 18px', background: '#4F8DFF', border: 'none', color: '#0F1115', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', borderRadius: '4px' };