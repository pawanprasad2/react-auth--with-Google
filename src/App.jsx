import React, { useState, useEffect } from "react";
import { signInWithGoogle } from "./FirebaseConfig";
import toast from "react-hot-toast";

const GoogleAuth = () => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user details on component mount
    const storedDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    if (storedDetails && Object.keys(storedDetails).length > 0) {
      setUserDetails(storedDetails);
    }
  }, []);

  const currentTime = new Date().getTime();
  const isLoggedIn = userDetails?.expirationTime > currentTime;

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const userResult = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        expirationTime: result.user.stsTokenManager.expirationTime,
      };
      localStorage.setItem("userDetails", JSON.stringify(userResult));
      setUserDetails(userResult);
      toast.success(`Welcome, ${userResult.displayName}!`);
    } catch (error) {
      console.log(error.toString());
      toast.error("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("userDetails");
      setUserDetails({});
      toast.success("Logged out successfully!");
      setLoading(false);
    }, 300);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">React Google Authentication</h1>
        <p className="auth-subtitle">
          Easily log in using your Google account. Fast, secure, and simple!
        </p>

        {isLoggedIn ? (
          <div className="user-profile">
            <img
              src={userDetails?.photoURL}
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-details">
              <h2 className="user-name">{userDetails?.displayName}</h2>
              <p className="user-email">{userDetails?.email}</p>
              <button
                onClick={signOut}
                disabled={loading}
                className="logout-button"
              >
                {loading ? <span className="spinner"></span> : "Logout"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={signIn}
            disabled={loading}
            className="google-signin-button"
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleAuth;
