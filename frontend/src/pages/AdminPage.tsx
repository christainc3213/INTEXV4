import React, { useState, useEffect } from 'react';
import { MovieType } from '../types/MovieType';

const AdminPage = () => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('https://localhost:5001/MovieTitles');
            const data = await res.json();
            setMovies(data);
        };
        fetchData();
    }, []);

    const totalPages = Math.ceil(movies.length / pageSize);

    const handleDelete = (id?: string) => {
        alert(`Are you sure you want to delete movie with ID: ${id}`);
        setMovies((prev) => prev.filter((movie) => movie.docId !== id));
    };

    const handleEdit = (movie: MovieType) => {
        alert(`Edit movie: ${movie.title}`);
    };

    const handleAddMovie = () => {
        alert('Add new movie');
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const paginatedMovies = pageSize === -1
        ? movies
        : movies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ backgroundColor: '#141414', color: '#fff' }}>
            <div style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Manage Movies</div>
                <div onClick={handleAddMovie} style={{ cursor: 'pointer', color: '#facc15' }}>+ Add Movie</div>
            </div>

            <div style={{ padding: '2rem 4rem' }}>
                <h2>All Movies</h2>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <label>
                        Show:
                        <select value={pageSize} onChange={handlePageSizeChange} style={{ marginLeft: '0.5rem' }}>
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={-1}>All</option>
                        </select>
                    </label>
                    <div>Page {currentPage} of {totalPages}</div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {paginatedMovies.map((movie) => (
                        <div key={movie.docId} style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '12px' }}>
                            <img
                                src={`/images/films/${movie.genre}/${movie.slug}/small.jpg`}
                                alt={movie.title}
                                style={{ width: '100%', borderRadius: '8px' }}
                                onClick={() => alert(`Clicked on ${movie.title}`)}
                            />
                            <h3>{movie.title}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.8rem' }}>{movie.genre}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                                <button
                                    onClick={() => handleEdit(movie)}
                                    style={{ backgroundColor: '#facc15', color: '#000', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(movie.docId)}
                                    style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {pageSize !== -1 && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(1)}>First</button>
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => handlePageChange(idx + 1)}
                                style={{ fontWeight: currentPage === idx + 1 ? 'bold' : 'normal' }}>
                                {idx + 1}
                            </button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>Last</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;