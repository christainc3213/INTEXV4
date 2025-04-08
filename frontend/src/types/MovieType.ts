export interface MovieType {
    show_id: string;
    type: string;
    title: string;
    description: string;

    // These are optional extras, safe to include
    director?: string;
    cast?: string;
    country?: string;
    release_year?: number;
    rating?: string;
    duration?: string;

    // Genre flags or misc
    [key: string]: any;
}
