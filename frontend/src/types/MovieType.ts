// Define the GenreKey type
export type GenreKey =
    | "action"
    | "adventure"
    | "anime_int_tv"
    | "british_int_tv"
    | "children"
    | "comedies"
    | "comedy_drama_int"
    | "comedy_int"
    | "comedy_romance"
    | "crime_tv"
    | "documentaries"
    | "documentary_int"
    | "docuseries"
    | "dramas"
    | "drama_int"
    | "drama_romance"
    | "family"
    | "fantasy"
    | "horror"
    | "thriller_int"
    | "drama_romance_int_tv"
    | "kids_tv"
    | "language_tv"
    | "musicals"
    | "nature_tv"
    | "reality_tv"
    | "spirituality"
    | "action_tv"
    | "comedy_tv"
    | "drama_tv"
    | "talk_show_comedy_tv"
    | "thrillers";

// Define the mapped type for genre flags
export type GenreFlags = {
    [key in GenreKey]?: number;
};

// Combine the explicit properties with the genre flags
export interface MovieType extends GenreFlags {
    show_id: string;
    type: string;
    title: string;
    description: string;

    // Optional metadata
    director?: string;
    cast?: string;
    country?: string;
    release_year?: number;
    rating?: string;
    duration?: string;

    // Add these to support your transformed UI
    genre: string; // TEMPORARY
    slug: string;
    docId: string;
    posterFile: string;
}