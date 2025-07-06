import React, { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CustomLists.css';

interface CustomList {
  id: string;
  name: string;
}

const CustomLists: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLists = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLists(data);
    } catch (e) {
      setError('Failed to load lists');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchLists();
  }, [token]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newListName })
      });
      if (!res.ok) throw new Error('Failed to create list');
      setNewListName('');
      fetchLists();
    } catch (e) {
      setError('Could not create list');
    }
    setLoading(false);
  };

  const handleDeleteList = async (id: string) => {
    if (!window.confirm('Delete this list?')) return;
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/user/lists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLists();
    } catch (e) {
      setError('Could not delete list');
    }
    setLoading(false);
  };

  return (
    <div className="custom-lists-container">
      <div className="custom-lists-header">
        <div className="custom-lists-title">Your Movie Collections</div>
        <button className="add-list-btn" onClick={() => document.getElementById('newListInput')?.focus()}>
          + Create New List
        </button>
      </div>
      
      <form onSubmit={handleCreateList} className="create-list-form" style={{marginBottom: '24px'}}>
        <input
          id="newListInput"
          type="text"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
          placeholder="Enter list name (e.g., 'Action Favorites', 'To Watch Later')"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #23233a',
            background: '#181822',
            color: '#f5f5f7',
            fontSize: '1.08rem',
            marginBottom: '12px'
          }}
        />
        <button 
          type="submit" 
          disabled={loading || !newListName.trim()}
          style={{
            background: newListName.trim() ? '#ef233c' : '#44445a',
            color: '#fff',
            border: 'none',
            borderRadius: '7px',
            padding: '8px 18px',
            fontSize: '1.05rem',
            cursor: newListName.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Creating...' : 'Create List'}
        </button>
      </form>

      {error && <div style={{color: '#ef233c', marginBottom: '16px'}}>{error}</div>}
      
      {loading ? (
        <div style={{textAlign: 'center', color: '#8d99ae'}}>Loading your collections...</div>
      ) : (
        <div className="lists-list">
          {lists.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 20px', color: '#8d99ae'}}>
              <div style={{fontSize: '1.2rem', marginBottom: '8px'}}>No movie lists yet</div>
              <div>Create your first collection to organize your favorite movies!</div>
            </div>
          ) : (
            lists.map(list => (
              <div className="list-item" key={list.id}>
                <span className="list-name" onClick={() => navigate(`/lists/${list.id}`)}>{list.name}</span>
                <div className="list-actions">
                  <button onClick={() => navigate(`/lists/${list.id}`)}>View</button>
                  <button onClick={() => handleDeleteList(list.id)} style={{background: '#ef233c'}}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomLists;
