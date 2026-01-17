import React, { useEffect, useState } from 'react';
import DramaCard from '../components/DramaCard';
import { Heart, Trash2 } from 'lucide-react';
import './MyList.css';

const MyList = () => {
    const [myList, setMyList] = useState([]);

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('myDramaList');
        if (saved) {
            setMyList(JSON.parse(saved));
        }
    }, []);

    const removeFromList = (dramaId) => {
        const updated = myList.filter(d => d.id !== dramaId && d.bookId !== dramaId);
        setMyList(updated);
        localStorage.setItem('myDramaList', JSON.stringify(updated));
    };

    const clearAll = () => {
        if (window.confirm('Are you sure you want to clear your entire list?')) {
            setMyList([]);
            localStorage.removeItem('myDramaList');
        }
    };

    return (
        <div className="mylist-page">
            <div className="container">
                <div className="mylist-header">
                    <div>
                        <h1 className="page-title">
                            <Heart size={32} fill="var(--accent-gold)" color="var(--accent-gold)" />
                            My List
                        </h1>
                        <p className="page-subtitle">
                            {myList.length} {myList.length === 1 ? 'drama' : 'dramas'} saved
                        </p>
                    </div>
                    {myList.length > 0 && (
                        <button className="btn btn-glass" onClick={clearAll}>
                            <Trash2 size={18} />
                            Clear All
                        </button>
                    )}
                </div>

                {myList.length === 0 ? (
                    <div className="empty-state">
                        <Heart size={64} strokeWidth={1} />
                        <h2>Your list is empty</h2>
                        <p>Start adding dramas by clicking the heart icon on any drama card!</p>
                    </div>
                ) : (
                    <div className="drama-grid animate-fade-in">
                        {myList.map((drama, idx) => (
                            <div key={`${drama.id}-${idx}`} className="mylist-item">
                                <DramaCard drama={drama} />
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromList(drama.id || drama.bookId)}
                                    title="Remove from list"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyList;
