import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }

    navigate("/");
  }, []);

  return (
    
    <div>
      Logging you in...
    </div>
  )
}

export default OAuthSuccess
