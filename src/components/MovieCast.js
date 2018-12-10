import React from "react";

const MovieCast = props => {
    const castArray = props.cast || []
    return (
        <ul>
            {
                (castArray).slice(0, 5).map(cast => {
                    return (
                        <li><span className="castName">{cast.name}</span>: {cast.character}</li>
                    )
                })
            }
        </ul>
    );
}

export default MovieCast;