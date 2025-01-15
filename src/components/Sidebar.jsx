import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar({ selectedId, onGenreChange }) {
  const apiKey = process.env.REACT_APP_API_KEY
  const [hamMenuOpened, setHamMenuOpened] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentNick, setCommentNick] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: apiKey,
          }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (genreId) => {
    onGenreChange(genreId);

    navigate(`/?genre=${genreId}`);
  };

  const toggleHamMenu = () => {
    setHamMenuOpened(!hamMenuOpened);
  };

  const toggleCommentsForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const postComment = () => {
    if (commentNick && commentText) {
      const newComment = {
        nick: commentNick,
        text: commentText,
        timestamp: new Date(),
      };
      setComments([...comments, newComment]);
      setCommentNick('');
      setCommentText('');
    }
  };

  return (
    <div className="genres-container" id="sidebar">
      <div className="hamburger">
        <p className="text-right">
          <a href="#" onClick={toggleHamMenu}>
            <img
              src="http://www.jgcreative.tv/assets/images/Hamburger.png"
              alt="Hamburger Menu"
            />
          </a>
        </p>
      </div>

      <div className={`genres ${hamMenuOpened ? '' : 'displayNone'}`}>
        <div className="table">
          <div onClick={() => handleGenreChange('popular')}>
            <a
              href="#/"
              className={selectedId === 'popular' ? 'bold-text' : ''}
            >
              Popular
            </a>
          </div>
          <div onClick={() => handleGenreChange('upcoming')}>
            <a
              href="#/upcoming"
              className={selectedId === 'upcoming' ? 'bold-text' : ''}
            >
              Upcoming
            </a>
          </div>
          <div onClick={() => handleGenreChange('top-rated')}>
            <a
              href="#/toprated"
              className={selectedId === 'top-rated' ? 'bold-text' : ''}
            >
              Top rated
            </a>
          </div>
          <div onClick={() => handleGenreChange('now-playing')}>
            <a
              href="#/nowplaying"
              className={selectedId === 'now-playing' ? 'bold-text' : ''}
            >
              Now Playing
            </a>
          </div>
          {genres.map((genre) => (
            <div key={genre.id} onClick={() => handleGenreChange(genre.id)}>
              <a
                href={`#/genre/${genre.id}`}
                className={selectedId === genre.id ? 'bold-text' : ''}
              >
                {genre.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments">
        <div>
          <button onClick={toggleCommentsForm} className="btn btn-success">
            Write a comment
          </button>
          {showCommentForm && (
            <form>
              <div className="form-group">
                <div>
                  <input
                    className="img-full"
                    type="text"
                    placeholder="Nickname"
                    value={commentNick}
                    onChange={(e) => setCommentNick(e.target.value)}
                  />
                </div>
                <div>
                  <textarea
                    className="img-full"
                    placeholder="Text"
                    rows="14"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={postComment}
                  >
                    Post comment
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div>
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p style={{ width: '100%' }}>
                <strong>{comment.nick}:</strong> {comment.text}
              </p>
              <p>{new Date(comment.timestamp).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;