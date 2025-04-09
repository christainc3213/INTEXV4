import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Movie {
  show_id: string;
  title: string;
  description: string;
  rating: string;
  release_year: number;
  genre: string;
  slug: string;
}

const MoviePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const getPosterPath = (title: string): string => {
    if (!title) return "/Movie Posters/fallback.jpg";
    return `/Movie Posters/${title
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()}.jpg`;
  };

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  // Separate states for each rec source
  const [contentRecs, setContentRecs] = useState<string[]>([]);
  const [collabRecs, setCollabRecs] = useState<string[]>([]);
  const [actionRecs, setActionRecs] = useState<string[]>([]);
  const [comedyRecs, setComedyRecs] = useState<string[]>([]);
  const [dramaRecs, setDramaRecs] = useState<string[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch("https://localhost:5001/MovieTitles");
        const data = await res.json();

        const moviesWithSlugs: Movie[] = data.map((movie: any) => {
          const genre = Object.entries(movie).find(
            ([key, val]) => val === 1 && genreFields.includes(key)
          )?.[0] ?? "unknown";

          return {
            ...movie,
            slug: slugify(movie.title),
            genre,
          };
        });

        const matched = moviesWithSlugs.find((m) => m.slug === slug);
        if (!matched) {
          setMovie(null);
          setLoading(false);
          return;
        }

        setMovie(matched);
        const id = matched.show_id;

        // Fetch each rec source independently
        fetch(`/api/DetailsRecommendation/content/${id}`)
          .then(res => res.ok ? res.json() : [])
          .then(setContentRecs)
          .catch(e => console.warn("Content recs failed", e));

        fetch(`/api/DetailsRecommendation/collab/${id}`)
          .then(res => res.ok ? res.json() : [])
          .then(setCollabRecs)
          .catch(e => console.warn("Collab recs failed", e));

        const genre = matched.genre?.toLowerCase() ?? "";

        console.log("🎬 Matched movie:", matched);
        console.log("📦 Detected genre:", matched.genre);

        if (genre.includes("action")) {
        fetch(`/api/DetailsRecommendation/action/${id}`)
            .then(res => res.ok ? res.json() : [])
            .then(setActionRecs)
            .catch(e => console.warn("Action recs failed", e));
        }
        
        if (genre.includes("comedies")) {
        fetch(`/api/DetailsRecommendation/comedy/${id}`)
            .then(res => res.ok ? res.json() : [])
            .then(setComedyRecs)
            .catch(e => console.warn("Comedy recs failed", e));
        }
        
        if (genre.includes("drama")) {
        fetch(`/api/DetailsRecommendation/drama/${id}`)
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

  if (loading) return <h2 style={{ color: "white" }}>Loading...</h2>;
  if (!movie) return <h2 style={{ color: "white" }}>Movie not found</h2>;

  const posterUrl = getPosterPath(movie.title);

  const renderRecs = (title: string, recs: string[]) => (
    recs.length > 0 && (
      <RecommendationSection>
        <h2>{title}</h2>
        <RecommendationScroll>
          {recs.map((title, i) => (
            <RecommendationCard key={i} onClick={() => navigate(`/movie/${slugify(title)}`)}>
              <img
                src={getPosterPath(title)}
                alt={title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                }}
              />
            </RecommendationCard>
          ))}
        </RecommendationScroll>
      </RecommendationSection>
    )
  );

  return (
    <Background $posterUrl={`"${posterUrl}"`}>
      <BackButton onClick={() => navigate(-1)}>← Back</BackButton>

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
            (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
          }}
        />

        <InfoSection>
          <Title>{movie.title}</Title>
          <Description>{movie.description}</Description>
          <Metadata>
            <MetaItem><strong>Release Year:</strong> {movie.release_year}</MetaItem>
            <MetaItem><strong>Rating:</strong> {movie.rating}</MetaItem>
            <MetaItem><strong>Genre:</strong> {movie.genre}</MetaItem>
          </Metadata>
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
  justify-content: flex-end;
  padding: 3rem;
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
`;

const Metadata = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 2rem;
  font-size: 1rem;
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
`;
