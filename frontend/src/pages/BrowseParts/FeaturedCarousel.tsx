import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../../types/MovieType";

export interface FeaturedCarouselProps {
    featuredMovies: MovieType[];
    currentSlide: number;
    setCurrentSlide: (index: number) => void;
    getPosterPath: (title: string) => string;
    movies: MovieType[];
    selectedGenre: string;
}

const FeaturedCarousel = ({ featuredMovies, currentSlide, setCurrentSlide, getPosterPath }: FeaturedCarouselProps) => {
    const navigate = useNavigate();

    return (
        <CarouselWrapper>
            <Carousel style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredMovies.map((movie, index) => (
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
            <GradientFade />
            <Dots>
                {featuredMovies.map((_, index) => (
                    <Dot
                        key={index}
                        $active={index === currentSlide}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </Dots>
        </CarouselWrapper>
    );
};

export default FeaturedCarousel;

const CarouselWrapper = styled.div`
  margin-top: 0px;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 80vh;
`;

const Carousel = styled.div`
  display: flex;
  transition: transform 1.5s ease-in-out;
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
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 3rem 2rem 6rem 2rem;
  color: white;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 10%, rgba(18, 18, 18, 1) 90%);
  z-index: 2;

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    max-width: 400px;
    font-size: 1rem;
    margin-bottom: 0.75rem;
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

const GradientFade = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, transparent, #121212);
  z-index: 1;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 3;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? "#000" : "#ccc")};
  transition: background 0.3s;
  cursor: pointer;
`;
