import { useState, useEffect } from 'react';
import HandInput from "./handInput.jsx";
import Buttons from "./buttons.jsx";
import RightMenu from './rightMenu.jsx';
import { strToHand } from "./handFuncs.jsx";
import useScript from "./hooks/useScript.jsx";
import './style.css';

function App() {
    const [handStr, setHandStr] = useState("");
    const [callMenu, setCallMenu] = useState(0);

    function handleKeyDown(event) {
        // Don't do anything if the user is trying to type
        if (event.target.tagName.toUpperCase() == "INPUT") {
            return;
        }

        const key = event.key;
        switch (key) {
            case "Backspace":
                // Remove tiles/calls with backspace (All with shift key)
                if (event.shiftKey) {
                    setHandStr("");
                } else {
                    setHandStr(old => old.slice(0, -2));
                }
        }
    }

    useScript("./setUpv2.js");
    useScript("./hand.js");

    useEffect(() => {
        // Add keydown listener
        document.addEventListener('keydown', handleKeyDown);

        // If for some reason this get's unmounted, remove the event
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    useEffect(() => {
        const main = window.main;

        if (!main) {
            return;
        }

        const newHand = strToHand(handStr);
        if (newHand != undefined) {
            main.hand = newHand;
            main.render();
        }
    }, [handStr]);

    function toggleLabels(event) {
        const checked = event.currentTarget.checked;
        const main = window.main;
        main.labels = checked;
        main.render();
    }

    return (
        <>
            <div id="canvasWrapper">
                <canvas id="canvas" />
            </div>
            <div id="canvasSpacer"></div>
            <div id="inputWrapper">
                <div id="mainInput">
                    <HandInput handStr={handStr} setHandStr={setHandStr} />
                    <Buttons handStr={handStr} setHandStr={setHandStr} setCallMenu={setCallMenu} />
                </div>
                <div id="rightDiv">
                    <b>Show Labels: </b><input id="labelCheckbox" type="checkbox" onChange={toggleLabels}></input>
                    <RightMenu callMenu={callMenu} setCallMenu={setCallMenu} handStr={handStr} setHandStr={setHandStr} />
                </div>
            </div>
        </>
    );
}

export default App;
