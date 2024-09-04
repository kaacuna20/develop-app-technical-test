import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../apis/User';
import './../../css/ProfileStyle.css'; 

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-user mt-5">
    <div className="text-center mt-4">
      <h1>Your Data Profile</h1>
    </div>
    <div className="profile-card mx-auto">
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>ID:</strong> {profile.user_id}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  </div>
  );
};

export default Profile;
