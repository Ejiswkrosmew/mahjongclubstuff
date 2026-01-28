import { useState, useEffect } from 'react';
import HandInput from "./handInput.jsx";
import Buttons from "./buttons.jsx";
import useScript from "./hooks/useScript.jsx";
import './style.css';

function App() {
    const [handStr, setHandStr] = useState("");

    function handleKeyDown(event) {
        console.log(event.target);
        if (event.target.tagName.toUpperCase() == "INPUT") {
            return;
        }

        const key = event.key;
        switch (key) {
            case "Backspace":
                if (event.shiftKey) {
                    setHandStr("");
                } else {
                    setHandStr(old => old.slice(0, -2));
                }
        }
    }

    function handleCanvasClick() {
        console.log("foo");
        setHandStr(window.main.hand.join(""));
    }

    useScript("./setUpv2.js");
    useScript("./hand.js");

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    useEffect(() => {
        const main = window.main;
        if (!main) {
            return;
        }

        let newHand = [];
        for (let i = 0; i + 1 < handStr.length; i += 2) {
            let token = handStr.slice(i, i + 2);
            if (!isNaN(parseInt(token[0])) == !isNaN(parseInt(token[1]))) {
                return;
            }
            newHand.push(handStr.slice(i, i + 2));
        }

        main.hand = newHand;
        main.render();
    }, [handStr]);

    return (
        <>
            <div id="canvasWrapper">
                <canvas id="canvas" onClick={handleCanvasClick} height="1000" style={{ height: "250px" }}></canvas>
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
