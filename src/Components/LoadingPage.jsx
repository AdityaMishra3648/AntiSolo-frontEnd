import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
  const codingFacts = [
    "Did you know? The first computer bug was an actual moth.",
    "Did you know? The first programmer was Ada Lovelace in the 1800s.",
    "Did you know? JavaScript was created in just 10 days.",
    "Did you know? The original name of Java was Oak.",
    "Did you know? Git was created by Linus Torvalds, the same guy who created Linux.",
    "Did you know? The Apollo 11 mission was guided by software with just 64KB of memory.",
    "Did you know? Python is named after Monty Python, not the snake.",
    "Did you know? Email existed before the World Wide Web.",
    "Did you know? The first domain ever registered was Symbolics.com in 1985.",
    "Did you know? More than 700 programming languages exist today.",
    "Did you know? The first 1GB hard drive weighed over 500 pounds.",
    "Did you know? Stack Overflow gets over 100 million visits every month.",
    "Did you know? The first iPhone had the same processing power as a 1990s supercomputer.",
    "Did you know? Facebook was originally called 'TheFacebook'.",
    "Did you know? The ‘404’ error code is named after a room at CERN.",
    "Did you know? The world’s first website is still online.",
    "Did you know? The ‘@’ symbol was chosen for emails because it was rarely used.",
    "Did you know? Mark Zuckerberg is red-green color blind, that’s why Facebook is blue.",
    "Did you know? The Matrix’s iconic green code is actually a mix of sushi recipes.",
    "Did you know? The word ‘robot’ comes from a Czech word meaning ‘forced labor’.",
    "Did you know? Tim Berners-Lee invented the World Wide Web in 1989.",
    "Did you know? Apple’s first logo featured Isaac Newton under a tree.",
    "Did you know? The first computer game was created in 1961—it was called Spacewar!",
    "Did you know? The first tweet ever was “just setting up my twttr”.",
    "Did you know? The youngest app developer published their first app at age 9!"
  ];
  const randomFact = codingFacts[Math.floor(Math.random() * codingFacts.length)];
  
  return (
    <div className="loading-container">
      <div className="content-wrapper">
        <h1 className="loading-title">Loading ...</h1>
        {/* <p className="loading-subtitle">Gathering cool code from teenage devs...</p> */}
        
        <div className="icons-container">
          <div className="icon code-icon">{'</'}</div>
          <div className="icon loading-spinner"></div>
          <div className="icon sparkle-icon">✨</div>
        </div>
      </div>

      <div className="fun-fact">
        <p>{randomFact}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
