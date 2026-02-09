import Back from "./assets/back.png";

function RightMenu(props) {
    function handleCall(index, val) {
        let calls = ["c", "p", "k", "t", "r", "R", "K"];
        let call = calls[index];
        let token = props.handStr.slice(-2);
        let tokenNum = parseInt(token[1]);
        
        // If we know exactly want to add, add it and reset call menu
        if (val != undefined) {
            props.setHandStr(old => old + call + val);
            props.setCallMenu(0);
            return;
        }
        
        // If there is a special menu for the call, do it
        switch(call) {
            case "p":
                props.setCallMenu(1);
                return;
            case "k":
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
    }

    // Pon Shape Buttons
    let ponBackgrounds = [];
    for (let i = 0; i < 3; i++) {
        ponBackgrounds.push("0% " + (i * 100 / 2) + "%");
    }

    let pons = ponBackgrounds.map((str, i) => <div
        className="ponButtons"
        key={i}
        onClick={() => handleCall(1, i)}
        style={{
            background: "url(assets/pons.png) " + str + " / 100%"
        }}
    ></div>);

    // Kan Shape Buttons
    let kanBackgrounds = [];
    for (let i = 0; i < 5; i++) {
        let y = i * 100 / 4 + "%";
        for (let j = 0; j < 2; j++) {
            kanBackgrounds.push(j * 100 + "% " + y);
        }
    }

    let kans = kanBackgrounds.map((str, i) => <div
        className="kanButtons"
        key={i}
        onClick={() => handleCall(2, i)}
        style={{
            background: "url(assets/kans.png) " + str + " / 200%"
        }}
    ></div>).slice(0, 10);

    switch (props.callMenu) {
        case 1: // Pons
            return (<>
                <div id="callsBackWrapper">
                    <img onClick={() => props.setCallMenu(0)} src={Back} />
                </div>
                <div style={{textAlign: "center"}}>
                    {pons}
                </div>
            </>);
        case 2: // Kans
            return (<>
                <div id="callsBackWrapper">
                    <img onClick={() => props.setCallMenu(0)} src={Back} />
                </div>
                <div style={{textAlign: "center"}}>
                    {kans}
                </div>
            </>);
        default:
            return <p>
                <b>Input field help:</b>
                <br />
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
    }
}

export default RightMenu;