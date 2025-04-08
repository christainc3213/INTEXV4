import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Movie {
    show_id: string;
    title: string;
    description: string;
    rating: string;
    release_year: number;
    genre: string; // we'll dynamically infer this
    slug: string; // we'll generate this from title
}

const MoviePage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    // Utility: convert title to slug
    const slugify = (str: string) =>
        str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch("https://localhost:5001/MovieTitles");
                const data = await res.json();

                // Generate slugs and genres on the fly
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

    return (
        <Background
            style={{
                backgroundImage: `url(/images/films/${movie.genre}/${movie.slug}/large.jpg)`,
            }}
        >
            <BackButton onClick={() => navigate(-1)}>← Back</BackButton>

            <Overlay>
                <InfoSection>
                    <Title>{movie.title}</Title>
                    <Description>{movie.description}</Description>
                    <Metadata>
                        <MetaItem>
                            <strong>Release Year:</strong> {movie.release_year}
                        </MetaItem>
                        <MetaItem>
                            <strong>Rating:</strong> {movie.rating}
                        </MetaItem>
                        <MetaItem>
                            <strong>Genre:</strong> {movie.genre}
                        </MetaItem>
                    </Metadata>
                </InfoSection>
                <RatingTag>{movie.rating}</RatingTag>
            </Overlay>
        </Background>
    );
};

export default MoviePage;

// Utility: convert title to slug

// Fields to infer genres from your dataset
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
    // add others as needed from your JSON structure
];

// (Styled Components are the same as before — not repeated here)
const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem;
  box-sizing: border-box;
  color: white;
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
