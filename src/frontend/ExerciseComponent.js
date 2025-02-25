import React, {useState} from 'react';
import { FaTrash } from 'react-icons/fa';

class Sets {
  reps = 0;
  weight = 0;
}

const ExerciseComponent = ({ index, response }) => {

  // Assuming response is an object, access the correct property
  const [sets, setSets] = useState([Sets]);
  return (
    <div>
      <p>{response.content}</p>
      <button onClick={() => setSets([...sets, new Sets()])}>+</button>
      <button onClick={() => setSets(sets.slice(0, -1))}><FaTrash /></button>
      <div>
        {sets.map((set, index) => (
          <div key={index}>
          <input type="number" initialValue={set.reps} onChange={(e) => set.reps = e.target.value} />
          <input type="number" initialValue={set.weight} onChange={(e) => set.weight = e.target.value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseComponent;
