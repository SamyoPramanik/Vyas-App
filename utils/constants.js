export const actionCards = ["forward", "backward", "left", "right"];
export const powerCards = ["block", "wild", "echo", "copycat", "skip", "ban"];

export const allowedMoves = [
    ["left", "right"], //0
    ["forward", "backward"], //1
    ["forward", "backward"], //2
    ["forward", "left", "backward"], //3
    ["forward", "right", "backward"], //4
    ["backward", "left", "right"], //5
    ["forward", "backward", "left"], //6
    ["forward", "backward", "right"], //7
    ["backward", "right", "left"], //8
    ["forward", "backward", "left"], //9
    ["forward", "backward", "right"], //10
    ["left", "right"], //11
    ["forward", "backward"], //12
    ["forward", "backward"], //13
    ["backward", "left", "right"], //14
    ["forward", "backward", "right"], //15
    ["forward", "backward", "left"], //16
    ["forward", "backward", "left", "right"], //17
    ["forward", "backward", "left", "right"], //18
    ["forward", "backward", "left", "right"], //19
    ["forward", "backward", "left", "right"], //20
    ["forward", "backward", "right"], //21
    ["forward", "backward", "left"], //22
    ["backward", "left", "right"], //23
    ["forward", "backward", "right"], //24
    ["forward", "backward", "left"], //25
    ["backward", "left", "right"], //26
    ["forward", "backward", "right"], //27
    ["forward", "backward", "left"], //28
    ["backward", "forward", "left"], //29
];

export const nextJunction = [
    { left: 3, right: 7 }, //0
    { forward: 7, backward: 3 }, //1
    { forward: 3, backward: 7 }, //2
    { forward: 7, left: 9, backward: 1 }, //3
    { forward: 1, right: 9, backward: 6 }, //4
    { backward: 10, left: 6, right: 1 }, //5
    { forward: 2, backward: 4, left: 10 }, //6
    { forward: 4, backward: 2, right: 10 }, //7
    { backward: null, right: null, left: null }, //8
    { forward: null, backward: null, left: null }, //9
    { forward: null, backward: null, right: null }, //10
    { left: null, right: null }, //11
    { forward: null, backward: null }, //12
    { forward: null, backward: null }, //13
    { backward: null, left: null, right: null }, //14
    { forward: null, backward: null, right: null }, //15
    { forward: null, backward: null, left: null }, //16
    { forward: null, backward: null, left: null, right: null }, //17
    { forward: null, backward: null, left: null, right: null }, //18
    { forward: null, backward: null, left: null, right: null }, //19
    { forward: null, backward: null, left: null, right: null }, //20
    { forward: null, backward: null, right: null }, //21
    { forward: null, backward: null, left: null }, //22
    { backward: null, left: null, right: null }, //23
    { forward: null, backward: null, right: null }, //24
    { forward: null, backward: null, left: null }, //25
    { backward: null, left: null, right: null }, //26
    { forward: null, backward: null, right: null }, //27
    { forward: null, backward: null, left: null }, //28
    { backward: null, forward: null, left: null }, //29
];
