import { useState, useEffect } from "react";
import HeaderComponent from "../components/HeaderComponent";
import FeatureHero from "../components/FeatureHero";
import RowSection from "../components/RowSection";
import CardFeature from "../components/CardFeature";
import Spinner from "../components/Spinner";
import FooterComponent from "../components/FooterComponent";
import { MovieType } from "../types/MovieType";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";

const extractFirstGenre = (item: any): string => {
  const genreKeys = [
    "drama",
    "thriller",
    "children",
    "suspense",
    "romance",
    "documentaries",
    "comedies",
    "crime",
    "feel-good",
  ];
  for (const key of genreKeys) {
    if (item[key] === 1) return key;
  }
  return "unknown";
};

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const itemIsFilm = (item: any): boolean => item.type === "Movie";

interface Slide {
  title: string;
  data: MovieType[];
}

const BrowsePage = () => {
  const [category, setCategory] = useState("films");
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<MovieType | null>(null);
  const [filmsData, setFilmsData] = useState<MovieType[]>([]);
  const [seriesData, setSeriesData] = useState<MovieType[]>([]);

  const categorize = (data: MovieType[], genres: string[]): Slide[] => {
    return genres.map((genre) => ({
      title: genre.charAt(0).toUpperCase() + genre.slice(1),
      data: data.filter((movie) => movie.genre === genre),
    }));
  };

  const filmGenres = ["drama", "thriller", "children", "suspense", "romance"];
  const seriesGenres = [
    "documentaries",
    "comedies",
    "children",
    "crime",
    "feel-good",
  ];

  const filmSlides = categorize(filmsData, filmGenres);
  const seriesSlides = categorize(seriesData, seriesGenres);

  const currentCategory = category === "films" ? filmSlides : seriesSlides;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:5001/MovieTitles");
        const rawData = await response.json();

        console.log("📦 Raw data from API:", rawData); // ← ADD THIS

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
          };
        });

        const films = transformed.filter(
          (m: MovieType) => m.genre && itemIsFilm(m)
        );
        const series = transformed.filter(
          (m: MovieType) => m.genre && !itemIsFilm(m)
        );

        setFilmsData(films);
        setSeriesData(series);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch movie data", error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner centered={true} />;

  return (
    <>
      <AuthorizeView>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <HeaderComponent showSigninButton />
        <FeatureHero
          title="Watch Patman Now"
          subtitle="Forever alone in a crowd...Arthur Fleck..."
          movieSlug="patman"
        />
        <div id="movies">
          {currentCategory.map((slide) => (
            <RowSection
              key={slide.title}
              title={slide.title}
              movies={slide.data}
              category={category}
              onCardClick={(movie) => setActiveItem(movie)}
            />
          ))}
        </div>
        {activeItem && (
          <CardFeature movie={activeItem} onClose={() => setActiveItem(null)} />
        )}
        {/* <FooterComponent /> */}
      </AuthorizeView>
    </>
  );
};

export default BrowsePage;
