export const getSubstringInRange = (text, start, end = -1) => {
    if(end == -1) {
        return text.substring(start);
    }
    return text.substring(start, end);
}

export const findDeltaCharPositionInString = (s1, s2) => {
    const shortString = s1.length > s2.length ? s2 : s1;
    const longString = s1.length > s2.length ? s1 : s2;
    var x;
    var y;
    for(var i = 0; i < longString.length; i++) {
        if((shortString.charAt(i) !== longString.charAt(i) || shortString.length < i) && (!x && x !== 0) ) {
            x = i;
        }
        if((shortString.charAt(shortString.length - i - 1 ) !== longString.charAt(longString.length - i - 1) || shortString.length - i - 1 === -1 ) && !y) {
            y = longString.length - i - 1;
        }   
    }
    return {
        start: x,
        end: y,
        delta: longString.substring(x, y + 1)
    }

}