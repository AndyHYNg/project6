import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";

const MovieDetails = props => {
  return (
    <div className="movie-single__poster">
      {console.log(props)}
      <div className="movie-single__description">
        {/* print information about the movie in state to the page using object notation */}
        <header>
          <h1>YOU MADE IT</h1>
          {/* <h1>{props.movie.title}</h1>
          <h2>{props.movie.tagline}</h2>
          <p>{props.movie.overview}</p> */}
        </header>
      </div>
      <div className="movie-single__image">
        {/* we are using the url from the catalogue for the images */}
        {/* <img
          src={`http://image.tmdb.org/t/p/w500/${props.movie.poster_path}`}
          alt={`Movie poster for ${props.movie.title}`}
        /> */}
      </div>
    </div>
  );
};

export default MovieDetails;
