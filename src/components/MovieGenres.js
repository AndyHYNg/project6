import React from "react";

const MovieGenres = props => {
    const genreArray = props.movie.genres || [];
    return (
        <ul>
            {
                (genreArray).map(genre => {
                    return (
                        <li>{genre.name}</li>
                    )
                })
            }
        </ul>
    );
}

export default MovieGenres;