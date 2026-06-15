 import React from "react";
 import "./Home.css";
 function Home() {
    return (
       <div className="home-container">
      <div className="home-left">
        <h1>Welcome to MusicCue </h1>
        <b>Every song has a place. Every place has a song</b>
        <p>Drop your favourite tracks on the map and discover new music from people everywhere.</p>
          <button
                onClick={() => window.location.href = '/Login'}
                style={{ display: 'block', color: 'rgb(0, 0, 0)', padding: '10px 20px', margin: '20px auto' }}
            >
                Login
            </button>
            <button
                onClick={() => window.location.href = '/Register'}
                style={{ display: 'block', color: 'rgb(0, 0, 0)', padding: '10px 20px', margin: '20px auto' }}
            >
                Register
            </button>
         </div>
        </div>
    );
}

export default Home;
