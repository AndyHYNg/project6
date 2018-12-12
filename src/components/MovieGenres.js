import React from "react";

const uuidv4 = require("uuid/v4");

// simple component to render movie genre list
const MovieGenres = props => {
  const genreArray = props.movie.genres || [];
  return (
    <ul>
      {genreArray.map(genre => {
        return <li key={uuidv4()}>{genre.name}</li>;
      })}
    </ul>
  );
};

export default MovieGenres;
