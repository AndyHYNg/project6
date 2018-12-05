import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import RenderMovies from './components/Movies';
import firebase from './firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      movies: [],
      searchTerm: '',
      searchParam: "",
      genreId: []
    }
  }

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user }, () => {
          // create reference specific to user
          // this.dbRef creates the ref in the the constructor state (allowable since it still resides in setState)
          this.dbRef = firebase.database().ref(`/${this.state.user.uid}`);

          // attaching our event listener to firebase
          this.dbRef.on("value", snapshot => {
            this.setState({
              // putting the empty object edge case in the entry point of getting snapshot is better than putting the edge cases later in the code
              diaryEntries: snapshot.val() || {}
            })
          });
        });
      }
    });
  };

  componentWillUnmount() {

    // this is called when a component leaves the page
    // in our single page app with one component, it will never be called
    // if we were rerouting to a different view, it would be called when the route changed.
    if (this.dbRef) {
      this.dbRef.off();
    }
  }

  logIn = () => {
    auth.signInWithPopup(provider).then(result => {
      // setState can take in a second argument that is a callback function after it finished set state
      this.setState(
        {
          user: result.user
        }
      );
    });
  };

  logOut = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  };

  getMovies = () => {
    axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '0613920bcfda4651982add49adcb7163',
        language: 'en-US',
        sort_by: 'popularity.desc',
        query: this.state.searchParam
      }
    }).then((res) => {
      const filteredResults = res.data.results.filter(movie =>
        (movie.poster_path !== null) && (movie.genre_ids !== [])
      )
      this.setState({
        movies: filteredResults
      }, () => {
        this.getGenre();
      });
    });
  }

  getGenre = () => {
    axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: '0613920bcfda4651982add49adcb7163',
        language: 'en-US'
      }
    }).then(res => {
      // console.log(res);
      const genreId = res.data.genres;
      // console.log(res.data.genres);
      this.setState({
        genreId
      })
      // go through each movie and assign it to the variable currentMovie
      this.state.movies.forEach(movie => {
        const currentMovie = movie;
        
        // go through the genre array in each movie and assign it to the variable currentGenre
        movie.genre_ids.forEach(genre => {
          // console.log(genre);
          const currentGenre = genre;
          // console.log(currentGenre);

          // go through the list of genres from the axios call and check if the id matches the id of the currentGenre
          this.state.genreId.forEach((genre) => {
            if (genre.id === currentGenre) {
              // console.log(currentMovie.genre_ids.indexOf(currentGenre));

              // go back to the currentMovie object and get the indexOf the matching currentGenre of the list of genres 
              const indexOfGenre = currentMovie.genre_ids.indexOf(currentGenre);
              //reassign the genre_id number to its matching genre name
              currentMovie.genre_ids[indexOfGenre] = genre.name;
              console.log(currentMovie);
              // return currentMovie.genre_ids.indexOf(currentGenre);
            }
          })

        })
      })
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault()
    // console.log('handleSubmit');
    // clears the search term and THEN use a callback function to get the movies from the API
    this.setState({
      searchParam: this.state.searchTerm,
      searchTerm: ""
    }, () => { this.getMovies(e) })
  };

  renderMovies = () => {
    return this.state.movies.map(movie => {
      // console.log(movie);
      return (
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
