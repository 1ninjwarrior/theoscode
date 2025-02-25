import React from 'react';

const ExerciseComponent = ({ index, response }) => {
  // Assuming response is an object, access the correct property

  return (
    <div>
      <p>{response.content}</p>
    </div>
  );
};

export default ExerciseComponent;
