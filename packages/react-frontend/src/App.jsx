import { useState, useEffect } from 'react';
import HandInput from "./handInput.jsx";
import Buttons from "./buttons.jsx";
import useScript from "./hooks/useScript.jsx";
import './style.css';

function strToHand(str) {
    let hand = [];
    let storedNums = [];

    for (let i = 0; i < str.length; i++) {
        const curr = str[i];
        const currNum = parseInt(curr);

        // If it's a number, it goes into the numbers array
        if (!isNaN(currNum)) {
            storedNums.push(curr);
            continue;
        }
        // Otherwise it's a character

        // If there are stored numbers, it's a suit
        if (storedNums.length > 0) {
            for (let j = 0; j < storedNums.length; j++) {
                hand.push(storedNums[j] + curr);
            }
            storedNums = [];
            continue;
        }

        // Otherwise it's a call
        i++;
        // If not enough characters, return invalid hand
        if (i >= str.length) {
            return undefined;
        }
        hand.push(curr + str[i]);
        continue;
    }

    // Invalid hand if there were unused numbers
    if (storedNums.length > 0) {
        return undefined;
    }

    return hand;
}

function App() {
    const [handStr, setHandStr] = useState("");

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
            main.hand= newHand;
            main.render();
        }
    }, [handStr]);

    return (
        <>
            <div id="canvasWrapper">
                <canvas id="canvas" />
            </div>
            <div id="inputWrapper">
                <div id="mainInput">
                    <HandInput handStr={handStr} setHandStr={setHandStr} />
                    <Buttons handStr={handStr} setHandStr={setHandStr} />
                </div>
                <div id="helpText">
                    <p>
                        Backspace (outside of input box) removes the last tile/call. Shift + Backspace resets hand.
                        <br />
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
