import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ActorDetail.css';

function ActorDetail() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [actorImages, setActorImages] = useState([]);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const actorResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}`, {
          params: { api_key: apiKey },
        });
        setActor(actorResponse.data);
        setMainImage(`https://image.tmdb.org/t/p/w500${actorResponse.data.profile_path || ''}`);

        const imagesResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}/images`, {
          params: { api_key: apiKey },
        });
        setActorImages(imagesResponse.data.profiles || []);

        const creditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits`, {
          params: { api_key: apiKey },
        });
        setMovieCredits(creditsResponse.data.cast);
      } catch (error) {
        console.error('Error fetching actor details:', error);
      }
    };

    fetchActorDetails();
  }, [id]);

  if (!actor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="actor-detail-wrapper">
      <div className="row">
        <div className="col-xs-12 col-sm-12">
          <div className="row">
            <div className="col-md-12 actor-data">
              {/* <div className="actore-main-image hidden-xs">
                <div className="row main-image-wrapper">
                  <img className="main-image" src={mainImage} alt={actor.name} />
                </div>
              </div> */}
              <div className="col-md-3 visible-xs">
                <div className="row">
                  <img className="main-image" src={mainImage} alt={actor.name} />
                </div>
              </div>
              <div className="actor-desc">
                <div className="row">
                  <div className="actor-info text-justify">
                    <h3>{actor.name}</h3>
                    <p>Birthday: {new Date(actor.birthday).toLocaleDateString()}</p>
                    {actor.deathday && <p>Death Day: {new Date(actor.deathday).toLocaleDateString()}</p>}
                    <p>Place of Birth: {actor.place_of_birth}</p>

                    <h4>Biography</h4>
                    <p>{actor.biography}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row actor-movies">
            <h3>{actor.name} - Movies</h3>
            <div className="actor-movie-list">
              {movieCredits.map((movie) => (
                <div key={movie.id} className="actor-movie col-xl-12">
                  <a href={`/movie/${movie.id}`}>
                    <img
                      className="movie-poster"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </a>
                  <p>{movie.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActorDetail;