import { useState } from "react";
import Back from "./assets/back.png";

function Buttons(props) {
    const [ callMenu, setCallMenu ] = useState(0);

    function handleCall(index) {
        const calls = ["c", "p", "k", "t", "r", "R", "K"];
        const call = calls[index];
        const token = props.handStr.slice(-2);
        let tokenNum = parseInt(token[1]);
        
        // If there is a special menu for the call, do it
        switch(call) {
            case "p":
                setCallMenu(1);
                props.setCallMenu(1);
                return;
            case "k":
                setCallMenu(2);
                props.setCallMenu(2);
                return;
        }

        // Default to adding the call/adding 1 to the call on future presses
        if (call == token[0] && !isNaN(tokenNum)) {
            tokenNum = (tokenNum + 1) % 10;
            props.setHandStr(props.handStr.slice(0, -2) + call + tokenNum);
        } else {
            props.setHandStr(old => old + call + "0");
        }

        // Reset call menu
        props.setCallMenu(0);
    }

    function addTile(index) {
        const suit = ["m", "p", "s", "z"][Math.floor(index / 10)];
        const val = index % 10;
        const token = props.handStr.slice(-2);
        if (!isNaN(parseInt(token[0])) && token[1] == suit) {
            props.setHandStr(props.handStr.slice(0, -1) + val + suit);
        } else {
            props.setHandStr(old => old + val + suit);
        }
    }

    // Tile buttons
    let tileBackgrounds = [];
    for (let i = 0; i < 6; i++) {
        let y = i * 100 / 5 + "%";
        for (let j = 0; j < 7; j++) {
            tileBackgrounds.push(j * 100 / 6 + "% " + y);
        }
    }
    
    // Turning them into divs
    tileBackgrounds = tileBackgrounds.map((str, i) => <div 
        className="tileButtons"
        key={i}
        onClick={() => addTile(i)}
        style={{
            background: "url(assets/tiles.png) " + str + " / 700%"
        }}
    ></div>);

    // Split the suits up
    let mans = tileBackgrounds.slice(0, 10);
    let pins = tileBackgrounds.slice(10, 20);
    let sous = tileBackgrounds.slice(20, 30);
    let honors = tileBackgrounds.slice(30, 38);

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
                <CallButtons callMenu={callMenu} setCallMenu={setCallMenu} handleCall={handleCall} />
            </div>
        </div>
    );
}

function CallButtons(props) {
    // Call buttons
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
        onClick={() => props.handleCall(i)}
        style={{
            background: "url(assets/buttons.png) " + str + " / 200%"
        }}
    ></div>);

    let buttons = buttonBackgrounds.slice(0, 7);

    switch(props.callMenu) {
        default:
            return (<>
                {buttons}
            </>);
    }
}

export default Buttons;