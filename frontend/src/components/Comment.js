import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Comment = () => {
  const [responses, setResponses] = useState({
    question1: '',
    question2: ''
  });
  const [comments, setComments] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  const BACKEND_URL = '/api'; // Do not forget to change DATA_PATH
  // const BACKEND_URL = 'http://localhost:5000/api';

  // Load stored comments when the page loads
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
    setComments(storedComments);
  }, []);

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
        const response = await fetch(`${BACKEND_URL}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name, 
                comments: {
                    question1: responses.question1,
                    question2: responses.question2
                }
            })
        });

        const responseData = await response.json();

        // if (!response.ok) {
        //     throw new Error(responseData.message || 'Failed to submit comment.');
        // }

        // Update comments state with new comment from backend response
        const newComment = { name: responseData.name, ...responseData.comments };
        const updatedComments = [...comments, newComment];

        setComments(updatedComments);
        localStorage.setItem('comments', JSON.stringify(updatedComments)); // Store locally for persistence
        setResponses({ question1: '', question2: '' });
        setIsSubmitted(true); // Set submission state to true

    } catch (error) {
        console.error("Error submitting comment:", error);
        alert(error.message);
    }
};

  // Show thank you message after submission
  if (isSubmitted) {
    return <h3 className="mt-5">Thank you for your feedback!</h3>;
  }

  return (
    <div className="container mt-5">
      <h2>Feedback and Comments</h2>
      <p>Please share your thoughts about the quiz and voting experiment below.</p>

      <label>What do you think is important for an acceptable trajectory?</label>
      <textarea
        className="form-control my-2"
        rows="3"
        placeholder="Your answer here..."
        value={responses.question1}
        onChange={(e) => setResponses({ ...responses, question1: e.target.value })}
      />

      <label>Do you have any suggestions for improvements to this website?</label>
      <textarea
        className="form-control my-2"
        rows="3"
        placeholder="Your answer here..."
        value={responses.question2}
        onChange={(e) => setResponses({ ...responses, question2: e.target.value })}
      />

      <button className="btn btn-primary mb-3" onClick={handleSubmit}>
        Submit Comments
      </button>
    </div>
  );
};

export default Comment;
