const arrows={
    N:"\u{21e9}",
    NE:"\u{2b0b}",
    E:"\u{21e6}",
    SE:"\u{2b09}",
    S:"\u{21e7}",
    SW:"\u{2b08}",
    W:"\u{21e8}",
    //W:"\u{2799}",
    NW:"\u{2b0a}",

}

const arrows2={
    N:"\u{2193}",
    NE:"\u{2199}",
    E:"\u{2190}",
    SE:"\u{2196}",
    S:"\u{2191}",
    SW:"\u{2b08}",
    W:"\u{2192}",
    //W:"\u{2799}",
    NW:"\u{2198}",

}

const arrows3={
    N:"\u{21d3}",
    NE:"\u{21d9}",
    E:"\u{21d0}",
    SE:"\u{21d6}",
    S:"\u{21d1}",
    SW:"\u{21d7}",
    W:"\u{21d2}",
    //W:"\u{2799}",
    NW:"\u{21d8}",

}

const arrows4={
    N:"\u{2b07}",
    NE:"\u{2b0b}",
    E:"\u{2b05}",
    SE:"\u{2b09}",
    S:"\u{2b06}",
    SW:"\u{2b08}",
    W:"\u{21d2}",
    NW:"\u{2b0a}",

}


const arrowFromDirection = (value)=>{
    const SET=3
    const setArrows=(SET==1)?arrows:(SET==2)?arrows2:(SET==3)?arrows3:arrows4
    if(value<22.5){return arrows["N"]}
    else if(value<77.5){return setArrows["NE"]}
    else if(value<112.5){return setArrows["E"]}
    else if(value<157.5){return setArrows["SE"]}
    else if(value<202.5){return setArrows["S"]}
    else if(value<247.5){return setArrows["SW"]}
    else if(value<292.5){return setArrows["W"]}
    else if(value<337.5){return setArrows["NW"]}
    else {return arrows["N"]}

}
const sectorFromDirection = (value)=>{
    if(value<22.5){return "N"}
    else if(value<77.5){return "NE"}
    else if(value<112.5){return "E"}
    else if(value<157.5){return "SE"}
    else if(value<202.5){return "S"}
    else if(value<247.5){return "SW"}
    else if(value<292.5){return "W"}
    else if(value<337.5){return "NW"}
    else {return "N"}

}
//console.log(arrows)
export {arrowFromDirection,sectorFromDirection}
