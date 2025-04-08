import { useState, useEffect } from "react";
import styled from "styled-components";
import { MovieType } from "../types/MovieType";
import { useNavigate } from "react-router-dom";

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

const getPosterPath = (title: string): string => {
    return `/Movie Posters/${title
        .replace(/[^\w\s]/g, "")   // remove non-word characters like &, :, /
        .trim()}.jpg`;
};

const getMostSimilarFilename = (title: string, filenames: string[]): string | null => {
    const normalize = (s: string) =>
        s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

    const target = normalize(title);

    let bestMatch = null;
    let highestScore = 0;

    for (const name of filenames) {
        const base = name.replace(/\.jpg$/i, "");
        const normalized = normalize(base);

        let score = 0;
        for (let i = 0; i < Math.min(normalized.length, target.length); i++) {
            if (normalized[i] === target[i]) score++;
            else break;
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = name;
        }
    }

    return bestMatch;
};



const BrowsePage = () => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [posterFilenames, setPosterFilenames] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://localhost:5001/MovieTitles");
                const rawData = await response.json();


                const extractFirstGenre = (item: any): string => {
                    for (const key of genreKeys) {
                        if (item[key] === 1) return key;
                    }
                    return "unknown";
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
                        posterFile: getPosterPath(item.title)
                    };
                });

                setMovies(transformed);
                setLoading(false);
            } catch (error) {
                console.error("❌ Failed to fetch movie data", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 5);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;

    const featuredMovies = movies.slice(0, 5);

    const filteredMovies = selectedGenre === "all"
        ? movies
        : movies.filter((m) => m.genre === selectedGenre);

    const filteredFeatured = filteredMovies.slice(0, 5);


    const recommendedMovies = movies.slice(5, 15); // placeholder: the 10 movies after the 5 featured

    const moviesByGenre: Record<string, MovieType[]> = {};
    filteredMovies.forEach((movie) => {
        if (!moviesByGenre[movie.genre]) moviesByGenre[movie.genre] = [];
        moviesByGenre[movie.genre].push(movie);
    });


    const formatGenreName = (key: string): string => {
        return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/\bTv\b/i, "TV"); // always capitalize TV
    };

    const formatPosterFilename = (title: string): string => {
        return title
            .replace(/[&:]/g, "")          // remove special characters like `&` and `:`
            .replace(/\s+/g, " ")          // replace multiple spaces with single space
            .trim();                       // trim any leading/trailing spaces
    };

    const allMoviesByGenre: Record<string, MovieType[]> = {};
    movies.forEach((movie) => {
        if (!allMoviesByGenre[movie.genre]) allMoviesByGenre[movie.genre] = [];
        allMoviesByGenre[movie.genre].push(movie);
    });


    return (
        <>
            <Header>
                <Logo src="/logo.png" alt="CineNiche" />

                <GenreSelect value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="all">All Movies</option>
                    {Object.keys(allMoviesByGenre).map((genre) => (
                        <option key={genre} value={genre}>
                            {formatGenreName(genre)}
                        </option>
                    ))}
                </GenreSelect>

                <SearchButton>
                    <img src="/icons/search.png" alt="Search" />
                </SearchButton>
            </Header>

            <CarouselWrapper>
                <Carousel style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {filteredFeatured.map((movie, index) => (
                        <CarouselItem key={index}>
                            <Backdrop
                                src={getPosterPath(movie.title)}
                                alt={movie.title}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                                }}
                            />
                            <Overlay>
                                <h2>{movie.title}</h2>
                                <p>{movie.description}</p>
                                <button onClick={() => navigate(`/movie/${movie.slug}`)}>Go to Movie</button>
                            </Overlay>
                        </CarouselItem>
                    ))}
                </Carousel>
                <Dots>
                    {filteredFeatured.map((movie, index) => (
                        <Dot
                            key={index}
                            $active={index === currentSlide}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </Dots>
            </CarouselWrapper>

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




            {selectedGenre === "all" ? (
                Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
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
            ) : (
                <>
                    <GenreRow>
                        <GenreTitle>{`Recommended for You in ${formatGenreName(selectedGenre)}`}</GenreTitle>
                        <ScrollRow>
                            {[...Array(10)].map((_, i) => (
                                <MovieCard key={i}>
                                    <MoviePoster src="/Movie Posters/fallback.jpg" alt="Placeholder" />
                                </MovieCard>
                            ))}
                        </ScrollRow>
                    </GenreRow>

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
                </>
            )}

        </>
    );
};

export default BrowsePage;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const Logo = styled.img`
  height: 24px;
  object-fit: contain;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  img {
    height: 20px;
  }
`;

const CarouselWrapper = styled.div`
  margin-top: 40px;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 60vh;
`;

const Carousel = styled.div`
  display: flex;
  transition: transform 0.8s ease-in-out;
  height: 100%;
`;

const CarouselItem = styled.div`
  flex: 1;
  position: relative;
  min-width: 100%;
`;

const Backdrop = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 20px;
  left: 40px;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  p {
    max-width: 400px;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  button {
    background: black;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
    transition: background 0.3s;
    &:hover {
      background: #222;
    }
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Dot = styled.div.attrs<{ $active: boolean }>(() => ({}))<{
    $active: boolean;
}>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(props) => (props.$active ? "#000" : "#ccc")};
    transition: background 0.3s;
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


const GenreSelect = styled.select`
  margin-left: 16px;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;