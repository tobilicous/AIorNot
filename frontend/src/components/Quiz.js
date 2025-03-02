import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import simImg1 from '../assets/simulation_image_1.png';
import simImg2 from '../assets/simulation_image_2.png'; 
import realImg1 from '../assets/real_image_1.png';
import realImg2 from '../assets/real_image_2.png';
import realImg3 from '../assets/real_image_3.png';


const Quiz = () => {
  const navigate = useNavigate();

  const questions = [
    // {
    //   id: 1,
    //   question: "Which object is more tolerant to contact in the image below?",
    //   options: ["Wine bottle", "Tuna fish can"],
    //   correct: "Tuna fish can",
    //   media: {
    //     type: "image",
    //     src: simImg2,
    //   },
    // },
    {
      id: 1,
      question: "In the scene below, the target object is the cup. Which object is more acceptable to make contact with?",
      options: ["Toy volleyball", "Mouthwash bottle"],
      correct: "Toy volleyball",
      media: {
        type: "image",
        src: realImg1,
      },
    },
    // {
    //   id: 3,
    //   question: "In the scene below, the target object is the cup. Which object is more acceptable to make contact with?",
    //   options: ["Foam cylinder", "Pitcher"],
    //   correct: "Foam cylinder",
    //   media: {
    //     type: "image",
    //     src: realImg2,
    //   },
    // },
    {
      id: 2, 
      question: "In the scene below, the target object is the tuna fish can. Which object is more acceptable to make contact with?",
      options: ["Spray bottle", "Toy elephant"],
      correct: "Toy elephant",
      media: {
        type: "image",
        src: realImg3,
      },
    },
    // { 
    //   id: 5,
    //   question: "Which trajectory is better in the following videos?",
    //   options: ["Left video", "Right video"],
    //   correct: "Right video",
    //   media: {
    //     type: "videos",
    //     video1: "/videos/grant-cot-shelf2-center-rrt_star-200-10-13_video.mp4",
    //     video2: "/videos/grant-default-shelf2-center-rrt_star-200-10-01_video.mp4",
    //   },
    // },
    { 
      id: 3,
      question: "Which trajectory is better in the following videos?",
      options: ["Left video", "Right video"],
      correct: "Left video",
      media: {
        type: "videos",
        video1: "/videos/scene5-default-center-rrt_star-200-10-06_video.mp4",
        video2: "/videos/scene5-default-center-rrt_star-200-10-08_video.mp4",
      },
    },
  ];

  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  // Handle answer selection
  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    setError(""); // Clear any previous error
  };

  // Check if all questions are answered correctly
  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before proceeding.");
      return;
    }

    const allCorrect = questions.every((q) => answers[q.id] === q.correct);

    if (allCorrect) {
      localStorage.setItem("quizCompleted", "true"); // Store completion status
      alert("Quiz completed successfully!");
      navigate("/vote"); // Redirect to voting page
    } else {
      setError("Some answers are incorrect. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Quiz</h2>
      <p className="mb-3">Please read the instructions below and complete the following quiz to proceed to the voting page.</p>
      <p> 
        In this experiment, we will present you with several questions. Each question will display a pair of videos showing the trajectory of a robot in simulation or real world.
        The goal for the robot is to reach the target object behind some obstables, and the robot may make contact with some of them during execution.
        Your task is to decide which of the two videos demonstrates a better trajectory.
        You may select the "cannot decide" option if you think both videos are equally good or bad.
      </p>
      <p>
        In some scenarios, it is inevitable for the robot to make contact with obstacles in order to reach the target object.
        However, the robot should try to choose a trajectory that minimizes the impact of such contact.
        For example, when given two obstacles, we generally prefer to make contact with the less fragile one. 
        The following example shows a bad trajectory where the robot makes contact with a fragile glass bottle.
      </p>
      {/* Video Display */}
      <div className="d-flex justify-content-center my-3">
        <video
          // src="/videos/grant-cot-shelf2-center-rrt_star-200-10-13_video.mp4"
          src="/videos/scene3-lapp-2.mp4"
          controls
          muted
          style={{ maxWidth: "500px", border: "1px solid #ddd", borderRadius: "8px", padding: "5px" }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <p>
        Before you start voting, please complete the following quiz first.
      </p>
      {questions.map((q, index) => (
        <div key={q.id} className="mb-4">
          {/* Display the question index */}
          <h6 style={{ textIndent: "20px" }}>
            {index + 1}. {q.question}
          </h6>

          {/* Render Media (Image or Videos) if Exists */}
          {q.media && q.media.type === "image" && (
            <div className="d-flex justify-content-center my-3">
              <img
                src={q.media.src}
                alt={`Question ${q.id} media`}
                className="img-fluid my-2"
                style={{ width: "500px", height: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "5px" }}
              />
            </div>
          )}

          {/* Render Two Videos for a Question */}
          {q.media && q.media.type === "videos" && (
            <div className="d-flex flex-row justify-content-center align-items-center my-3">
              <video
                src={q.media.video1}
                controls
                muted
                className="mx-2"
                style={{ width: "500px", border: "1px solid #ddd", borderRadius: "8px" }}
              >
                Your browser does not support the video tag.
              </video>
              <video
                src={q.media.video2}
                controls
                muted
                className="mx-2"
                style={{ width: "500px", border: "1px solid #ddd", borderRadius: "8px" }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Render Answer Options */}
          
          {q.options.map((option) => (
            <div key={option} style={{ marginLeft: "30px" }}>
              <label>
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={option}
                  checked={answers[q.id] === option}
                  onChange={() => handleAnswerChange(q.id, option)}
                />{" "}
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}

      {error && <div className="text-danger">{error}</div>}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
