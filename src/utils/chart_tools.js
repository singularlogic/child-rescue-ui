export function getColor(ccp) {
    ccp = parseFloat(ccp);
    if (ccp < 0.7) {
        return '#33ff33';
    }
    if (ccp >= 0.7 && ccp < 0.725) {
        return '#1aff1a';
    }
    if (ccp >= 0.725 && ccp < 0.75) {
        return '#00ff00';
    }
    if (ccp >= 0.75 && ccp < 0.775) {
        return '#00e600';
    }
    if (ccp >= 0.775 && ccp < 0.8) {
        return '#00cc00';
    }
    if (ccp >= 0.8 && ccp < 0.825) {
        return '#00b300';
    }
    if (ccp >= 0.825 && ccp < 0.85) {
        return '#009900';
    }
    if (ccp >= 0.85 && ccp < 0.875) {
        return '#008000';
    }
    if (ccp >= 0.875 && ccp < 0.9) {
        return '#006600';
    }
    if (ccp >= 0.9 && ccp < 0.925) {
        return '#004d00';
    }
    if (ccp >= 0.925 && ccp < 0.95) {
        return '#003300';
    }
    if (ccp >= 0.95 && ccp < 0.975) {
        return '#001a00';
    }
    if (ccp >= 0.975 && ccp < 1) {
        return '#000000';
    }
    if (ccp >= 1 && ccp < 1.025) {
        return '#1a0000';
    }
    if (ccp >= 1.025 && ccp < 1.05) {
        return '#330000';
    }
    if (ccp >= 1.05 && ccp < 1.075) {
        return '#4d0000';
    }
    if (ccp >= 1.075 && ccp < 1.1) {
        return '#660000';
    }
    if (ccp >= 1.1 && ccp < 1.125) {
        return '#800000';
    }
    if (ccp >= 1.125 && ccp < 1.15) {
        return '#990000';
    }
    if (ccp >= 1.15 && ccp < 1.175) {
        return '#b30000';
    }
    if (ccp >= 1.175 && ccp < 1.2) {
        return '#cc0000';
    }
    if (ccp >= 1.2 && ccp < 1.225) {
        return '#e60000';
    }
    if (ccp >= 1.225 && ccp < 1.25) {
        return '#ff0000';
    }
    if (ccp >= 1.25 && ccp < 1.275) {
        return '#ff1a1a';
    }
    if (ccp >= 1.275) {
        return '#ff3333';
    }
    return '#FFFFFF';
}
