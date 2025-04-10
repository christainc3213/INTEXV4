import styled from "styled-components";
import { useEffect, useRef, useState, useCallback } from "react";
import { MovieType } from "../../types/MovieType";
import MovieScrollRow from "../../components/MovieScrollRow";

export interface GenreRowsProps {
    moviesByGenre: Record<string, MovieType[]>;
    selectedGenre: string;
    recommendedMovies: MovieType[];
    formatGenreName: (genre: string) => string;
    getPosterPath: (title: string) => string;
    filteredMovies: MovieType[];
    actionRecs: MovieType[];
    comedyRecs: MovieType[];
    dramaRecs: MovieType[];
}

const GenreRows = ({
                       moviesByGenre,
                       selectedGenre,
                       recommendedMovies,
                       formatGenreName,
                       getPosterPath,
                       filteredMovies,
                       actionRecs,
                       comedyRecs,
                       dramaRecs,
                   }: GenreRowsProps) => {
    const [visibleGenreCount, setVisibleGenreCount] = useState(3);
    const [visibleMovieCount, setVisibleMovieCount] = useState(30);
    const genreObserverRef = useRef<HTMLDivElement | null>(null);
    const movieObserverRef = useRef<HTMLDivElement | null>(null);
    const genreLoaderRef = useRef<HTMLDivElement | null>(null);
    const movieLoaderRef = useRef<HTMLDivElement | null>(null);

    const movieObserver = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleMovieCount((prev) => prev + 20);
                }
            }, {
                threshold: 1.0,
            });
            observer.observe(node);
        }
    }, []);
    

    const genreObserver = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleGenreCount((prev) => prev + 2);
                }
            }, {
                threshold: 1.0,
            });
            observer.observe(node);
        }
    }, []);


    // Lazy load movies (genre page)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleMovieCount((prev) => prev + 20);
                }
            },
            { threshold: 1.0 }
        );

        const currentRef = movieObserverRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);



    return (
        <PageBackground>
            {selectedGenre === "all" && (
                <>
                    <MovieScrollRow
                        title="Recommended For You"
                        movies={recommendedMovies}
                        getPosterPath={getPosterPath}
                    />
                    {Object.entries(moviesByGenre)
                        .slice(0, visibleGenreCount)
                        .map(([genre, genreMovies]) => (
                            <MovieScrollRow
                                key={genre}
                                title={formatGenreName(genre)}
                                movies={genreMovies}
                                getPosterPath={getPosterPath}
                            />
                        ))}
                    <div ref={genreObserver} style={{ height: "1px" }} />
                </>
            )}

            {selectedGenre !== "all" && (
                <>
                    {["action", "comedies", "dramas"].includes(selectedGenre) && (
                        <MovieScrollRow
                            title={`Recommended ${formatGenreName(selectedGenre)} For You`}
                            movies={
                                selectedGenre === "action"
                                    ? actionRecs
                                    : selectedGenre === "comedies"
                                        ? comedyRecs
                                        : dramaRecs
                            }
                            getPosterPath={getPosterPath}
                        />
                    )}
                    <GenreRow>
                        <GenreTitle>{`All ${formatGenreName(selectedGenre)}`}</GenreTitle>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            {filteredMovies.slice(0, visibleMovieCount).map((movie) => (
                                <MovieCard key={movie.docId}>
                                    <MoviePoster
                                        src={getPosterPath(movie.title)}
                                        alt={movie.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                "/Movie Posters/fallback.jpg";
                                        }}
                                    />
                                    <MovieOverlay className="overlay">
                                        <h4>{movie.title}</h4>
                                        <button
                                            onClick={() =>
                                                (window.location.href = `/movie/${movie.slug}`)
                                            }
                                        >
                                            See More
                                        </button>
                                    </MovieOverlay>
                                </MovieCard>
                            ))}
                        </div>
                        <div ref={movieObserver} style={{ height: "1px" }} />
                    </GenreRow>
                </>
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
