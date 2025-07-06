import React, { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { Link } from 'react-router-dom';
import './Movies.css';

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';

const Favourites: React.FC = () => {
  const { token } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/user/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }, [token]);

  const handleRemove = async (movieId: string) => {
    await fetch(`/api/user/favorites/${movieId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setMovies(movies => movies.filter(m => m.movie_id !== movieId));
  };

  if (!token) return <div className="movies-bg"><div className="movie-title">Login to view your favourites.</div></div>;
  if (loading) return <div className="movies-bg"><div className="movie-title">Loading...</div></div>;

  return (
    <div className="movies-bg">
      <h2 className="movie-title" style={{fontSize:'2rem',marginBottom:'2rem'}}>Your Favourites</h2>
      <div className="movies-grid">
        {movies.length === 0 ? (
          <div style={{color:'#fff',fontSize:'1.2rem'}}>No favourites yet.</div>
        ) : movies.map(movie => (
          <div key={movie.movie_id} className="movie-card">
            <Link to={`/movie/${movie.movie_id}`} style={{textDecoration:'none', color:'inherit'}}>
              <img src={TMDB_IMAGE + movie.movie_data.poster_path} alt={movie.movie_data.title} className="movie-img" />
              <div className="movie-title">{movie.movie_data.title}</div>
              <div className="movie-meta">{movie.movie_data.release_date?.slice(0,4)} &bull; ⭐ {movie.movie_data.vote_average}</div>
            </Link>
            <button className="fav-btn" style={{marginTop:'0.7rem'}} onClick={() => handleRemove(movie.movie_id)}>🗑 Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
