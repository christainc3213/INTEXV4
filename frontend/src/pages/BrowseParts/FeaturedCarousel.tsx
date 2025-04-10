import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MovieType } from "../../types/MovieType";
import { Helmet } from "react-helmet";

export interface FeaturedCarouselProps {
  featuredMovies: MovieType[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  getPosterPath: (title: string) => string;
  movies: MovieType[];
  selectedGenre: string;
}



const FeaturedCarousel = ({
  featuredMovies,
  currentSlide,
  setCurrentSlide,
  getPosterPath,
}: FeaturedCarouselProps) => {
  const navigate = useNavigate();
    const currentMovie = featuredMovies[currentSlide];

  return (
      <>
      <Helmet>
          {currentMovie && (
              <link
                  rel="preload"
                  as="video"
                  href={
                      currentMovie.docId === "s341"
                          ? "/Movie Trailers/Inception.mp4"
                          : `/Movie Trailers/${currentMovie.title.replace(/[^\w\s]/g, "").trim()}.mp4`
                  }
                  type="video/mp4"
              />
          )}
      </Helmet>
    <CarouselWrapper>
      <Carousel style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {featuredMovies.map((movie, index) => (
          <CarouselItem key={index}>
              {movie.docId === "s341" ? (
                  <VideoBackdrop
                      src="/Movie Trailers/Inception.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                  />
              ) : (
                  <VideoBackdrop
                  src={`/Movie Trailers/${movie.title.replace(/[^\w\s]/g, "").trim()}.mp4`}
              autoPlay
              muted
              loop
              playsInline
              onError={(e) => {
                  // fallback to image if video fails to load
                  const fallbackImg = document.createElement("img");
                  fallbackImg.src = getPosterPath(movie.title);
                  fallbackImg.style.width = "100%";
                  fallbackImg.style.height = "100%";
                  fallbackImg.style.objectFit = "cover";
                  const parent = (e.target as HTMLVideoElement).parentElement;
                  if (parent) {
                      parent.replaceChild(fallbackImg, e.target as Node);
                  }
              }}
          />
        
              )}


              <Overlay>
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
              <button onClick={() => navigate(`/movie/${movie.slug}`)}>
                Watch Now
              </button>
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
      </>
  );
};

export default FeaturedCarousel;

const CarouselWrapper = styled.div`
  margin-top: 0px;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 90vh;
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
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 10%,
    rgba(18, 18, 18, 1) 90%
  );
  z-index: 2;

  h2 {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 1rem;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  p {
    max-width: 500px;
    font-size: 1.05rem;
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
  border: ${(props) =>
    props.$active ? "2px solid #ccc" : "none"}; /* ✅ only active gets border */
  transition:
    background 0.3s,
    border 0.3s;
  cursor: pointer;
`;


const VideoBackdrop = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
