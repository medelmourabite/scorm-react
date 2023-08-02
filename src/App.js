import React from 'react';
import ScormProvider, { withScorm } from 'react-scorm-provider';

const Learner = (props) => {
  return (
    <div>
      <p>Welcome, {props.sco.learnerName}!</p>
      <p>Your course status is currently: {props.sco.completionStatus}</p>
      <p>Click the button below to complete the course!</p>
      <button onClick={() => props.sco.setStatus('completed')}>
        Mark me complete!
      </button>
    </div>
  );
};

const ScoLearner = withScorm()(Learner);

const App = () => {
  return (
    <ScormProvider>
      <h1>Child SCORM package</h1>
      <ScoLearner />
    </ScormProvider>
  );
};

export default App;
