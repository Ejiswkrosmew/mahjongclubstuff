function Buttons(props) {
    function indexToStr(index) {
        let suits = ["m", "p", "s", "z"];
        return index % 10 + suits[Math.floor(index / 10)];
    }

    let tileBackgrounds = [];
    for (let i = 0; i < 7; i++) {
        let y = i * 100 / 5 + "%";
        for (let j = 0; j < 7; j++) {
            tileBackgrounds.push(j * 100 / 6 + "% " + y);
        }
    }
    
    tileBackgrounds = tileBackgrounds.map((str, i) => <div 
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

    console.log(tileBackgrounds);
    return (
        <div id="tileButtons">
            {mans}
            <br />
            {pins}
            <br />
            {sous}
            <br />
            {honors}
            <br />
        </div>
    );
}

export default Buttons