import { useState } from "react";
import Pons from "./assets/pons.png";
import Kans from "./assets/kans.png";
import Kitas from "./assets/kitas.png";
import Back from "./assets/back.png";

function Buttons(props) {
    let { callMenu, setCallMenu } = useState(0);

    function indexToStr(index) {
        let suits = ["m", "p", "s", "z"];
        return index % 10 + suits[Math.floor(index / 10)];
    }

    function handleCall(index) {
        let calls = ["c", "p", "k", "t", "r", "R", "K"];
        let call = calls[index];
        let token = props.handStr.slice(-2);
        let tokenNum = parseInt(token[1]);
        // TODO: Implement
        // switch(str) {
            //     case "p":
            //         setCallMenu(1);
            //         return;
            //     case "k":
            //         setCallMenu(2);
            //         return;
            //     case "K":
            //         setCallMenu(3);
            //         return;
            // }
        if (call == token[0] && !isNaN(tokenNum)) {
            tokenNum = (tokenNum + 1) % 10;
            props.setHandStr(props.handStr.slice(0, -2) + call + tokenNum);
        } else {
            props.setHandStr(old => old + call + "0");
        }
    }

    let tileBackgrounds = [];
    for (let i = 0; i < 6; i++) {
        let y = i * 100 / 5 + "%";
        for (let j = 0; j < 7; j++) {
            tileBackgrounds.push(j * 100 / 6 + "% " + y);
        }
    }
    
    tileBackgrounds = tileBackgrounds.map((str, i) => <div 
        className="tileButtons"
        key={i}
        onClick={() => props.setHandStr(old => old + indexToStr(i))}
        style={{
            background: "url(assets/tiles.png) " + str + " / 700%"
        }}
    ></div>);

    let mans = tileBackgrounds.slice(0, 10);
    let pins = tileBackgrounds.slice(10, 20);
    let sous = tileBackgrounds.slice(20, 30);
    let honors = tileBackgrounds.slice(30, 38);

    let buttonBackgrounds = [];
    for (let i = 0; i < 4; i++) {
        let y = i * 100 / 3 + "%";
        for (let j = 0; j < 2; j++) {
            buttonBackgrounds.push(j * 100 + "% " + y);
        }
    }

    buttonBackgrounds = buttonBackgrounds.map((str, i) => <div 
        className="callButtons"
        key={i}
        onClick={() => handleCall(i)}
        style={{
            background: "url(assets/buttons.png) " + str + " / 200%"
        }}
    ></div>);

    let buttons = buttonBackgrounds.slice(0, 7);

    return (
        <div id="handButtons">
            {mans}
            <br />
            {pins}
            <br />
            {sous}
            <br />
            {honors}
            <br />
            <div id="callsWrapper">
                <div id="callsBackWrapper">
                    <img src={Back}/>
                </div>
                {buttons}
            </div>
        </div>
    );
}

export default Buttons