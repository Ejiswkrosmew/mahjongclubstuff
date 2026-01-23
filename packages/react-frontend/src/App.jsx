import { useState, useEffect, useRef } from 'react';
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

      main.updateWidth = true;

      console.log(main.hand);
  }, [handStr]);

  return (
    <>
    <div id="canvasWrapper">
        <canvas id="canvas" width="400" height="300"></canvas>
    </div>
    <div id="inputWrapper">
      <div id="mainInput">
		  <HandInput handStr={handStr} setHandStr={setHandStr} />
		  <Buttons handStr={handStr} setHandStr={setHandStr} />
      </div>
      <div id="helpText">
          <p>
          YOU CAN MANUALLY INPUT A HAND HERE! DO NOT USE SPACES!
          <br />
          Numbered Tiles: 1-9m/p/s (Aka dora is 0)
          <br />
          Honor Tiles: 1-7z
          <br />
          Hidden Tile: 0z
          <br />
          Calls: letter followed by number (#). Still need to manually input the tiles involved in the call
          <br />
          Chii: c# (# doesn't matter)
          <br />
          Pon: p0-2 (# determines who it was from)
          <br />
          Kan: p0-7 (# determines who it was from). 0-3 Daiminkan, 4-6 Shouminkan, 7 Ankan
          <br />
          Tsumo: t# (# doesn't matter)
          <br />
          Ron: r# (# doesn't matter)
          <br />
          Riichi: R# (# doesn't matter) Put it at the end of the closed hand
          <br />
          Kita: K1-4 (# kita count)
          </p>
      </div>
    </div>
    </>
  );
}

export default App;
