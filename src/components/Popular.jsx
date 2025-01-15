import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Popular.css';

function Popular({ selectedGenre }) {
  const apiKey = process.env.REACT_APP_API_KEY
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [orderByPhrase, setOrderByPhrase] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      let topGenre = null;
      const TOP_GENRES = ['popular', 'upcoming', 'top-rated', 'now-playing']
      if (TOP_GENRES.includes(selectedGenre)) {
        topGenre = TOP_GENRES[TOP_GENRES.indexOf(selectedGenre)].replace(/-/g, "_");
      }
      const apiUrl = selectedGenre && !topGenre
        ? `https://api.themoviedb.org/3/genre/${selectedGenre}/movies`
        : `https://api.themoviedb.org/3/movie/${topGenre}`;

      try {
        const response = await axios.get(apiUrl, {
          params: {
            api_key: apiKey,
            page: currentPage,
          },
        });
        setPopularMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };

    fetchMovies();
  }, [selectedGenre, currentPage]);

  const handleOrderBy = (order) => {
    setOrderByPhrase(order);
  };

  const filteredMovies = popularMovies
    .filter((movie) => movie.title.toLowerCase().includes(searchPhrase.toLowerCase()))
    .sort((a, b) => {
      if (orderByPhrase === 'title') {
        return a.title.localeCompare(b.title);
      } else if (orderByPhrase === '-title') {
        return b.title.localeCompare(a.title);
      } else if (orderByPhrase === 'release_date') {
        return new Date(a.release_date) - new Date(b.release_date);
      } else if (orderByPhrase === '-release_date') {
        return new Date(b.release_date) - new Date(a.release_date);
      }
      return 0;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePagination = () => {
    const pages = [];
    const maxPages = 5;
    const minPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const maxPage = Math.min(totalPages, currentPage + Math.floor(maxPages / 2));

    if (minPage > 1) {
      pages.push(1);
      if (minPage > 2) pages.push('...');
    }

    for (let i = minPage; i <= maxPage; i++) {
      pages.push(i);
    }

    if (maxPage < totalPages) {
      if (maxPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="popular">
      <div className="row row-offcanvas row-offcanvas-right">
        <div className="col-xs-12 col-sm-12 col-md-12">
          <div className="orders">
            <div className="row">
              <div className="col-md-8 text-center">
                <ul className="pagination">
                  <li>
                    <a
                      href="#"
                      onClick={() => handleOrderBy('title')}
                      className={orderByPhrase === 'title' ? 'bold-order-text' : ''}
                    >
                      A-Z
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleOrderBy('-title')}
                      className={orderByPhrase === '-title' ? 'bold-order-text' : ''}
                    >
                      Z-A
                    </a>
                  </li>
                  <li className="hidden-xs hidden-sm">
                    <a
                      href="#"
                      onClick={() => handleOrderBy('-release_date')}
                      className={orderByPhrase === '-release_date' ? 'bold-order-text' : ''}
                    >
                      Newest to oldest
                    </a>
                  </li>
                  <li className="hidden-xs hidden-sm">
                    <a
                      href="#"
                      onClick={() => handleOrderBy('release_date')}
                      className={orderByPhrase === 'release_date' ? 'bold-order-text' : ''}
                    >
                      Oldest to newest
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleOrderBy('')}
                      className={orderByPhrase === '' ? 'bold-order-text' : ''}
                    >
                      Clear
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 search">
                <input
                  type="input"
                  className="movie-search list-group-item active"
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value)}
                  placeholder="Search"
                />
              </div>
            </div>
          </div>

          <div className="row movie-list">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="col-xs-6 col-sm-4 col-md-3 col-lg-2 movie-wrapper">
              <div className="zoom-container">
                <h4 className="text-center movie-title hidden-xs hidden-sm">{movie.title}</h4>
                <Link to={`/movie/${movie.id}`}>
                  <img
                    className="img-full img-responsive"
                    src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </Link>
              </div>
              <div className="movie-details">
                <h4 className="text-center movie-title hidden-md hidden-lg">{movie.title}</h4>
                <p className="text-center movie-rel-date">{new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          </div>
          <div className="pagination-container text-center">
            <ul className="pagination">
              {generatePagination().map((page, index) => (
                <li
                  key={index}
                  className={page === currentPage ? 'active' : ''}
                  onClick={() => page !== '...' && handlePageChange(page)}
                >
                  <a href="#">{page}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popular;