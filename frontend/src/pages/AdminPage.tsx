import React, { useState, useEffect } from "react";
import { MovieType } from "../types/MovieType";
import {
  handleAddMovie,
  handleEditMovie,
  deleteMovie,
  fetchMovies,
} from "../api/moviesAPI";
import NewMovieForm from "../components/AddMovieForm";
import EditMovieForm from "../components/EditMovieForm";
import styled from "styled-components";
import Pagination from "../components/Pagination";
import AdminHeader from "./AdminHeader";
import AdminAuthorizeView from "../components/AdminAuthorizeView";

const AdminPage = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<MovieType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMovies = async (
    size = pageSize,
    page = currentPage,
    search = searchQuery
  ) => {
    try {
      setLoading(true);
      const data = await fetchMovies(size, page, search);
      setMovies(data.movies || []);
      setTotalPages(Math.ceil((data.totalNumMovies || 0) / size));
    } catch (error) {
      setError((error as Error).message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(show_id);
      setMovies(movies.filter((movie) => movie.show_id !== show_id));
    } catch (error) {
      alert("Failed to delete movie. Please try again.");
    }
  };

  const handleEdit = (movie: MovieType) => {
    setEditingMovie(movie);
  };

  const handleShowAddMovieForm = () => {
    setShowForm(true);
  };

  const getPosterPath = (title: string): string => {
    return `/Movie Posters/${title.replace(/[^\w\s]/g, "").trim()}.jpg`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadMovies();
  }, [pageSize, currentPage]);

  const paginatedMovies = movies || [];

  if (loading) {
    return <div className="text-center">Loading movies...</div>;
  }
  if (error) {
    return <div className="text-danger text-center">Error: {error}</div>;
  }

  return (
    <AdminAuthorizeView>
      <AdminContainer>
        <AdminHeader
          allMovies={movies}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loadMovies={loadMovies}
          handleShowAddMovieForm={handleShowAddMovieForm}
          loading={loading}
        />
        {showForm && (
          <NewMovieForm
            onSuccess={() => {
              setShowForm(false);
              loadMovies();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {editingMovie && (
          <EditMovieForm
            movie={editingMovie}
            onSuccess={() => {
              setEditingMovie(null);
              loadMovies();
            }}
            onCancel={() => setEditingMovie(null)}
          />
        )}
        <div style={{ padding: "1rem 4rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <label>
              Show:
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{ marginLeft: "0.5rem" }}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={-1}>All</option>
              </select>
            </label>
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>
          {movies.length > 0 ? (
            <GenreRow>
              <GenreTitle>All Movies</GenreTitle>
              <ScrollRow>
                {paginatedMovies.map((movie) => (
                  <MovieCard key={movie.show_id}>
                    <MoviePoster
                      src={getPosterPath(movie.title)}
                      alt={movie.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/Movie Posters/fallback.jpg";
                      }}
                    />
                    <MovieOverlay className="overlay">
                      <h4>{movie.title}</h4>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setEditingMovie(movie)}
                          style={{
                            backgroundColor: "#facc15",
                            color: "#000",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(movie.show_id)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "#fff",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "4px",
                            cursor: "pointer",
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
          ) : (
            <div>No movies found.</div>
          )}
        </div>
        <div style={{ padding: "1rem 6rem" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </AdminContainer>
    </AdminAuthorizeView>
  );
};

export default AdminPage;

const AdminContainer = styled.div`
  background-color: #141414;
  color: #fff;
  padding-top: 5rem;
`;

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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.855rem;
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

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledIcon = styled.div`
  font-size: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  margin-right: 12px;
  background-color: black;
  color: white;
  width: 200px;
`;
