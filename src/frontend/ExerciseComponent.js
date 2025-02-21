import React from 'react';

const ExerciseComponent = ({ index, response }) => {
  // Assuming response is an object, access the correct property
  const responseText = typeof response === 'object' ? response.text : response;

  return (
    <div style={{ margin: '0.5rem', padding: '0.5rem', backgroundColor: '#f7fafc', borderRadius: '0.375rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{responseText}</p>
    </div>
  );
};

export default ExerciseComponent;
