import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../../types/MovieType";

export interface GenreRowsProps {
    moviesByGenre: Record<string, MovieType[]>;
    selectedGenre: string;
    recommendedMovies: MovieType[];
    formatGenreName: (genre: string) => string;
    getPosterPath: (title: string) => string;
    visibleGenres: number;
    filteredMovies: MovieType[];
}

const GenreRows = ({
                       moviesByGenre,
                       selectedGenre,
                       recommendedMovies,
                       formatGenreName,
                       getPosterPath,
                       visibleGenres,
                       filteredMovies,
                   }: GenreRowsProps) => {
    const navigate = useNavigate();

    return (
        <PageBackground>
            {selectedGenre === "all" && (
                <GenreRow>
                    <GenreTitle>Recommended For You</GenreTitle>
                    <ScrollRow>
                        {recommendedMovies.map((movie) => (
                            <MovieCard key={movie.docId}>
                                <MoviePoster
                                    src={getPosterPath(movie.title)}
                                    alt={movie.title}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                                    }}
                                />
                                <MovieOverlay className="overlay">
                                    <h4>{movie.title}</h4>
                                    <button onClick={() => navigate(`/movie/${movie.slug}`)}>Go to Movie</button>
                                </MovieOverlay>
                            </MovieCard>
                        ))}
                    </ScrollRow>
                </GenreRow>
            )}

            {selectedGenre === "all"
                ? Object.entries(moviesByGenre)
                    .slice(0, visibleGenres)
                    .map(([genre, genreMovies]) => (
                        <GenreRow key={genre}>
                            <GenreTitle>{formatGenreName(genre)}</GenreTitle>
                            <ScrollRow>
                                {genreMovies.map((movie) => (
                                    <MovieCard key={movie.docId}>
                                        <MoviePoster
                                            src={getPosterPath(movie.title)}
                                            alt={movie.title}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                                            }}
                                        />
                                        <MovieOverlay className="overlay">
                                            <h4>{movie.title}</h4>
                                            <button onClick={() => navigate(`/movie/${movie.slug}`)}>Go to Movie</button>
                                        </MovieOverlay>
                                    </MovieCard>
                                ))}
                            </ScrollRow>
                        </GenreRow>
                    ))
                : (
                    <GenreRow>
                        <GenreTitle>{`All ${formatGenreName(selectedGenre)} Movies`}</GenreTitle>
                        <ScrollRow style={{ flexWrap: "wrap", overflowX: "hidden" }}>
                            {filteredMovies.map((movie) => (
                                <MovieCard key={movie.docId}>
                                    <MoviePoster
                                        src={getPosterPath(movie.title)}
                                        alt={movie.title}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                                        }}
                                    />
                                    <MovieOverlay className="overlay">
                                        <h4>{movie.title}</h4>
                                        <button onClick={() => navigate(`/movie/${movie.slug}`)}>Go to Movie</button>
                                    </MovieOverlay>
                                </MovieCard>
                            ))}
                        </ScrollRow>
                    </GenreRow>
                )}
        </PageBackground>
    );
};

export default GenreRows;

const PageBackground = styled.div`
  background-color: #121212;
  padding: 2rem 1rem 4rem 1rem;
  margin-top: -80px;
`;

const GenreRow = styled.div`
  margin-top: 3rem;
  padding: 0 1rem;
`;

const GenreTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
`;

const ScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
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