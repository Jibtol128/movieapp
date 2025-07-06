import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import './ListDetail.css';

interface MovieItem {
  movie_id: string;
  movie_data: any;
}

const ListDetail: React.FC = () => {
  const { listId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [listName, setListName] = useState('');
  const [editName, setEditName] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      // Get list name
      const resList = await fetch(`${import.meta.env.VITE_API_URL}/api/user/lists`, { headers: { Authorization: `Bearer ${token}` } });
      const lists = await resList.json();
      const found = lists.find((l: any) => l.id === listId);
      setListName(found?.name || '');
      setEditName(found?.name || '');
      // Get movies
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/lists/${listId}/movies`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMovies(data);
    } catch (e) {
      setError('Failed to load list');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && listId) fetchList();
    // eslint-disable-next-line
  }, [token, listId]);

  const handleRemove = async (movieId: string) => {
    if (!window.confirm('Remove this movie from the list?')) return;
    setLoading(true);
    setError('');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/lists/${listId}/movies/${movieId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchList();
    } catch (e) {
      setError('Could not remove movie');
    }
    setLoading(false);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setLoading(true);
    setError('');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName })
      });
      setListName(editName);
      setEditing(false);
    } catch (e) {
      setError('Could not rename list');
    }
    setLoading(false);
  };

  return (
    <div className="list-detail-container">
      <div style={{marginBottom: '20px'}}>
        <button 
          onClick={() => navigate('/lists')}
          style={{
            background: '#23233a',
            color: '#f5f5f7',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '0.98rem'
          }}
        >
          ← Back to Collections
        </button>
      </div>

      <div className="list-detail-header">
        {editing ? (
          <form onSubmit={handleRename} style={{display: 'flex', gap: '12px', alignItems: 'center', flex: 1}}>
            <input 
              value={editName} 
              onChange={e => setEditName(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #23233a',
                background: '#181822',
                color: '#f5f5f7',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}
            />
            <button 
              type="submit"
              style={{
                background: '#ef233c',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={() => setEditing(false)}
              style={{
                background: '#8d99ae',
                color: '#22223a',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="list-detail-title">{listName}</div>
            <button className="rename-list-btn" onClick={() => setEditing(true)}>
              Rename Collection
            </button>
          </>
        )}
      </div>

      {error && <div style={{color: '#ef233c', marginBottom: '16px'}}>{error}</div>}
      
      {loading ? (
        <div style={{textAlign: 'center', color: '#8d99ae'}}>Loading movies...</div>
      ) : (
        <div className="list-movies">
          {movies.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 20px', color: '#8d99ae'}}>
              <div style={{fontSize: '1.2rem', marginBottom: '8px'}}>No movies in this collection yet</div>
              <div>Add movies to this list from any movie details page!</div>
            </div>
          ) : (
            movies.map(item => (
              <div className="list-movie-item" key={item.movie_id}>
                <div className="list-movie-title">{item.movie_data?.title || item.movie_id}</div>
                <div className="list-movie-actions">
                  <button onClick={() => handleRemove(item.movie_id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListDetail;
