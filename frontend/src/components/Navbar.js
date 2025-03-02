import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('name');
  const hasCompletedQuiz = localStorage.getItem('quizCompleted') === 'true';
  const hasCompletedVote = localStorage.getItem('voteCompleted') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('quizCompleted'); 
    localStorage.removeItem('voteCompleted');
    navigate('/login'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* Title is not a link to prevent navigation */}
      <span className="navbar-brand" style={{ marginLeft: '20px' }}>
        Trajectories with Acceptable Contact
      </span>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {/* Show navigation options only if the user is logged in */}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/quiz">Quiz</Link>
              </li>
              {/* Only show the voting option if the quiz is completed */}
              {hasCompletedQuiz && (
                <li className="nav-item">
                  <Link className="nav-link" to="/vote">Vote</Link>
                </li>
              )}
              {hasCompletedVote && (
                <li className="nav-item">
                  <Link className="nav-link" to="/comment">Comment</Link>
                </li>
              )}
              <li className="nav-item" style={{ marginLeft: '10px' }}>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
          {/* If not logged in, show a link to the login page */}
          {!isLoggedIn && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
