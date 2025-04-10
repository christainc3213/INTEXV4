import styled from "styled-components";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import MovieScrollRow from "../../components/MovieScrollRow";
import { MovieType } from "../../types/MovieType";
import PosterCard from "../../components/PosterCard";


export interface GenreRowsProps {
    moviesByGenre: Record<string, MovieType[]>;
    selectedGenre: string;
    recommendedMovies: MovieType[];
    formatGenreName: (g: string) => string;
    getPosterPath: (t: string) => string;
    filteredMovies: MovieType[];
    actionRecs: MovieType[];
    comedyRecs: MovieType[];
    dramaRecs: MovieType[];
}

const ROW_BATCH   = 2;   // ⬅ how many new rows each time
const MOVIE_BATCH = 20;  // ⬅ how many grid posters each time

export default function GenreRows(props: GenreRowsProps) {
    const {
        moviesByGenre,
        selectedGenre,
        recommendedMovies,
        formatGenreName,
        getPosterPath,
        filteredMovies,
        actionRecs,
        comedyRecs,
        dramaRecs,
    } = props;

    /* --------- state that drives the UI ---------- */
    const [visibleRowCount,   setVisibleRowCount]   = useState(3);
    const [visibleMovieCount, setVisibleMovieCount] = useState(30);

    /* --------- sentinels (invisible divs) -------- */
    const rowSentinelRef   = useRef<HTMLDivElement | null>(null);
    const movieSentinelRef = useRef<HTMLDivElement | null>(null);

    /* ---------- observe the bottom‑of‑rows ---------- */
    useEffect(() => {
        if (!rowSentinelRef.current) return;

        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleRowCount(prev => prev + ROW_BATCH);
            }
        });
        io.observe(rowSentinelRef.current);
        return () => io.disconnect();
    }, []);

    /* ---------- observe the bottom‑of‑movies -------- */
    useEffect(() => {
        if (!movieSentinelRef.current) return;

        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleMovieCount(prev => prev + MOVIE_BATCH);
            }
        });
        io.observe(movieSentinelRef.current);
        return () => io.disconnect();
    }, []);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    /* --------------- render ----------------- */
    return (
        <PageBackground>
            {selectedGenre === "all" && (
                <MovieScrollRow
                    title="Recommended For You"
                    movies={recommendedMovies}
                    getPosterPath={getPosterPath}
                />
            )}

            {selectedGenre === "all" ? (
                <>
                    {Object.entries(moviesByGenre)
                        .slice(0, visibleRowCount)
                        .map(([g, list]) => (
                            <MovieScrollRow
                                key={g}
                                title={formatGenreName(g)}
                                movies={list}
                                getPosterPath={getPosterPath}
                            />
                        ))}
                    {/* sentinel for more rows */}
                    <Sentinel ref={rowSentinelRef} />
                </>
            ) : (
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
                        <Grid>
                               {filteredMovies.slice(0, visibleMovieCount).map(movie => (
                                 <PosterCard
                                   key={movie.docId}
                                   movie={movie}
                                   posterSrc={getPosterPath(movie.title)}
                                 />
                               ))}
                             </Grid>
                        {/* sentinel for more posters */}
                        <Sentinel ref={movieSentinelRef} />
                    </GenreRow>
                </>
            )}
        </PageBackground>
    );
}

/* ---------- styled ---------- */

const PageBackground = styled.div`
    background:#121212;
    padding:2rem 1rem 4rem;
    margin-top:-80px;
`;

const GenreRow   = styled.div`margin-top:3rem;`;
const GenreTitle = styled.h3`color:#fff;margin-bottom:1rem;`;

const Grid = styled.div`
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
    gap:0.5rem;
`;

const Poster = styled.img`
    width:100%;height:240px;object-fit:cover;border-radius:8px;
`;

const Sentinel = styled.div`
    width:100%;height:1px;
`;

const PosterImg = styled.img`
    width: 100%;
    height: 240px;
    object-fit: cover;
    display: block;
`;

const Info = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.75);
    color: #fff;
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1rem;
    transition: opacity .25s ease;


    h4 { margin: 0 0 .25rem 0; font-size: 1rem; }
    p  { margin: 0; font-size: .85rem; line-height: 1.2; }
`;
