// src/components/MovieScrollRow.tsx
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/MovieType";

/** How many posters we show immediately, and how many more to add each time user scrolls. */
const INITIAL_POSTERS = 20;
const BATCH_POSTERS   = 20;

interface Props {
    title: string;
    movies: MovieType[];
    getPosterPath: (title: string) => string;
}

const MovieScrollRow: React.FC<Props> = ({ title, movies, getPosterPath }) => {
    const navigate = useNavigate();

    // We'll start by displaying only a limited set of posters
    const [visibleCount, setVisibleCount] = useState(INITIAL_POSTERS);

    // Used to horizontally scroll with arrow buttons
    const scrollRef = useRef<HTMLDivElement>(null);

    // We'll place an invisible sentinel at the far right end of the row
    const endRef = useRef<HTMLDivElement>(null);

    /** Scroll the container 7 cards' worth, plus spacing, left or right. */
    const scroll = (direction: "left" | "right") => {
        const scrollAmount = 160 * 7 + 7 * 16; // 7 cards × 160 wide + 7 gaps
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "right" ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            });
        }
    };

    /** IntersectionObserver: when user scrolls so that endRef is visible, load BATCH_POSTERS more. */
    useEffect(() => {
        if (!endRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                // reveal 20 more items
                setVisibleCount((prev) => Math.min(prev + BATCH_POSTERS, movies.length));
            }
        }, {
            // We'll treat the scroller itself as the "root" so we observe
            // the sentinel's position relative to the horizontal scroll.
            root: scrollRef.current,
            threshold: 0.8,
        });

        // Observe the sentinel
        observer.observe(endRef.current);

        return () => {
            observer.disconnect();
        };
    }, [movies.length]);

    return (
        <RowWrapper>
            <GenreTitle>{title}</GenreTitle>

            <ScrollWrapper>
                <ScrollButtonLeft onClick={() => scroll("left")}>&lt;</ScrollButtonLeft>

                <ScrollRow ref={scrollRef}>
                    {movies.slice(0, visibleCount).map((movie) => (
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

                    {/* The invisible block that triggers loading more posters when we scroll near the right edge. */}
                    <EndSentinel ref={endRef} />
                </ScrollRow>

                <ScrollButtonRight onClick={() => scroll("right")}>&gt;</ScrollButtonRight>
            </ScrollWrapper>
        </RowWrapper>
    );
};

export default MovieScrollRow;

/* ---- styled components ---- */

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

const ScrollButtonLeft = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: none;
  color: rgba(255, 255, 255, 0.3); /* faint white */
  border: none;
  font-size: 2rem; /* taller arrow */
  padding: 0.25rem 0.4rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #fff; /* brighter white on hover */
  }
`;

const ScrollButtonRight = styled(ScrollButtonLeft)`
  left: auto;
  right: 0;
`;

const ScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  /* Optionally hide the default scrollbar in some browsers */
  &::-webkit-scrollbar {
    display: none;
  }
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

/** The sentinel block that triggers more item loads when scrolled into view. */
const EndSentinel = styled.div`
  flex: 0 0 1px;    /* A tiny sliver at the end */
  height: 100px;    /* Give it some vertical size so IntersectionObserver can detect it */
  margin-left: -1px;
`;
