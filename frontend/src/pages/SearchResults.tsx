import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { MovieType } from "../types/MovieType";
import Header from "../pages/BrowseParts/Header"; // adjust path if needed

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

    const [results, setResults] = useState<MovieType[]>([]);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [genres, setGenres] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://localhost:5001/MovieTitles");
                const rawData = await res.json();

                const genreKeys = [
                    "action", "adventure", "anime_int_tv", "british_int_tv", "children", "comedies",
                    "comedy_drama_int", "comedy_int", "comedy_romance", "crime_tv", "documentaries",
                    "documentary_int", "docuseries", "dramas", "drama_int", "drama_romance", "family",
                    "fantasy", "horror", "thriller_int", "drama_romance_int_tv", "kids_tv", "language_tv",
                    "musicals", "nature_tv", "reality_tv", "spirituality", "action_tv", "comedy_tv",
                    "drama_tv", "talk_show_comedy_tv", "thrillers"
                ];

                const extractFirstGenre = (item: any): string => {
                    for (const key of genreKeys) {
                        if (item[key] === 1) return key;
                    }
                    return "Other";
                };

                const formatGenreName = (key: string): string =>
                    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

                const transformed: MovieType[] = rawData.map((item: any) => {
                    const genre = extractFirstGenre(item);
                    return {
                        ...item,
                        genre,
                        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                        docId: item.show_id,
                        posterFile: `/Movie Posters/${item.title.replace(/[\W_]+/g, " ").trim()}.jpg`,
                    };
                });

                const filtered = transformed.filter((movie) =>
                    movie.title.toLowerCase().includes(query)
                );

                const uniqueGenres = Array.from(new Set(transformed.map((m) => m.genre))).sort();

                setResults(filtered);
                setGenres(uniqueGenres);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchData();
    }, [query]);

    const formatGenreName = (key: string): string =>
        key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

    return (
        <>
            <Header
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                allMovies={results}
                genres={genres}
                formatGenreName={formatGenreName}
            />
            <ResultsPage>
                <h2>Search Results for “{query}”</h2>
                <PosterGrid>
                    {results.map((movie) => (
                        <PosterCard key={movie.docId} onClick={() => navigate(`/movie/${movie.slug}`)}>
                            <img
                                src={movie.posterFile}
                                alt={movie.title}
                                loading="lazy" // 👈 this is the key part
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                                }}
                            />
                        </PosterCard>
                    ))}
                </PosterGrid>
            </ResultsPage>
        </>
    );
};

export default SearchResults;

// --- Styles ---
const ResultsPage = styled.div`
  background-color: #121212;
  padding: 2rem;
  color: white;
  padding-top: 100px; // offset for fixed header
`;

const PosterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PosterCard = styled.div`
  cursor: pointer;
  width: 160px;
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;
