function HandInput(props) {
    const handStr = props.handStr;

    function handleChange(event) {
        const { value } = event.target;
        props.setHandStr(value);
    }

    return <input type="text" value={handStr} onChange={handleChange}></input>
}

export default HandInput;