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
    ["backward", "right", "left"], //29
    [], //goal, no moves allowed
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
    { backward: 10, right: 4, left: 2 }, //8
    { forward: 8, backward: 5, left: 11 }, //9
    { forward: 5, backward: 8, right: 11 }, //10
    { left: 14, right: 20 }, //11
    { forward: 20, backward: 14 }, //12
    { forward: 14, backward: 20 }, //13
    { backward: 12, left: 24, right: 17 }, //14
    { forward: 17, backward: 24, right: 12 }, //15
    { forward: 24, backward: 17, left: 12 }, //16
    { forward: 29, backward: 16, left: 21, right: 13 }, //17
    { forward: 13, backward: 21, left: 29, right: 16 }, //18
    { forward: 16, backward: 29, left: 13, right: 21 }, //19
    { forward: 21, backward: 13, left: 16, right: 29 }, //20
    { forward: 26, backward: 18, right: 27 }, //21
    { forward: 18, backward: 26, left: 27 }, //22
    { backward: 27, left: 18, right: 26 }, //23
    { forward: 30, backward: 15, right: 22 }, //24
    { forward: 15, backward: 30, left: 22 }, //25
    { backward: 22, left: 15, right: 30 }, //26
    { forward: 31, backward: 23, right: 19 }, //27
    { forward: 23, backward: 31, left: 19 }, //28
    { backward: 19, right: 31, left: 23 }, //29
    { backward: 25, right: 28 }, //30 
    { backward: 28, left: 25 }, //31 
];
