import { useParams } from "react-router-dom";
import MoviePage from "../pages/MoviePage";

const MoviePageWrapper = () => {
    const { slug } = useParams();
    return <MoviePage key={slug} />;
};

export default MoviePageWrapper;