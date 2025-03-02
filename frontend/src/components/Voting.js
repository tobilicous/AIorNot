import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Voting = () => {
  const [videoPairs, setVideoPairs] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const name = localStorage.getItem("name");

  const BACKEND_URL = '/api'; // Do not forget to change DATA_PATH
  // const BACKEND_URL = 'http://localhost:5000/api';

  // Shuffle function to randomize an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user has completed the quiz and is logged in
    if (!name) {
      alert("You must log in before voting.");
      navigate("/login");
      return;
    }

    const quizCompleted = localStorage.getItem("quizCompleted");
    if (quizCompleted !== "true") {
      alert("Please complete the quiz before voting.");
      navigate("/quiz");
    }
  }, [name, navigate]);

  // Fetch video pairs from the backend
  useEffect(() => {
    const fetchVideoPairs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/video-pairs`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Randomize the order of video pairs
        const randomizedPairs = shuffleArray(data);

        // // Randomize the order of videos within each pair
        // const shuffledPairs = randomizedPairs.map((pair) => {
        //   const shuffledVideos = shuffleArray([pair.video1, pair.video2]);
        //   return {
        //     ...pair,
        //     video1: shuffledVideos[0],
        //     video2: shuffledVideos[1],
        //   };
        // });

        // setVideoPairs(shuffledPairs);
        setVideoPairs(randomizedPairs);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch video pairs: ' + error.message);
      }
    };
    fetchVideoPairs();
  }, []);

  // Sync both videos to play together
  const syncVideos = () => {
    for (let i = 0; i < 2; i++) {
      const video = document.getElementById(`video${i}`);
      if (video) {
        video.currentTime = 0;
        video.play().catch((err) => console.error(`Error syncing video${i}:`, err));
      }
    }
  };

  // Handle user vote
  const handleVote = (selection) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [currentPairIndex]: { selection }
    }));
  };

  // Submit all votes to the backend
  const handleSubmit = async () => {
    try {
      const formattedVotes = videoPairs.map((pair, index) => ({
        video_pair_id: pair.id,
        selection: votes[index]?.selection || 'none',
      }));
  
      await fetch(`${BACKEND_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, votes: formattedVotes }),
      });
  
      alert('Votes submitted successfully!');
      setIsSubmitted(true);
      localStorage.setItem('voteCompleted', 'true');
      navigate('/comment');

    } catch (error) {
      alert('Failed to submit votes. Please try again.');
    }
  };
  
  if (isSubmitted) {
    return <h3>Thank you for voting!</h3>;
  }

  if (!videoPairs.length) {
    return <p>Loading video pairs...</p>;
  }

  const currentPair = videoPairs[currentPairIndex];
  const currentVote = votes[currentPairIndex]?.selection;

  return (
    <div className="container mt-5 text-center">
      <h2>Vote for the Best Video</h2>
      <h5>
        Question {currentPairIndex + 1} of {videoPairs.length}
      </h5>
      <h5>Target Object: <strong>{currentPair.target}</strong></h5>
      <button className="btn btn-secondary mb-3" onClick={syncVideos}>
        Sync Videos
      </button>
      <div className="row">
        <div className="col-md-6 text-center">
          <video
            key={currentPair.video1.video_url}
            id="video0"
            width="100%"
            height="auto"
            controls
            muted
            loop
            autoPlay
          >
            <source src={`${BACKEND_URL}/${currentPair.video1.video_url}`} type="video/mp4" />
          </video>
          <button
            className={`btn btn-outline-primary mt-3 ${
              currentVote === 'video1' ? 'active' : ''
            }`}
            onClick={() => handleVote('video1')}
          >
            Left
          </button>
        </div>
        <div className="col-md-6 text-center">
          <video
            key={currentPair.video2.video_url}
            id="video1"
            width="100%"
            height="auto"
            controls
            muted
            loop
            autoPlay
          >
            <source src={`${BACKEND_URL}/${currentPair.video2.video_url}`} type="video/mp4" />
          </video>
          <button
            className={`btn btn-outline-primary mt-3 ${
              currentVote === 'video2' ? 'active' : ''
            }`}
            onClick={() => handleVote('video2')}
          >
            Right
          </button>
        </div>
      </div>
      <div className="text-center mt-3">
        <button
          className={`btn btn-outline-primary ${
            currentVote === 'cannot_decide' ? 'active' : ''
          }`}
          onClick={() => handleVote('cannot_decide')}
        >
          Cannot Decide
        </button>
      </div>
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPairIndex((prev) => prev - 1)}
          disabled={currentPairIndex === 0}
        >
          Back
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPairIndex((prev) => prev + 1)}
          disabled={currentPairIndex === videoPairs.length - 1 || !votes[currentPairIndex]}
        >
          Next
        </button>
      </div>
      {currentPairIndex === videoPairs.length - 1 && (
        <div className="mt-4 text-center">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={Object.keys(votes).length < videoPairs.length}
          >
            Submit Votes
          </button>
        </div>
      )}
    </div>
  );
};

export default Voting;
