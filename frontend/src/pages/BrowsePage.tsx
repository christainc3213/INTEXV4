import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../types/MovieType";
import Header from "./BrowseParts/Header";
import FeaturedCarousel from "./BrowseParts/FeaturedCarousel";
import GenreRows from "./BrowseParts/GenreRows";
import Spinner from "../components/Spinner"; // adjust if path is different
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import AuthorizeView from "../components/AuthorizeView";

const BrowsePage = () => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contentType, setContentType] = useState<"all" | "Movie" | "TV Show">(
    "all"
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendedMovies, setRecommendedMovies] = useState<MovieType[]>([]);
  const [actionRecommendations, setActionRecommendations] = useState<
    MovieType[]
  >([]);
  const [comedyRecommendations, setComedyRecommendations] = useState<
    MovieType[]
  >([]);
  const [dramaRecommendations, setDramaRecommendations] = useState<MovieType[]>(
    []
  );

  const posterBase = import.meta.env.VITE_POSTER_BASE; // ①

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = 11;
        const response = await fetch(
          `https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/BrowseRecommendations/${userId}`,
          {
            method: "GET",
            credentials: "include", // Sends cookies with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const titles: string[] = await response.json();

        const matches = movies.filter((movie) =>
          titles.some(
            (title) =>
              title.trim().toLowerCase() === movie.title.trim().toLowerCase()
          )
        );

        setRecommendedMovies(matches);
      } catch (error) {
        console.error("❌ Failed to fetch recommended titles", error);
      }
    };

    const fetchGenreRecs = async (
      genre: string,
      setter: (movies: MovieType[]) => void
    ) => {
      try {
        const userId = 11;
        const res = await fetch(
          `https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/BrowseRecommendations/genre/${genre}/${userId}`,
          {
            method: "GET",
            credentials: "include", // Sends cookies with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const titles: string[] = await res.json();

        const matches = movies.filter((movie) =>
          titles.some(
            (title) =>
              title.trim().toLowerCase() === movie.title.trim().toLowerCase()
          )
        );
        setter(matches);
      } catch (err) {
        console.error(`❌ Failed to fetch ${genre} recommendations`, err);
      }
    };

    if (!loading) {
      fetchRecommendations();
      fetchGenreRecs("action", setActionRecommendations);
      fetchGenreRecs("comedies", setComedyRecommendations);
      fetchGenreRecs("dramas", setDramaRecommendations);
    }
  }, [movies, loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreFromUrl = params.get("genre");
    const typeFromUrl = params.get("type");

    if (genreFromUrl) {
      setSelectedGenre(genreFromUrl);
    } else {
      setSelectedGenre("all");
    }

    if (typeFromUrl === "Movies") {
      setContentType("Movie");
    } else if (typeFromUrl === "TV-Shows") {
      setContentType("TV Show");
    } else {
      setContentType("all");
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const nearBottom = scrollTop + viewportHeight >= fullHeight - 300;

      console.log("🧮 scrollY:", window.scrollY);
      console.log("📏 viewport height:", window.innerHeight);
      console.log(
        "📐 full page height:",
        document.documentElement.scrollHeight
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedGenre]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/movietitles",
          {
            method: "GET",
            credentials: "include", // Sends cookies with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
          "thrillers",
        ];

        const extractFirstGenre = (item: any): string => {
          for (const key of genreKeys) {
            if (item[key] === 1) return key;
          }
          return "Other";
        };

        const slugify = (text: string): string =>
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

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
            posterFile: `${posterBase}/${item.title}`,
          };
        });

        const uniqueGenres: string[] = Array.from(
          new Set((transformed as MovieType[]).map((m: MovieType) => m.genre))
        ).sort();

        setMovies(transformed);
        setGenres(uniqueGenres);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch movie data", error);
      }
    };

    fetchData();
  }, []);

  const filteredByType = useMemo(() => {
    return contentType === "all"
      ? movies
      : movies.filter(
          (m) => m.type.toLowerCase() === contentType.toLowerCase()
        );
  }, [movies, contentType]);

  const filteredMovies = useMemo(() => {
    return selectedGenre === "all"
      ? filteredByType
      : filteredByType.filter((m) => m.genre === selectedGenre);
  }, [filteredByType, selectedGenre]);

  if (loading) return <Spinner size={60} color="#ffffff" centered />;

  let firstFeaturedId: string | null = null;

  if (selectedGenre === "all" && contentType === "all") {
    firstFeaturedId = "s341"; // Home page
  } else if (contentType === "Movie") {
    firstFeaturedId = "s330"; // Example for Movies page
  } else if (contentType === "TV Show") {
    firstFeaturedId = "s6"; // Example for TV Shows page
  } else if (selectedGenre === "action") {
    firstFeaturedId = "s609"; // Example for Action genre
  } else if (selectedGenre === "comedies") {
    firstFeaturedId = "s28"; // Example for Comedies
  } else if (selectedGenre === "dramas") {
    firstFeaturedId = "s829"; // Example for Dramas
  }

  const featuredMovies = firstFeaturedId
    ? [
        ...filteredMovies.filter((m) => m.docId === firstFeaturedId),
        ...filteredMovies
          .filter((m) => m.docId !== firstFeaturedId)
          .slice(0, 4),
      ]
    : filteredMovies.slice(4, 9);

  const moviesByGenre: Record<string, MovieType[]> = {};
  filteredMovies.forEach((movie) => {
    if (!moviesByGenre[movie.genre]) moviesByGenre[movie.genre] = [];
    moviesByGenre[movie.genre].push(movie);
  });

  const formatGenreName = (key: string): string =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\bTv\b/i, "TV");

  const getPosterPath = (title: string): string => {
    if (!title) return `${import.meta.env.VITE_POSTER_BASE}/fallback.jpg`;

    const fileName = title
      .replace(/[^\w\s]/g, "") // remove special characters
      .trim();

    return `${posterBase}/${fileName}.jpg`;
  };

  return (
    <>
      <AuthorizeView>
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
          filteredMovies={filteredMovies}
          actionRecs={actionRecommendations}
          comedyRecs={comedyRecommendations}
          dramaRecs={dramaRecommendations}
        />
      </AuthorizeView>
    </>
  );
};

export default BrowsePage;
