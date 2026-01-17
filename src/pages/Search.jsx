import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DramaCard from '../components/DramaCard';
import { searchDrama } from '../services/api';
import './Home.css'; // Reuse grid styles

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const doSearch = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const data = await searchDrama(query);
                if (data && data.data) {
                    setResults(data.data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };
        doSearch();
    }, [query]);

    return (
        <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <h2 className="section-title">Search Results for "{query}"</h2>

            {loading ? (
                <div className="skeleton-grid">
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton card-skeleton"></div>)}
                </div>
            ) : (
                <div className="drama-grid">
                    {results.length > 0 ? (
                        results.map(drama => <DramaCard key={drama.id} drama={drama} />)
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
