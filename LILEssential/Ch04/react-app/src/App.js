import './App.css';
import { useState, useEffect, useReducer } from 'react';

function useInput(initialValue){
  const [value, setValue] = useState(initialValue);
  return [
    { value, onChange: e => setValue(e.target.value)},
    () => setValue(initialValue)
  ];
}

function App() {
  const [emotion, setEmotion] = useState("happy");
  const [secondary, setSecondary] = useState("tired");
  const [checked, setChecked] = useReducer(checked => !checked, false);

  useEffect(() => {
    console.log(`It's ${emotion} right now`);
  }, [emotion]);

  useEffect(() => {
    console.log(`It's ${secondary} around here!`);
  }, [secondary]);

  const [titleProps, resetTitle] = useInput("");
  const [colorProps, resetColor] = useInput("#000000");

  const submit = (e) => {
    e.preventDefault();
    alert(`${titleProps.value}, ${colorProps.value}`);
    resetTitle();
    resetColor();
  };

  return (
    <div className="App">
      <h1>Current emotion is {emotion}</h1>
      <button onClick={() => setEmotion("sad")}>Sad</button>
      <button onClick={() => setEmotion("excited")}>Excited</button>
      
      <h2>Current secondary emotion is {secondary}</h2>
      <button onClick={() => setSecondary("grateful")}>Grateful</button>
      <button onClick={() => setSecondary("hungry")}>Hungry</button>
      
      <br/>
      <br/>
      
      <input type="checkbox" onChange={setChecked}/>
      <label>{checked ? "Checked" : "Not checked"}</label>
      
      <br/>
      <br/>
      <br/>
      <br/>
      
      <form onSubmit={submit}>
        <input 
        {...titleProps}
        type="text"
        placeholder='color title...'
        />
        <input
        {...colorProps}
        type="color"
        />
        <button>ADD</button>
      </form>
    </div>
  );

  
}

export default App;
