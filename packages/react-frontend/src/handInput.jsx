function HandInput(props) {
    const handStr = props.handStr;

    function handleChange(event) {
        const { value } = event.target;
        props.setHandStr(value);
    }

    return <div id="handInputWrapper">
        <input type="text" value={handStr} onChange={handleChange}></input>
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
}

export default HandInput;