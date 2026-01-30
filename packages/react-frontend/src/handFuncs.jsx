function handToStr(hand) {
    let str = "";
    let lastSuit = "";

    for (let i = 0; i < hand.length; i++) {
        const tile = hand[i];
        const isCall = isNaN(parseInt(tile[0]));

        // If call, resolve current suit and add call
        if (isCall) {
            str += lastSuit + tile;
            lastSuit = "";
            continue;
        }
        // Otherwise it's a tile

        if (lastSuit == "") {
            lastSuit = tile[1];
        } else if (lastSuit != tile[1]) {
            str += lastSuit;
            lastSuit = tile[1];
        }
        str += tile[0];
    }
    str += lastSuit;

    return str;
}

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

export { handToStr, strToHand };