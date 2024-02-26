let gameTurn = 0;
let currentPlayer;
let board;

//The empty function has a role in checking which available free positions we still have in the game
function empty(board) {
    let emptySpace = [];
    board.forEach((element, index1) => {
        element.forEach((array, index2) => {
            if (array === "") {
                emptySpace.push([index1, index2]);
               
            }
        })
    })
    return emptySpace;
}
//The function that knows that 'X will have moves on even positions and '0' on odd positions
function orderPlayer() {
    if (gameTurn % 2 === 0) {
        currentPlayer = 'X';
        displayMessage("Is Player 0's turn")
    } else {
        currentPlayer = '0';
        displayMessage("Is Player X's turn")
    }
}
// this function will be called whenever the user changes
// the `select` input labeled `please select game mode`
function setGameMode(selectedValue) {
    switch (selectedValue) {
        case 'human-human':
            isPlayerXHuman = true;
            isPlayerYHuman = true;
             //Visibility setting according to the need of each case
            setHTMLvisibilityForInputGameMode(false);
            setHTMLvisibilityForInputHumanCoordinates(true);
            setHTMLvisibilityForInputAiCoordinatesInput(false);
            setHTMLvisibilityForButtonLabeledReset(true);
            break;
        case 'human-ai':
            isPlayerXHuman = true;
            isPlayerYHuman = false;
            setHTMLvisibilityForInputGameMode(false);
            setHTMLvisibilityForInputHumanCoordinates(true);
            setHTMLvisibilityForButtonLabeledReset(true);
            break;
        case 'ai-ai'://Added AI vs AI game option
            isPlayerXHuman = false;
            isPlayerYHuman = false;
            setHTMLvisibilityForInputGameMode(false);
            setHTMLvisibilityForInputHumanCoordinates(false);
            setHTMLvisibilityForInputAiCoordinatesInput(true);
            setHTMLvisibilityForButtonLabeledReset(true);
            break;
    }
    resetBoard();//Resetting the board every time the game type is changed
    displayMessage("Player X's turn");//the game always starts with X so this message will always be displayed at the beginning of the game
}
// this function is called whenever the user presses the `enter`
// key in the input box labeled `enter coordinates`
// paramerter: input - the content of the input box
function processHumanCoordinate(input) {
    console.log(`'processHumanCoordinate('${input}')`);
    orderPlayer();
    //keep the coordinate on which the move was placed, eg: "A1"-> [0,0]
    let coordinates = extractCoordinates(input);
    //If the typed position is empty, then moving the player will be possible, otherwise a warning message will be displayed in the game
    if (board[coordinates.x][coordinates.y] === "") {
        board[coordinates.x][coordinates.y] = currentPlayer;
        gameTurn += 1;
    //If the current player is AI then only the position generation button will be displayed
        if (isPlayerYHuman === false) {
            setHTMLvisibilityForInputHumanCoordinates(false);
            setHTMLvisibilityForInputAiCoordinatesInput(true);
        }
    } else {
        displayMessage("Position is already taken on board")
    }
    //initializing a variable with the empty function in order to know when the table of x and 0 was completely occupied
    let go = empty(board);
    if (go.length === 0) {
        displayMessage("It's a tie");
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
    //initializing the variable with the 'getWinningPlayer' function in order to signal victory when we are in a winning situation
    const winningPlayer = getWinningPlayer(board);
    if (winningPlayer) {
        displayMessage(`Player ${currentPlayer} has won !`);
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
    displayBoard(board);

}
// this function is called whenever the user presses
// the button labeled `Generate AI coordinates`
function processAICoordinate() {
    orderPlayer();
    let go = empty(board);

    //For the 'human-ai' case, in this function currentPlayer will always be '0', and to anticipate the movements of 'X', we created the variable secondPlayer
    let secondPlayer = 'X';
    //For the 'ai-ai' case, there would be a fluctuation of x and 0 for currentPlayer and secondPlayer
    if (currentPlayer === 'X') {
        secondPlayer = '0';
    } else {
        secondPlayer = 'X';
    }
    //console.log(secondPlayer);
    //The function so that 'ai' can see the situations in which he can lose and put the move in such a way as to prevent the loss
    //and also the situation when he can win
    let easyLose = getUnbeatableAiCoordinates(board, secondPlayer);
    let easyWin = getUnbeatableAiCoordinates(board, currentPlayer);
    console.log(easyLose);
    if (easyWin) {
        board[easyWin[0]][easyWin[1]] = currentPlayer;
        gameTurn += 1;
        displayBoard(board);
    } else {
        //If easyWin is not called, then 'ai' enters the loop of easyLose, in which certain moves are set so that he cannot be defeated
        if (easyLose) {
            board[easyLose[0]][easyLose[1]] = currentPlayer;
            gameTurn += 1;
            displayBoard(board);
        //But if he doesn't see a possible lose, he checks several cases where he could win or tie
        } else {
        //First of all, he checks if the position in the middle is empty, and if it is empty, this will be his move    
            if (board[1][1] === '') {
                board[1][1] = currentPlayer;
                gameTurn += 1;
                displayBoard(board);
            } else {
            //Make a check if the middle is already taken by him, and if it is taken and the opponent has the corners of the table taken,
            //then he will generate the movement on a middle position (crosswise)
            if (board[1][1] === currentPlayer) {
                if ((board[0][0] === board[2][2] && board[0][0] !== '') || (board[0][2] === board[2][0] && board[0][2] !== '')) {
                    let middle = [[0, 1], [1, 0], [1, 2], [2, 1]];
                    let freeMiddle = [];
                    for (let i = 0; i < middle.length; i++) {
                        if (board[middle[i][0]][middle[i][1]] === '') {
                            freeMiddle.push(middle[i]);
                        }
                    }
                    let freeMiddleRand = freeMiddle[Math.floor(Math.random() * freeMiddle.length)]
                    if (freeMiddle.length !== 0) {
                        board[freeMiddleRand[0]][freeMiddleRand[1]] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    }
                    } else if( board[0][0] === board[1][2] && board[0][0] !== '' && board[0][2] === '')  {
                        board[0][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                     } else if ( board[0][0] === board[2][1] && board[0][0] !== '' && board[2][0] === '') {
                        board[2][0] = currentPlayer;                                    
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[0][2] === board[1][0] && board[0][2] !== '' && board[0][0] === '') {        
                        board[0][0] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[0][2] === board[2][1] && board[0][2] !== '' && board[2][2] === '') {
                        board[2][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[0][0] === board[1][2] && board[0][0] !== '' && board[0][2] === '') {
                        board[0][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[2][0] === board[0][1] && board[2][0] !== '' && board[0][0] === '') {
                        board[0][0] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[2][0] === board[1][2] && board[2][0] !== '' && board[2][2] === '') {
                        board[2][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[2][2] === board[0][1] && board[2][2] !== '' && board[0][2] === '') {
                        board[0][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[2][2] === board[1][0] && board[2][2] !== '' && board[2][0] === '') {
                        board[2][0] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board); 
                    } else if ( board[0][1] === board[1][0] && board[0][1] !== '' && board[0][0] === '') {
                        board[0][0] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[0][1] === board[1][2] && board[0][1] !== '' && board[0][2] === '') {
                        board[0][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[1][2] === board[2][1] && board[1][2] !== '' && board[2][2] === '') {
                        board[2][2] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    } else if ( board[1][0] === board[2][1] && board[1][0] !== '' && board[2][0] === '') {
                        board[2][0] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    }
            //If the opposite corners are not taken by the opponent, then it will generate a move to any available position
                    else {
                        let randomAiMove = go[Math.floor(Math.random() * go.length)]
                        board[randomAiMove[0]][randomAiMove[1]] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    }
                }
            //If the middle is not taken by him, then it will generate a random movement on any free corner
                else {
                    let corner = [[0, 0], [0, 2], [2, 0], [2, 2]];
                    let freeCorner = [];
                    for (let i = 0; i < corner.length; i++) {
                        if (board[corner[i][0]][corner[i][1]] === '') {
                            freeCorner.push(corner[i]);
                        }
                    }
                    let freeCornerRand = freeCorner[Math.floor(Math.random() * freeCorner.length)]
                    //console.log(freeCorner);
                    if (freeCorner.length !== 0) {
                        board[freeCornerRand[0]][freeCornerRand[1]] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    }
        //If the corners are exhausted, movement will be randomly generated on any other free position
                    else {
                        let randomAiMove = go[Math.floor(Math.random() * go.length)]
                        board[randomAiMove[0]][randomAiMove[1]] = currentPlayer;
                        gameTurn += 1;
                        displayBoard(board);
                    }
                }
            }
        }
    }
    let tie = empty(board);
    if (tie.length === 0) {
        displayMessage("It's a tie");
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
    if (isPlayerXHuman === true) {
        setHTMLvisibilityForInputHumanCoordinates(true);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
    }
    //Calling the function for signaling the victory and displaying it 
    const winningPlayer = getWinningPlayer(board);
    if (winningPlayer) {
        displayMessage(`Player ${currentPlayer} has won !`);
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
   
}
// this function is called when the user clicks on 
// the button labeled `Restart Game`
function resetGame() {
    location.reload()
}

// this function should change from A1..C3 to coordinates
// that are present in the `board` global variable
function extractCoordinates(input) {
    // this is a sample of what should be returned if the
    // the user had typed `A1`
    // you need to add the to also treat other cases (A2..C3)
    document.querySelector('.coordinates > input').value = "";
    switch (input) {
        case "A1": return { x: 0, y: 0 };
        case "A2": return { x: 0, y: 1 };
        case "A3": return { x: 0, y: 2 };
        case "B1": return { x: 1, y: 0 };
        case "B2": return { x: 1, y: 1 };
        case "B3": return { x: 1, y: 2 };
        case "C1": return { x: 2, y: 0 };
        case "C2": return { x: 2, y: 1 };
        case "C3": return { x: 2, y: 2 };
    }
    //document.querySelector('.coordinates > input').value = "";
let cases = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
//If a non-existing coordinate is entered in the game, a message will be displayed
    if (!cases.includes(input)){
       displayMessage("Invalid coordinate entered")  

    } 

}
// this function should return `X` or `O` or undefined (carefull it's not a string )
// based on interpreting the values in the board variable

//The cases by which the players can win 
function getWinningPlayer(board) {
    if (board[0][0] === board[0][1] && board[0][0] === board[0][2] && board[0][0] !== '') { return board[0][0] }
    if (board[1][0] === board[1][1] && board[1][0] === board[1][2] && board[1][0] !== '') { return board[1][0] }
    if (board[2][0] === board[2][1] && board[2][0] === board[2][2] && board[2][0] !== '') { return board[2][0] }
    if (board[0][0] === board[1][0] && board[0][0] === board[2][0] && board[0][0] !== '') { return board[0][0] }
    if (board[0][1] === board[1][1] && board[0][1] === board[2][1] && board[0][1] !== '') { return board[0][1] }
    if (board[0][2] === board[1][2] && board[0][2] === board[2][2] && board[0][2] !== '') { return board[0][2] }
    if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== '') { return board[0][0] }
    if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] !== '') { return board[0][2] }
}

//Cases in which players can prevent loss
const getUnbeatableAiCoordinates = (board, player) => {
    //1
    if (board[0][0] === board[0][1] && board[0][2] === '' && board[0][0] === player) { return [0, 2] }
    if (board[0][1] === board[0][2] && board[0][0] === '' && board[0][1] === player) { return [0, 0] }
    if (board[0][0] === board[0][2] && board[0][1] === '' && board[0][0] === player) { return [0, 1] }
    //2
    if (board[1][0] === board[1][1] && board[1][2] === '' && board[1][0] === player) { return [1, 2] }
    if (board[1][0] === board[1][2] && board[1][1] === '' && board[1][0] === player) { return [1, 1] }
    if (board[1][1] === board[1][2] && board[1][0] === '' && board[1][1] === player) { return [1, 0] }
    //3
    if (board[2][0] === board[2][1] && board[2][2] === '' && board[2][0] === player) { return [2, 2] }
    if (board[2][0] === board[2][2] && board[2][1] === '' && board[2][0] === player) { return [2, 1] }
    if (board[2][1] === board[2][2] && board[2][0] === '' && board[2][1] === player) { return [2, 0] }
    //4
    if (board[0][0] === board[1][0] && board[2][0] === '' && board[0][0] === player) { return [2, 0] }
    if (board[0][0] === board[2][0] && board[1][0] === '' && board[2][0] === player) { return [1, 0] }
    if (board[1][0] === board[2][0] && board[0][0] === '' && board[2][0] === player) { return [0, 0] }
    //5
    if (board[0][1] === board[1][1] && board[2][1] === '' && board[0][1] === player) { return [2, 1] }
    if (board[0][1] === board[2][1] && board[1][1] === '' && board[2][1] === player) { return [1, 1] }
    if (board[1][1] === board[2][1] && board[0][1] === '' && board[2][1] === player) { return [0, 1] }
    //6
    if (board[0][2] === board[1][2] && board[2][2] === '' && board[0][2] === player) { return [2, 2] }
    if (board[0][2] === board[2][2] && board[1][2] === '' && board[2][2] === player) { return [1, 2] }
    if (board[1][2] === board[2][2] && board[0][2] === '' && board[2][2] === player) { return [0, 2] }
    //7
    if (board[0][0] === board[1][1] && board[2][2] === '' && board[0][0] === player) { return [2, 2] }
    if (board[0][0] === board[2][2] && board[1][1] === '' && board[0][0] === player) { return [1, 1] }
    if (board[1][1] === board[2][2] && board[0][0] === '' && board[2][2] === player) { return [0, 0] }
    //8
    if (board[0][2] === board[1][1] && board[2][0] === '' && board[0][2] === player) { return [2, 0] }
    if (board[0][2] === board[2][0] && board[1][1] === '' && board[2][0] === player) { return [1, 1] }
    if (board[1][1] === board[2][0] && board[0][2] === '' && board[1][1] === player) { return [0, 2] }
}