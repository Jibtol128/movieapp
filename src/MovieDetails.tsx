import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import './Movies.css';
import './ReviewForm.css';
import './ReviewPagination.css';

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/original';

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [favMsg, setFavMsg] = useState('');
  const [watchMsg, setWatchMsg] = useState('');
  const [rateMsg, setRateMsg] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [addListMsg, setAddListMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const { token, user } = useAuth();
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 4;

  // Fetch movie details, trailer, and status
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}/videos`)
      .then(res => res.json())
      .then(data => {
        const yt = (data.results || []).find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
        setTrailer(yt ? yt.key : null);
      });
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/status/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          setIsFavourite(data.isFavourite);
          setIsWatchlist(data.isWatchlist);
        });
      // Fetch user rating for this movie
      if (id) {
        fetchUserRating(id, token).then(setRating);
      }
      // Fetch user custom lists for add-to-list dropdown
      fetch(`${import.meta.env.VITE_API_URL}/api/user/lists`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setUserLists);
      // Fetch user reviews for this movie
      fetch(`${import.meta.env.VITE_API_URL}/api/user/reviews/${id}`)
        .then(res => res.json())
        .then(setReviews);
    }
  }, [id, token, reviewMsg]);

  // Add/remove favourite
  const handleFavorite = async () => {
    if (!isFavourite) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ movieId: id, movieData: movie })
      });
      setFavMsg('Added to Favourites!');
      setIsFavourite(true);
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/favorites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavMsg('Removed from Favourites!');
      setIsFavourite(false);
    }
    setTimeout(() => setFavMsg(''), 1500);
  };

  // Add/remove watchlist
  const handleWatchlist = async () => {
    if (!isWatchlist) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ movieId: id, movieData: movie })
      });
      setWatchMsg('Added to Watchlist!');
      setIsWatchlist(true);
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/watchlist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchMsg('Removed from Watchlist!');
      setIsWatchlist(false);
    }
    setTimeout(() => setWatchMsg(''), 1500);
  };

  // API helpers for user ratings
  const fetchUserRating = async (movieId: string, token: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/ratings/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.rating || 0;
  };

  const saveUserRating = async (movieId: string, rating: number, token: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ movieId, rating })
    });
  };

  const handleRate = async (value: number) => {
    // Only allow increase/decrease, not clear
    if (value < 1 || value > 5) return;
    setRating(value);
    setRateMsg(`You rated this movie ${value} star${value > 1 ? 's' : ''}!`);
    if (token && id) await saveUserRating(id, value, token);
    setTimeout(() => setRateMsg(''), 1500);
  };

  const handleAddToList = async (listId: string) => {
    if (!token || !id) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/lists/${listId}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ movieId: id, movieData: movie })
    });
    setAddListMsg('Added to list!');
    setTimeout(() => setAddListMsg(''), 1200);
    setShowAddToList(false);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !token || !id) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ movieId: id, review: reviewText })
    });
    setReviewMsg('Review added!');
    setReviewText('');
    setTimeout(() => setReviewMsg(''), 1200);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this review?')) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setReviewMsg('Review deleted');
    setTimeout(() => setReviewMsg(''), 1200);
  };

  // Pagination for reviews
  const paginatedReviews = reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  if (!movie) return <div className="movies-bg"><div className="loading-spinner">Loading movie details...</div></div>;

  return (
    <div className="movie-detail-container">
      {/* Back to Movies Button */}
      <button className="back-to-movies" onClick={() => navigate('/')} title="Back to Movies">
        ←
      </button>
      {/* Hero Section with Backdrop */}
      <div className="movie-hero-section" style={{
        backgroundImage: `linear-gradient(rgba(22, 18, 56, 0.7), rgba(22, 18, 56, 0.9)), url(${TMDB_BACKDROP + movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-content">
          <div className="hero-poster">
            <img src={TMDB_IMAGE + movie.poster_path} alt={movie.title} className="hero-poster-img" />
            <div className="poster-overlay">
              <div className="rating-circle">
                <span className="rating-score">{movie.vote_average?.toFixed(1)}</span>
                <span className="rating-label">TMDB</span>
              </div>
            </div>
          </div>
          <div className="hero-info">
            <h1 className="hero-title">{movie.title}</h1>
            {movie.tagline && <p className="hero-tagline">"{movie.tagline}"</p>}
            <div className="hero-meta">
              <span className="year">{movie.release_date?.slice(0, 4)}</span>
              <span className="runtime">{movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
              <span className="language">{movie.original_language?.toUpperCase()}</span>
              <span className="status">{movie.status}</span>
            </div>
            <div className="genre-tags">
              {movie.genres?.map((genre: any) => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
            <p className="hero-overview">{movie.overview}</p>
            
            {/* Action Buttons */}
            <div className="hero-actions">
              {trailer && (
                <button className="play-trailer-btn" onClick={() => setShowTrailer(!showTrailer)}>
                  <span className="play-icon">▶</span>
                  {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                </button>
              )}
              {token && (
                <>
                  <button className={`action-btn favourite-btn ${isFavourite ? 'active' : ''}`} onClick={handleFavorite}>
                    <span className="btn-icon">{isFavourite ? '❤️' : '🤍'}</span>
                    {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                  </button>
                  <button className={`action-btn watchlist-btn ${isWatchlist ? 'active' : ''}`} onClick={handleWatchlist}>
                    <span className="btn-icon">{isWatchlist ? '✓' : '+'}</span>
                    {isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>
                  <button className="action-btn" onClick={() => setShowAddToList(v => !v)}>
                    ➕ Add to Custom List
                  </button>
                  {showAddToList && (
                    <div className="add-to-list-dropdown">
                      {userLists.length === 0 ? (
                        <div style={{ color: 'rgba(255,255,255,0.7)', padding: '1rem', textAlign: 'center' }}>
                          No custom lists yet.{' '}
                          <Link to="/custom-lists" style={{ color: '#ff9100', textDecoration: 'underline' }}>
                            Create one?
                          </Link>
                        </div>
                      ) : (
                        <ul>
                          {userLists.map((list: any) => (
                            <li key={list.id}>
                              <button onClick={() => handleAddToList(list.id)}>{list.name}</button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button className="close-dropdown" onClick={() => setShowAddToList(false)}>Close</button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Star Rating - Moved to better position on mobile */}
            {token && (
              <div className="rating-section">
                <span className="rating-label-text">Rate this movie:</span>
                <div className="star-rating">
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      className={`rating-star ${star <= (hover || rating) ? 'filled' : ''}`}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >★</span>
                  ))}
                  {rating > 0 && <span className="user-rating">Your rating: {rating}/5</span>}
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="action-messages">
              {favMsg && <div className="action-message success">{favMsg}</div>}
              {watchMsg && <div className="action-message success">{watchMsg}</div>}
              {rateMsg && <div className="action-message success">{rateMsg}</div>}
              {addListMsg && <div className="action-message success">{addListMsg}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailer && showTrailer && (
        <div className="trailer-section">
          <div className="trailer-container">
            <h2 className="section-title">Official Trailer</h2>
            <div className="trailer-wrapper">
              <iframe 
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0`}
                title="Movie Trailer"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
                className="trailer-iframe"
              />
            </div>
          </div>
        </div>
      )}

      {/* Movie Details Section */}
      <div className="movie-info-section">
        <div className="info-container">
          <div className="info-grid">
            <div className="info-card">
              <h3 className="info-title">Movie Details</h3>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">Release Date:</span>
                  <span className="info-value">{movie.release_date || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Runtime:</span>
                  <span className="info-value">{movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Language:</span>
                  <span className="info-value">{movie.original_language?.toUpperCase() || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{movie.status || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Budget:</span>
                  <span className="info-value">{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Revenue:</span>
                  <span className="info-value">{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <h3 className="info-title">Production</h3>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">Companies:</span>
                  <span className="info-value">
                    {movie.production_companies?.map((c: any) => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Countries:</span>
                  <span className="info-value">
                    {movie.production_countries?.map((c: any) => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <h3 className="info-title">Ratings & Reviews</h3>
              <div className="rating-stats">
                <div className="rating-item">
                  <div className="rating-circle-large">
                    <span className="rating-number">{movie.vote_average?.toFixed(1)}</span>
                    <span className="rating-max">/10</span>
                  </div>
                  <div className="rating-details">
                    <span className="rating-source">TMDB Score</span>
                    <span className="rating-votes">{movie.vote_count?.toLocaleString()} votes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="review-section">
        <div className="review-section-title">Reviews</div>
        {!token && (
          <div style={{
            background: 'rgba(255,145,0,0.08)',
            color: '#ff9100',
            border: '1px solid rgba(255,145,0,0.15)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            <span>Login or register to add your own review.</span>
            <br />
            <Link to="/login" style={{ color: '#ff9100', textDecoration: 'underline', fontWeight: 700 }}>Login</Link>
            {" or "}
            <Link to="/register" style={{ color: '#ff9100', textDecoration: 'underline', fontWeight: 700 }}>Register</Link>
          </div>
        )}
        {token && (
          <form className="review-form" onSubmit={handleAddReview}>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Write your review..."
              rows={3}
              required
            />
            <button type="submit">Add Review</button>
          </form>
        )}
        {reviewMsg && <div className="action-message success">{reviewMsg}</div>}
        <ul className="reviews-list">
          {reviews.length === 0 && <li>No reviews yet.</li>}
          {paginatedReviews.map((r: any) => (
            <li className="review-item" key={r.id}>
              <div className="review-user">{r.user_id === user?.id ? 'You' : r.user_id.slice(0, 8)}</div>
              <div className="review-date">{new Date(r.created_at).toLocaleString()}</div>
              <div className="review-text">{r.review}</div>
              {r.user_id === user?.id && (
                <button className="delete-review-btn" onClick={() => handleDeleteReview(r.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
        {totalReviewPages > 1 && (
          <div className="review-pagination">
            <button onClick={() => setReviewPage(p => Math.max(1, p - 1))} disabled={reviewPage === 1}>&laquo; Prev</button>
            <span>Page {reviewPage} of {totalReviewPages}</span>
            <button onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))} disabled={reviewPage === totalReviewPages}>Next &raquo;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
