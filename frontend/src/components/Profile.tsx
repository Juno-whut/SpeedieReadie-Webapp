import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        axios.get('/api/user-profiles/')
            .then(response => setProfile(response.data[0])) // Assuming only one profile per user
            .catch(error => console.error('Error fetching profile:', error));
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
            <div>
                <label>Email: </label>
                <span>{profile.user?.email}</span>
            </div>
            <div>
                <label>Phone Number: </label>
                <span>{profile.phone_number}</span>
            </div>
        </div>
    );
};

export default Profile;

