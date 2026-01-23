import { useState, useEffect, useRef } from 'react';
import Hand from "./hand.jsx";
import HandInput from "./handInput.jsx";
import Buttons from "./buttons.jsx";
import useScript from "./hooks/useScript.jsx";
import './style.css';

function App() {
  const canvas = useRef(null);
  const [handStr, setHandStr] = useState("");

  useScript("./setUpv2.js");
  useScript("./hand.js");


  useEffect(() => {
      const main = window.main;
      if (!main) {
          return;
      }
      
      main.hand = [];
      for (let i = 0; i + 1 < handStr.length; i += 2) {
          main.hand.push(handStr.slice(i, i + 2));
      }

      console.log(main.hand);
  }, [handStr]);

  return (
    <>
		<canvas ref={canvas} id="canvas" width="400" height="300"></canvas>
		<HandInput handStr={handStr} setHandStr={setHandStr} />
		<Buttons handStr={handStr} setHandStr={setHandStr} />
    </>
  );
}

export default App;
