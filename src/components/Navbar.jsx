import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Play, Menu, X } from 'lucide-react';
import { getHome } from '../services/api';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    const handleStartWatching = async () => {
        try {
            const response = await getHome(1, 20);
            if (response && response.data && response.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.length);
                const randomDrama = response.data[randomIndex];
                navigate(`/drama/${randomDrama.id}`, { state: { drama: randomDrama } });
            }
        } catch (error) {
            console.error('Failed to get random drama:', error);
            navigate('/explore');
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <div className="navbar-brand">
                    <Link to="/">
                        <span className="brand-text">DRAMA<span className="text-gold">BOX</span></span>
                    </Link>
                </div>

                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/explore" className="nav-link">Explore</Link>
                    <Link to="/latest" className="nav-link">Latest</Link>
                    <Link to="/popular" className="nav-link">Popular</Link>
                    <Link to="/sulih-suara" className="nav-link">Sulih Suara</Link>
                    <Link to="/artikel" className="nav-link">Artikel</Link>
                    <Link to="/my-list" className="nav-link">My List</Link>
                </div>

                <div className="navbar-actions">
                    <form onSubmit={handleSearch} className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search dramas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <button className="btn btn-primary btn-sm" onClick={handleStartWatching}>
                        <Play size={16} fill="currentColor" />
                        Start Watching
                    </button>
                    <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
