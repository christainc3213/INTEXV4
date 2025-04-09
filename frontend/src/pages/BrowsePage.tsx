import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { MovieType } from "../types/MovieType";
import Header from "./BrowseParts/Header";
import FeaturedCarousel from "./BrowseParts/FeaturedCarousel";
import GenreRows from "./BrowseParts/GenreRows";
import Spinner from "../components/Spinner"; // adjust if path is different
import { useLocation } from "react-router-dom";



const BrowsePage = () => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [visibleGenres, setVisibleGenres] = useState(3);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const genreFromUrl = params.get("genre");
        if (genreFromUrl) {
            setSelectedGenre(genreFromUrl);
        } else {
            setSelectedGenre("all");
        }
    }, [location.search]);


    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                setVisibleGenres((prev) => prev + 2);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://localhost:5001/MovieTitles");
                const rawData = await response.json();

                const genreKeys = [
                    "action",
                    "adventure",
                    "anime_int_tv",
                    "british_int_tv",
                    "children",
                    "comedies",
                    "comedy_drama_int",
                    "comedy_int",
                    "comedy_romance",
                    "crime_tv",
                    "documentaries",
                    "documentary_int",
                    "docuseries",
                    "dramas",
                    "drama_int",
                    "drama_romance",
                    "family",
                    "fantasy",
                    "horror",
                    "thriller_int",
                    "drama_romance_int_tv",
                    "kids_tv",
                    "language_tv",
                    "musicals",
                    "nature_tv",
                    "reality_tv",
                    "spirituality",
                    "action_tv",
                    "comedy_tv",
                    "drama_tv",
                    "talk_show_comedy_tv",
                    "thrillers"
                ];

                const extractFirstGenre = (item: any): string => {
                    for (const key of genreKeys) {
                        if (item[key] === 1) return key;
                    }
                    return "Other";
                };

                const slugify = (text: string): string =>
                    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

                const transformed = rawData.map((item: any) => {
                    const genre = extractFirstGenre(item);
                    return {
                        show_id: item.show_id,
                        type: item.type,
                        title: item.title,
                        description: item.description || "No description available",
                        genre,
                        slug: slugify(item.title),
                        docId: item.show_id,
                        posterFile: `/Movie Posters/${item.title.replace(/[\W_]+/g, " ").trim()}.jpg`
                    };
                });

                const uniqueGenres: string[] = Array.from(new Set((transformed as MovieType[]).map((m: MovieType) => m.genre))).sort();

                setMovies(transformed);
                setGenres(uniqueGenres);
                setLoading(false);
            } catch (error) {
                console.error("❌ Failed to fetch movie data", error);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Spinner size={60} color="#ffffff" centered />;


    const filteredMovies = selectedGenre === "all"
        ? movies
        : movies.filter((m) => m.genre === selectedGenre);

    const featuredMovies = filteredMovies.slice(4, 9);
    const recommendedMovies = movies.slice(5, 15);

    const moviesByGenre: Record<string, MovieType[]> = {};
    filteredMovies.forEach((movie) => {
        if (!moviesByGenre[movie.genre]) moviesByGenre[movie.genre] = [];
        moviesByGenre[movie.genre].push(movie);
    });

    const formatGenreName = (key: string): string =>
        key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

    const getPosterPath = (title: string): string => {
        return `/Movie Posters/${title.replace(/[^\w\s]/g, "").trim()}.jpg`;
    };

    return (
        <>
            <Header
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                allMovies={movies}
                genres={genres}
                formatGenreName={formatGenreName}
            />

            <FeaturedCarousel
                movies={filteredMovies}
                selectedGenre={selectedGenre}
                featuredMovies={featuredMovies}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                getPosterPath={getPosterPath}
            />

            <GenreRows
                moviesByGenre={moviesByGenre}
                selectedGenre={selectedGenre}
                recommendedMovies={recommendedMovies}
                formatGenreName={formatGenreName}
                getPosterPath={getPosterPath}
                visibleGenres={visibleGenres}
                filteredMovies={filteredMovies}
            />

        </>
    );
};

export default BrowsePage;
