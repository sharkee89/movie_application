import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';
import noImage from '../assets/images/noimage.jpg';

function MovieDetail() {
  const apiKey = process.env.REACT_APP_API_KEY
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [actors, setActors] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: { api_key: apiKey },
        });
        setMovie(movieResponse.data);

        const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
          params: { api_key: apiKey },
        });
        setVideoId(videoResponse.data.results[0]?.key || '');

        const actorsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
          params: { api_key: apiKey },
        });
        setActors(actorsResponse.data.cast);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const getStylesByVoteAverage = (voteAverage) => {
    let borderColor = 'red';
    let textColor = 'red';
  
    if (voteAverage >= 9) {
      borderColor = 'lightblue';
      textColor = 'lightblue';
    } else if (voteAverage >= 8) {
      borderColor = 'springgreen';
      textColor = 'springgreen';
    } else if (voteAverage >= 5) {
      borderColor = 'yellow';
      textColor = 'yellow';
    }
  
    return { borderColor, textColor };
  };

  const { borderColor, textColor } = getStylesByVoteAverage(movie.vote_average);

  return (
    <div className="movie-detail-wrapper">
      <div className="row">
        <div className="col-xs-12 col-sm-12">
          <div className="movie-data">
            <div className="row">
              <div className="col-md-4 col-sm-4">
                <img
                  className="img-full img-main"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
              <div className="col-md-8 col-sm-8">
                <div className="info">
                  <h3>{movie.title}</h3>
                  <p>Release date: {new Date(movie.release_date).toLocaleDateString()}</p>
                  <p>Duration: {movie.runtime} min</p>
                  <p>Popularity: {movie.popularity}</p>
                  <p>Budget: {formatCurrency(movie.budget)}</p>
                  <p>Revenue: {formatCurrency(movie.revenue)}</p>
                  <div className="vote-data"> 
                    <span style={{ color: textColor, fontWeight: 'bold' }}>{movie.vote_average.toFixed(1)}
                      <div className="circle" style={{borderColor: borderColor}}></div>
                    </span> 
                    <span>({movie.vote_count} votes)</span>
                  </div>
                  <p>{movie.overview}</p>
                  {videoId && (
                    <div className="row movie-trailer">
                      <div className="col-md-12">
                        <iframe
                          width="560"
                          height="315"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Movie Trailer"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row movie-actors">
            {actors.map((actor) => (
              <div key={actor.id} className="col-md-2 col-sm-3 col-xs-6">
                <div className="actor-wrapper">
                  <a href={`/actor/${actor.id}`}>
                    <img
                      className="image-sh"
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : noImage}
                      alt={actor.name}
                    />
                    <p className="movie-actor-name"><span class="name">{actor.name}</span> / {actor.character}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;