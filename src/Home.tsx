import React, { useEffect, useState } from 'react';
import './Movies.css';
import { useAuth } from './auth/AuthContext';

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';

// Example genre list (should be fetched from TMDB for full list)
const GENRES = [
  { id: '', name: 'All Genres' },
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '27', name: 'Horror' },
  { id: '10749', name: 'Romance' },
  { id: '53', name: 'Thriller' },
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searching, setSearching] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (searching) return; // Don't fetch popular if searching
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/popular?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages, 50));
      });
  }, [page, searching]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    const params = new URLSearchParams();
    if (search) params.append('query', search);
    if (genre) params.append('genre', genre);
    if (year) params.append('year', year);
    if (minRating) params.append('minRating', minRating);
    if (maxRating) params.append('maxRating', maxRating);
    if (minYear) params.append('minYear', minYear);
    if (maxYear) params.append('maxYear', maxYear);
    if (sortBy) params.append('sortBy', sortBy);
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 50));
        setPage(1);
      });
  };

  // Pagination for search results
  useEffect(() => {
    if (!searching || page === 1) return;
    const params = new URLSearchParams();
    if (search) params.append('query', search);
    if (genre) params.append('genre', genre);
    if (year) params.append('year', year);
    if (minRating) params.append('minRating', minRating);
    if (maxRating) params.append('maxRating', maxRating);
    if (minYear) params.append('minYear', minYear);
    if (maxYear) params.append('maxYear', maxYear);
    if (sortBy) params.append('sortBy', sortBy);
    params.append('page', String(page));
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 50));
      });
  }, [page, searching, search, genre, year, minRating, maxRating, minYear, maxYear, sortBy]);

  // Reset to popular if all filters are cleared
  useEffect(() => {
    if (!search && !genre && !year && !minRating && !maxRating && !minYear && !maxYear && !sortBy) {
      setSearching(false);
      setPage(1);
    }
  }, [search, genre, year, minRating, maxRating, minYear, maxYear, sortBy]);

  return (
    <div className="movies-bg">
      <form className="movie-search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          {GENRES.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          min="1900"
          max={new Date().getFullYear()}
          onChange={e => setYear(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Rating"
          value={minRating}
          min="0"
          max="10"
          step="0.1"
          onChange={e => setMinRating(e.target.value)}
          style={{width:'110px'}}
        />
        <input
          type="number"
          placeholder="Max Rating"
          value={maxRating}
          min="0"
          max="10"
          step="0.1"
          onChange={e => setMaxRating(e.target.value)}
          style={{width:'110px'}}
        />
        <input
          type="number"
          placeholder="Min Year"
          value={minYear}
          min="1900"
          max={new Date().getFullYear()}
          onChange={e => setMinYear(e.target.value)}
          style={{width:'110px'}}
        />
        <input
          type="number"
          placeholder="Max Year"
          value={maxYear}
          min="1900"
          max={new Date().getFullYear()}
          onChange={e => setMaxYear(e.target.value)}
          style={{width:'110px'}}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="popularity">Popularity</option>
          <option value="release_date">Release Date</option>
          <option value="rating">Rating</option>
        </select>
        <button type="submit">Search</button>
        {(search || genre || year || minRating || maxRating || minYear || maxYear || sortBy) && (
          <button type="button" onClick={() => {
            setSearch(''); setGenre(''); setYear(''); setMinRating(''); setMaxRating(''); setMinYear(''); setMaxYear(''); setSortBy(''); setSearching(false);
          }}>Clear</button>
        )}
      </form>
      <div className="filter-buttons">
        <button type="button" className={sortBy === 'popularity' ? 'active' : ''} onClick={() => { setSortBy('popularity'); handleSearch(); }}>Popular</button>
        <button type="button" className={sortBy === 'release_date' ? 'active' : ''} onClick={() => { setSortBy('release_date'); handleSearch(); }}>Newest</button>
        <button type="button" className={sortBy === 'rating' ? 'active' : ''} onClick={() => { setSortBy('rating'); handleSearch(); }}>Top Rated</button>
      </div>
      <div className="movies-grid">
        {movies.map(movie => (
          <div className="movie-card" key={movie.id} onClick={() => window.location.href = `/movie/${movie.id}`} style={{cursor:'pointer'}}>
            <img src={TMDB_IMAGE + movie.poster_path} alt={movie.title} className="movie-img" />
            <div className="movie-title">{movie.title}</div>
            <div className="movie-meta">{movie.release_date?.slice(0, 4)} &bull; ⭐ {movie.vote_average}</div>
            {token && (
              <div className="movie-actions">
                <button className="fav-btn">❤</button>
                <button className="watch-btn">+ Watchlist</button>
                <button className="rate-btn">★ Rate</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next &gt;</button>
      </div>
    </div>
  );
};

export default Home;
