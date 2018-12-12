import React from "react";

const uuidv4 = require("uuid/v4");

// simple component to render movie cast list
const MovieCast = props => {
  const castArray = props.cast || [];
  return (
    <ul>
      {castArray.slice(0, 5).map(cast => {
        return (
          <li key={uuidv4()}>
            <span className="castName">{cast.name}</span>: {cast.character}
          </li>
        );
      })}
    </ul>
  );
};

export default MovieCast;
