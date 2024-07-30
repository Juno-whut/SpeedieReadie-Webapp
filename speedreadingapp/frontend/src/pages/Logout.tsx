import { signOut, getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';


const Logout: React.FC = () => {
    useEffect(() => {
        handleSignOut();
      console.log('HomePage component mounted');
      // Place your function here
      handleSignOut();
    }, []);

    return(
        <div>
            <h1>See you Next Time</h1>
        </div>
    ); 
};

  async function handleSignOut() {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.log(error)
    }
  }

export default Logout