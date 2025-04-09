// src/components/MovieScrollRow.tsx
import React, { useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/MovieType";

interface Props {
    title: string;
    movies: MovieType[];
    getPosterPath: (title: string) => string;
}

const MovieScrollRow: React.FC<Props> = ({ title, movies, getPosterPath }) => {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        const scrollAmount = 160 * 7 + 7 * 16;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "right" ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <RowWrapper>
            <GenreTitle>{title}</GenreTitle>
            <ScrollWrapper>
                <ScrollButtonLeft onClick={() => scroll("left")}>&lt;</ScrollButtonLeft>
                <ScrollRow ref={scrollRef}>
                    {movies.map((movie) => (
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
                                <button onClick={() => navigate(`/movie/${movie.slug}`)}>
                                    Go to Movie
                                </button>
                            </MovieOverlay>
                        </MovieCard>
                    ))}
                </ScrollRow>
                <ScrollButtonRight onClick={() => scroll("right")}>&gt;</ScrollButtonRight>
            </ScrollWrapper>
        </RowWrapper>
    );
};

export default MovieScrollRow;

const RowWrapper = styled.div`
  margin-top: 3rem;
  padding: 0 1rem;
`;

const GenreTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
`;

const ScrollWrapper = styled.div`
  position: relative;
`;

const ScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
`;

const ScrollButtonLeft = styled.button`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    background: none;
    color: rgba(255, 255, 255, 0.3);  // faint white
    border: none;
    font-size: 2rem; // taller
    padding: 0.25rem 0.4rem; // narrow
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: whitesmoke; // brighter white
    }
`;

const ScrollButtonRight = styled(ScrollButtonLeft)`
    left: auto;
    right: 0;
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
