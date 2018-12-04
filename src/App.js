import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import RenderMovies from './components/Movies';


class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      searchTerm: '',
      searchParam: ""
    }
  }

  getMovies = () => {
    axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '0613920bcfda4651982add49adcb7163',
        language: 'en-US',
        sort_by: 'popularity.desc',
        query: this.state.searchParam
      }
    }).then((res) => {
      console.log(res.data.results);
      this.setState({
        movies: res.data.results
      });
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault()
    console.log('handleSubmit');
    // clears the search term and THEN use a callback function to get the movies from the API
    this.setState({
      searchParam: this.state.searchTerm,
      searchTerm: ""
    }, () => {this.getMovies(e)})    
  };

  renderMovies = () => {
    return this.state.movies.map(movie => {
      console.log(movie);
      return(
        <div key={movie.id} className="movieCard clearfix">
          <div className="imageContainer">
            <img src={`http://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.overview} />
          </div>
          <h2>{movie.title}</h2>
          <p>{movie.release_date}</p>
        </div>
        )
    })
  }


  render() {
    return (
      <div className="App">
        <h1>Movies</h1>
        <form onSubmit={this.handleSubmit} action="">
          <label htmlFor="searchTerm">Search for a Movie!</label>
          <input
            value={this.state.searchTerm}
            onChange={this.handleChange}
            id="searchTerm"
            type="text" />
          <input type="submit" />
        </form>
        <div className="clearfix">
          <RenderMovies 
            renderMovies={this.renderMovies}
          />
        </div>
      </div>

    );
  }
}

export default App;
