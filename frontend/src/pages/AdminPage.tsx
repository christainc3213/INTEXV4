import React, { useState, useEffect } from 'react';
import { MovieType } from '../types/MovieType';
import { handleAddMovie, handleEditMovie, deleteMovie, fetchMovies } from '../api/moviesAPI';
import NewMovieForm from '../components/AddMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import styled from 'styled-components';
import Pagination from '../components/Pagination';

const AdminPage = () => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingMovie, setEditingMovie] = useState<MovieType | null>(null)

    useEffect(() => {
        const loadMovies = async (size = pageSize, page = currentPage) => {
            try {
                setLoading(true);
                const data = await fetchMovies(size, page);
                setMovies(data.movies || []);
                setTotalPages(Math.ceil((data.totalNumMovies || 0) / size));
            } catch (error) {
                setError((error as Error).message);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };                
        loadMovies();
    }, [pageSize, currentPage]);

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

    const handleDelete = async (show_id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
        if (!confirmDelete) return;

        try{
            await deleteMovie(show_id)
            setMovies(movies.filter((movie) => movie.show_id !== show_id))
        } catch (error) {
            alert('failed to delete movie. Please try again.')
        }
    }

    const getPosterPath = (title: string): string => {
        return `/Movie Posters/${title
            .replace(/[^\w\s]/g, "")   // remove non-word characters like &, :, /
            .trim()}.jpg`;
    };

    const paginatedMovies = movies || [];

    if (loading) {
        return <div className="text-center">Loading books...</div>; // Loading state
    }
    if (error) {
        return <div className="text-danger text-center">Error: {error}</div>; // Error state
    }

    return (
        <div style={{ backgroundColor: '#141414', color: '#fff' }}>
            <div style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Manage Movies</div>
                {!showForm && (
                                <div onClick={() => setShowForm(true)} style={{ cursor: 'pointer', color: '#facc15' }}>+ Add Movie</div>
            )}
            </div>

            <div style={{ padding: '2rem 4rem', alignItems: 'right' }}>
            {showForm && (
                <NewMovieForm
                    onSuccess={() => {
                        setShowForm(false);
                        try {
                            fetchMovies(pageSize, currentPage)
                            .then((data) => {
                                setMovies(data.movies);
                            });
                        } catch (error) {
                            console.error("Failed to fetch updated movies:", error);
                        }
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingMovie && (
                <EditMovieForm movie={editingMovie} onSuccess={() => {
                    setEditingMovie(null);
                    try {
                        fetchMovies(pageSize, currentPage)
                        .then((data) => {
                            setMovies(data.movies);
                        });
                    } catch (error) {
                        console.error("Failed to fetch updated movies:", error);
                    }
                }}
                onCancel={() => setEditingMovie(null)}
                />
            )}
                <br />
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <label>
                        Show:
                        <select value={pageSize} onChange={handlePageSizeChange} style={{ marginLeft: '0.5rem' }}>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={-1}>All</option>
                        </select>
                    </label>
                    <div>Page {currentPage} of {totalPages}</div>
                </div>

                <GenreRow>
                <GenreTitle>All Movies</GenreTitle>
                <ScrollRow>
                    {paginatedMovies.map((movie) => (
                    <MovieCard key={movie.show_id}>
                        <MoviePoster
                        src={getPosterPath(movie.title)}
                        alt={movie.title}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                        }}
                        />
                        <MovieOverlay className="overlay">
                        <h4>{movie.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                            onClick={() => setEditingMovie(movie)}
                            style={{
                                backgroundColor: '#facc15',
                                color: '#000',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            >
                            Edit
                            </button>
                            <button
                            onClick={() => handleDelete(movie.show_id)}
                            style={{
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                padding: '0.4rem 0.6rem',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            >
                            Delete
                            </button>
                        </div>
                        </MovieOverlay>
                    </MovieCard>
                    ))}
                </ScrollRow>
                </GenreRow>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AdminPage;

const GenreRow = styled.div`
  margin-top: 3rem;
  padding: 0 1rem;
`;

const GenreTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ScrollRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const MovieCard = styled.div`
  position: relative;
  min-width: 160px;
  max-width: 160px;
  height: 240px;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:hover .overlay {
    transform: translateY(0%);
    pointer-events: auto;
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MovieOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%);
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transform: translateY(100%);
  transition: transform 0.4s ease;
  pointer-events: none;

  & h4 {
    margin: 0;
    font-size: 1rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  & button {
    background: white;
    color: black;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.3s;

    &:hover {
      background: #eee;
    }
  }
`;


const GenreSelect = styled.select`
  margin-left: 16px;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;