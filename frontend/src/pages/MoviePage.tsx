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
        return `/Movie Posters/${title
            .replace(/[^\w\s]/g, "") // remove special characters
            .replace(/\s+/g, " ") // collapse multiple spaces
            .trim()}.jpg`;
    };

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

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
                setMovie(matched ?? null);
            } catch (err) {
                console.error("Error fetching movie:", err);
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

                <RecommendationSection>
                    <h2>More Like This</h2>
                    <RecommendationScroll>
                        {[...Array(10)].map((_, i) => (
                            <RecommendationCard key={i}>
                                <img
                                    src="/Movie Posters/fallback.jpg"
                                    alt="Recommended"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "/Movie Posters/fallback.jpg";
                                    }}
                                />
                            </RecommendationCard>
                        ))}
                    </RecommendationScroll>
                </RecommendationSection>

                <RatingTag>{movie.rating}</RatingTag>
            </Overlay>

        </Background>
    );
};

export default MoviePage;

const genreFields = [
    "action",
    "adventure",
    "comedies",
    "dramas",
    "documentaries",
    "thrillers",
    "fantasy",
    "anime_int_tv",
    "horror",
    "reality_tv",
    "comedy_romance",
];


const Background = styled.div<{ $posterUrl: string }>`
    width: 100%;
    min-height: 100vh; // allow it to grow as needed
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

