import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../components/Spinner";
import Header from "../pages/BrowseParts/Header";
import {MovieType} from "../types/MovieType"; // adjust path if needed


interface Movie {
  show_id: string;
  title: string;
  description: string;
  rating: string;
  release_year: number;
  director: string;
  cast: string;
  country: string;
  duration: string;
  genre: string;
  slug: string;
}

const MoviePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const posterBase = import.meta.env.VITE_POSTER_BASE;          // ①

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Scroll now
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Scroll again after paint (some browsers only listen then)
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 1); // tiny delay helps override browser restoration
    });

    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);


  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);


  // Separate states for each rec source
  const [contentRecs, setContentRecs] = useState<string[]>([]);
  const [collabRecs, setCollabRecs] = useState<string[]>([]);
  const [actionRecs, setActionRecs] = useState<string[]>([]);
  const [comedyRecs, setComedyRecs] = useState<string[]>([]);
  const [dramaRecs, setDramaRecs] = useState<string[]>([]);

  const [results, setResults] = useState<MovieType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [genres, setGenres] = useState<string[]>([]);

  const formatGenreName = (key: string): string =>
      key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\bTv\b/i, "TV");

  const handleStarClick = async (rating: number) => {
    if (!movie) return;
  
    const userId = 11;
    if (!userId) {
      alert("You must be logged in to rate movies.");
      return;
    }
  
    setUserRating(rating);
  
    try {
      const res = await fetch("https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          show_id: movie.show_id,
          rating: rating,
        }),
      });
  
      if (!res.ok) {
        console.error("Failed to submit rating");
      }
    } catch (err) {
      console.error("Rating submit error:", err);
    }
  };
  
  const renderStars = () => {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      const filled = hoverRating ? i <= hoverRating : i <= (userRating ?? 0);
  
      stars.push(
        <Star
          key={i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(null)}
          $filled={filled}
        >
          ★
        </Star>
      );
    }
  
    return <StarsContainer>{stars}</StarsContainer>;
  };    

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const getPosterPath = (title: string): string => {
    if (!title) return `${import.meta.env.VITE_POSTER_BASE}/fallback.jpg`;
  
    const fileName = title
      .replace(/[^\w\s]/g, "")   // remove special characters
      .trim();
  
    return `${posterBase}/${fileName}.jpg`;
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch("https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/MovieTitles");
        const data = await res.json();

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

        const moviesWithSlugs: Movie[] = data.map((item: any) => {
          const genre = extractFirstGenre(item);
          return {
            ...item,
            slug: slugify(item.title),
            genre,
          };
        });

        setResults(moviesWithSlugs as MovieType[]);
        setGenres(Array.from(new Set(moviesWithSlugs.map((m) => m.genre))).sort());


        const matched = moviesWithSlugs.find((m) => m.slug === slug);
        if (!matched) {
          setMovie(null);
          setLoading(false);
          return;
        }

        setMovie(matched);
        window.scrollTo({ top: 0, behavior: "smooth" });
        const id = matched.show_id;

        const userId = 11;
        if (userId) {
          fetch(`https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/ratings/${userId}/${id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data?.rating) {
                setUserRating(data.rating);
              }
            })
            .catch((err) => console.warn("Failed to fetch existing rating:", err));
        }
        // Fetch each rec source independently
        fetch(`https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/DetailsRecommendation/content/${id}`)
            .then(res => res.ok ? res.json() : [])
          .then(setContentRecs)
          .catch(e => console.warn("Content recs failed", e));

        fetch(`https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/DetailsRecommendation/collab/${id}`)
          .then(res => res.ok ? res.json() : [])
          .then(setCollabRecs)
          .catch(e => console.warn("Collab recs failed", e));                           

        const genre = matched.genre?.toLowerCase() ?? "";

        console.log("🎬 Matched movie:", matched);
        console.log("📦 Detected genre:", matched.genre);

        if (genre.includes("action")) {
        fetch(`https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/DetailsRecommendation/action/${id}`)
            .then(res => res.ok ? res.json() : [])
            .then(setActionRecs)
            .catch(e => console.warn("Action recs failed", e));
        }
        
        if (genre.includes("comedies")) {
        fetch(`https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/DetailsRecommendation/comedy/${id}`)
            .then(res => res.ok ? res.json() : [])
            .then(setComedyRecs)
            .catch(e => console.warn("Comedy recs failed", e));
        }
        
        if (genre.includes("drama")) {
        fetch(`https://intexv4-backend-a9gufubwgrdmgtcs.eastus-01.azurewebsites.net/api/DetailsRecommendation/drama/${id}`)
            .then(res => res.ok ? res.json() : [])
            .then(setDramaRecs)
            .catch(e => console.warn("Drama recs failed", e));
        }          
      } catch (err) {
        console.error("Movie fetch error:", err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

    if (loading) return <Spinner size={60} color="#ffffff" centered />;
    if (!movie) return <h2 style={{ color: "white" }}>Movie not found</h2>;

  const posterUrl = getPosterPath(movie.title);

  const renderRecs = (title: string, recs: string[]) => (
    recs.length > 0 && (
      <RecommendationSection>
        <h2>{title}</h2>
        <RecommendationScroll>
          {recs.map((title, i) => (
            <RecommendationCard key={i}>
              <img
                src={getPosterPath(title)}
                alt={title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `${import.meta.env.VITE_POSTER_BASE}/fallback.jpg`;
                }}
              />
              <MovieOverlay className="overlay">
                  <h4>{title}</h4>
                  <button onClick={() => window.location.href = `/movie/${slugify(title)}`}>
                      Go to Movie
                  </button>
              </MovieOverlay>
            </RecommendationCard>
          ))}
        </RecommendationScroll>
      </RecommendationSection>
    )
  );
  

  return (
    <Background $posterUrl={`"${posterUrl}"`}>
      <Header
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          allMovies={results}
          genres={genres}
          formatGenreName={formatGenreName}
      />
      <Overlay>
        <img
          src={posterUrl}
          alt={movie.title}
          style={{
            width: "220px",
            borderRadius: "8px",
            marginBottom: "2rem",
            zIndex: 2,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `${import.meta.env.VITE_POSTER_BASE}/fallback.jpg`;
          }}
        />

        <InfoSection>
          <Title>{movie.title}</Title>
          <MetaCompact>
            <span>{movie.rating}</span>
            <span>{movie.duration}</span>
            <span>{movie.release_year}</span>
          </MetaCompact>
          <WatchNowButton>
            <PlayIcon /> Watch Now
          </WatchNowButton>

          <Description>{movie.description}</Description>
          <Metadata>
            <MetaItem><strong>Release Year:</strong> {movie.release_year}</MetaItem>
            <MetaItem><strong>Rating:</strong> {movie.rating}</MetaItem>
            <MetaItem><strong>Genre:</strong> {movie.genre}</MetaItem>
            <MetaItem><strong>Duration:</strong> {movie.duration}</MetaItem>
            <MetaItem><strong>Director:</strong> {movie.director}</MetaItem>
            <MetaItem><strong>Country:</strong> {movie.country}</MetaItem>
            <MetaItem><strong>Cast:</strong> {movie.cast}</MetaItem>
          </Metadata>
          <MetaItem style={{ marginTop: "2rem" }}>
            <strong>Rate: {renderStars()}</strong>
          </MetaItem>
        </InfoSection>

        {renderRecs("More Like This", contentRecs)}
        {renderRecs("More For You", collabRecs)}
        {renderRecs("More Action For You", actionRecs)}
        {renderRecs("More Comedy For You", comedyRecs)}
        {renderRecs("More Drama For you", dramaRecs)}

        <RatingTag>{movie.rating}</RatingTag>
      </Overlay>
    </Background>
  );
};

export default MoviePage;

const genreFields = [
    "action",
    "comedies",
    "dramas",
    "comedies dramas international movies",
    "comedies Romantic Movies",
    "dramas romantic movies",
    "dramas international movies",
    "tv dramas",
    "tv comedies",
    "tv action"
  ];

const Background = styled.div<{ $posterUrl: string }>`
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    background-image: url(${(props) => props.$posterUrl});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: brightness(0.3) blur(6px);
    z-index: 0;
  }
`;

const Overlay = styled.div`
  position: relative;
  z-index: 1;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;   /* ⬅ content starts at the top */
  padding: 6rem 2rem 6rem 2rem;
  box-sizing: border-box;
  color: white;
  min-height: 100vh;
`;


const InfoSection = styled.div`
  max-width: 700px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0.2rem 0 1rem 0;
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  margin-top: 1.25rem;
`;

const Metadata = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #ddd;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  line-height: 1.5;
`;

const RatingTag = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: bold;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const RecommendationSection = styled.div`
  margin-top: 3rem;

  h2 {
    color: white;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const RecommendationScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 1rem;
`;

const RecommendationCard = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 160px;
  height: 240px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover .overlay {
    transform: translateY(0%);
    pointer-events: all;
  }
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Star = styled.span<{ $filled: boolean }>`
  font-size: 1.5rem;
  color: ${(props) => (props.$filled ? "#FFD700" : "#666")};
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
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


const MetaCompact = styled.div`
  display: flex;
  gap: 1rem;
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const WatchNowButton = styled.button`
  background-color: #e5e5e5;
  color: black;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #d6d6d6;
    transform: translateY(-1px);
  }
`;

const PlayIcon = styled.span`
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 8px solid black;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
`;




