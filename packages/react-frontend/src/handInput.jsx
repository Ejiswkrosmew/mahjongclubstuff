function HandInput(props) {
    const handStr = props.handStr;

    function handleChange(event) {
        const { value } = event.target;

        // Translate old input into new input
        let newHand = "";
        let queueSuit = false;
        let swapAlpha = false;
        for (let i = 0; i < value.length; i++) {
            const isNum = !isNaN(parseInt(value[i]));

            // If we need to swap character to alphabet, do it
            if (swapAlpha) {
                if (!isNum) {
                    newHand += value[i];
                    continue;
                }
                newHand += String.fromCharCode("a".charCodeAt() + parseInt(value[i]));
                continue;
            }

            // Otherwise, we're adding the character regardless
            newHand += value[i];

            // If it's a number, the next letter is a suit
            if (isNum) {
                queueSuit = true;
                continue;
            }
         
            // If it's not a number but it's a suit, the next character is no longer a suit
            if (queueSuit) {
                queueSuit = false;
                continue;
            }

            // If it's not a suit, it must be a call so swap next character to alphabet
            swapAlpha = true;
        }

        props.setHandStr(newHand);
    }

    return <input type="text" value={handStr} onChange={handleChange}></input>
}

export default HandInput;