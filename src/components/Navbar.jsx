import React from 'react';

export default function Navbar({ onAdminClick, currentView }) {
    const scrollToSection = (id) => {
        // 🚀 IF CURRENTLY IN ADMIN VIEW: Exit admin view first, then jump back home
        if (currentView === 'admin' && typeof onAdminClick === 'function') {
            onAdminClick(); // Flips the layout view state back to home mode
            
            // Allow a brief millisecond timeout for React to mount the home DOM nodes before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 80);
            return;
        }

        // 🚀 FOR RESOURCES / LOGO: Force absolute window top positioning
        if (id === 'hub-directory') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 🚀 FOR OTHER SECTIONS: Smooth anchor scrolling down the viewport
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav style={{ background: '#0f0f0f', padding: '0 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', position: 'sticky', top: 0, zIndex: 100 }}>
            {/* 🚀 Made the brand logo clickable to reset view position to absolute top */}
            <span 
                onClick={() => scrollToSection('hub-directory')} 
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', color: '#fff', letterSpacing: '0.02em', fontWeight: '700', cursor: 'pointer' }}
            >
                Paper<span style={{ color: '#7eb3f5' }}>Trail</span>
            </span>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                <span onClick={() => scrollToSection('hub-directory')} style={navLinkStyle}>Resources</span>
                <span onClick={() => scrollToSection('cgpa-section')} style={navLinkStyle}>CGPA Calculator</span>
                <span onClick={() => scrollToSection('request-section')} style={navLinkStyle}>Request Resource</span>
                
                <button 
                    onClick={onAdminClick}
                    style={{ background: '#1a4a8a', color: '#fff', border: 'none', padding: '0.4rem 1.2rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                    {currentView === 'admin' ? 'Exit Panel' : 'Admin'}
                </button>
            </div>
        </nav>
    );
}

const navLinkStyle = { color: '#ccc', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' };