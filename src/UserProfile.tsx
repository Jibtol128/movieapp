import React, { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('UserProfile: user =', user, 'token =', token); // Debug log
    if (!token) return;
    setLoading(true);
    
    Promise.all([
      fetch('/api/user/lists', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/user/reviews', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
    ]).then(([listsData, reviewsData]) => {
      setLists(listsData);
      setReviews(reviewsData);
      setLoading(false);
    }).catch(error => {
      console.error('Error loading profile data:', error);
      setLoading(false);
    });
  }, [token, user]);

  if (!user && !token) return (
    <div className="user-profile-container">
      <h2>Please log in to view your profile.</h2>
      <p>Debug: No user and no token found.</p>
    </div>
  );

  if (!user && token) return (
    <div className="user-profile-container">
      <h2>Loading your profile...</h2>
      <p>Debug: Token found ({token.substring(0, 10)}...), fetching user data...</p>
    </div>
  );

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <div className="user-avatar">
          {(user.user_metadata?.username || user.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <h2>{user.user_metadata?.fullName || user.user_metadata?.username || 'Movie Enthusiast'}</h2>
          <p>{user.email || user.user_metadata?.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-section-title">Your Custom Lists</div>
        {loading ? <div>Loading...</div> : (
          <div className="profile-lists">
            {lists.length === 0 && <div>No lists yet. <span onClick={() => navigate('/lists')} style={{color: '#ef233c', cursor: 'pointer', textDecoration: 'underline'}}>Create your first list!</span></div>}
            {lists.map((l: any) => (
              <div className="profile-list-item" key={l.id}>
                <span className="profile-list-name" onClick={() => navigate(`/lists/${l.id}`)}>{l.name}</span>
                <div className="profile-list-actions">
                  <button onClick={() => navigate(`/lists/${l.id}`)}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-section">
        <div className="profile-section-title">
          Your Reviews {reviews.length > 0 && <span style={{fontWeight:400, fontSize:'1rem', color:'#8d99ae'}}>({reviews.length})</span>}
        </div>
        {loading ? <div>Loading...</div> : (
          <div className="profile-reviews">
            {reviews.length === 0 && <div>No reviews yet. Start watching movies and share your thoughts!</div>}
            {reviews.slice(0, 5).map((r: any) => (
              <div className="profile-review-item" key={r.id}>
                <div className="profile-review-movie">Movie ID: {r.movie_id}</div>
                <div className="profile-review-text">{r.review}</div>
                <div className="profile-review-date">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))}
            {reviews.length > 5 && (
              <div style={{textAlign: 'center', marginTop: '12px', color: '#8d99ae'}}>
                ... and {reviews.length - 5} more reviews
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
