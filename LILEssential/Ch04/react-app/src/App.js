import './App.css';
import { useState, useEffect, useReducer } from 'react';

function useInput(initialValue){
  const [value, setValue] = useState(initialValue);
  return [
    { value, onChange: e => setValue(e.target.value)},
    () => setValue(initialValue)
  ];
}

function GithubUser( { name, bio, avatar } ){
  return (
    <div>
      <h1>{name}</h1>
      <p>{bio}</p>
      <img src={avatar} alt={`${name}'s avatar`} height={150}/>
    </div>
  );
}

function Lift( {name, elevationGain, status } ){
  return (
    <div>
      <h1>{name}</h1>
      <p>{elevationGain} {status}</p>
    </div>
  )
}

const query = `
query {
  allLifts {
    name
    elevationGain
    status
  }
}`;

const opts = {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify( { query } )
}

const tahoe_peaks = [
  {
    name: "Freel", elevation: 10891
  },
  {
    name: "Monument", elevation:10067
  },
  {
    name: "Pyramid", elevation: 9983
  },
  {
    name: "Tallac", elevation: 9735
  }
];

function List( { data, renderItem, renderEmpty } ) {
  return !data.length ? renderEmpty 
  : (
  <ul>
    {data.map((item) => (
      <li key = {item.name}>
        {renderItem(item)}
      </li>
    ))}
  </ul>
  );
}


function App() {
  const [emotion, setEmotion] = useState("happy");
  const [secondary, setSecondary] = useState("tired");
  const [checked, setChecked] = useReducer(checked => !checked, false);

  // useEffect(() => {
  //   console.log(`It's ${emotion} right now`);
  // }, [emotion]);

  // useEffect(() => {
  //   console.log(`It's ${secondary} around here!`);
  // }, [secondary]);

  const [data, setData] = useState(null);
  const [liftData, setLiftData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.github.com/users/chocolatchips')
    .then((response) => response.json())
    .then(setData)
    .catch(setError);
  }, []);

  useEffect(() =>{
    setLoading(true);
    fetch(`https://snowtooth.moonhighway.com/`, opts)
    .then((response) => response.json())
    .then(setLiftData)
    .then(() => setLoading(false))
    .catch(setError);
  }, []);


  const [titleProps, resetTitle] = useInput("");
  const [colorProps, resetColor] = useInput("#000000");

  const submit = (e) => {
    e.preventDefault();
    alert(`${titleProps.value}, ${colorProps.value}`);
    resetTitle();
    resetColor();
  };

  if (loading)
    return (<h1>Loading...</h1>);
  if (error)
    return (<pre>{JSON.stringify(error)}</pre>);
  if (!data) return null;

  return (
    <div className="App">
      <GithubUser
        name={data.name}
        bio={data.bio}
        avatar={data.avatar_url}
      />
      <List 
      data={tahoe_peaks} 
      renderEmpty={<p>This list is empty</p>}
      renderItem={(item) => (
        <>
          {item.name} - {item.elevation} ft.
        </>
      )}
      />

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

        {liftData.data.allLifts.map((lift) => (
          <Lift
            name={lift.name}
            elevationGain={lift.elevationGain}
            status={lift.status}
          />
        ))}
    </div>
  );

  
}

export default App;
