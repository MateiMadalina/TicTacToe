let gameTurn = 0;
let currentPlayer;
let board;

function empty(board){
let emptySpace = [];
for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === "") {
            emptySpace.push([i, j])
        }
    }
}
//console.log(emptySpace)
return emptySpace

}


// this function will be called whenever the user changes
// the `select` input labeled `please select game mode`
function setGameMode(selectedValue) {
    switch (selectedValue) {
        case 'human-human':
            isPlayerXHuman = true;
            isPlayerYHuman = true;
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
        case 'ai-ai':
            isPlayerXHuman = false;
            isPlayerYHuman = false;
            setHTMLvisibilityForInputGameMode(false);
            setHTMLvisibilityForInputHumanCoordinates(false);
            setHTMLvisibilityForInputAiCoordinatesInput(true);
            setHTMLvisibilityForButtonLabeledReset(true);
            
            break;

    }
    resetBoard();

    // setHTMLvisibilityForInputGameMode(false);
    // setHTMLvisibilityForInputHumanCoordinates(true);
    // setHTMLvisibilityForInputAiCoordinatesInput(false);
    // setHTMLvisibilityForButtonLabeledReset(true);
    displayMessage("Player X's turn");
}

// this function is called whenever the user presses the `enter`
// key in the input box labeled `enter coordinates`
// paramerter: input - the content of the input box
function processHumanCoordinate(input) {
    console.log(`'processHumanCoordinate('${input}')`);
    if (gameTurn % 2 === 0) {
        currentPlayer = 'X';
        displayMessage("Is Player 0's turn")

    } else {
        currentPlayer = '0';
        displayMessage("Is Player X's turn")
    }

    let coordinates = extractCoordinates(input);
    if (board[coordinates.x][coordinates.y] === ""){
        board[coordinates.x][coordinates.y] = currentPlayer;
        gameTurn += 1;
        if (isPlayerYHuman === false) {
            setHTMLvisibilityForInputHumanCoordinates(false);
            setHTMLvisibilityForInputAiCoordinatesInput(true);
        }
    } else{
        displayMessage("Position is already taken on board")
        console.log("Position taken")


    }
    
    let go = empty(board);

    if (go.length === 0){
        displayMessage("It's a tie");
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
 
    const winningPlayer = getWinningPlayer(board);
    if (winningPlayer) {
        displayMessage(`Player ${currentPlayer} has won !`);
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
    displayBoard(board);
    
    // TODO: add a message stating either
    // Player X's turn
    // Player O's turn
    // It's a tie
    // Player X won 
    // Player O won 

    // TODO: add conditions to hide the coordinates screen for 
    // the human player & show for the button to generate AI 
    // coordinates
}



// this function is called whenever the user presses
// the button labeled `Generate AI coordinates`
function processAICoordinate() {
    if (gameTurn % 2 === 0) {
        currentPlayer = 'X';
        displayMessage("Is Player 0's turn")

    } else {
        currentPlayer = '0';
        displayMessage("Is Player X's turn")
    }
//prioritizezi daca poate sa castige(cauti in matrice si cauat daca 
    //pe o linie sau coloana gaseste 2 de y..)


let go = empty(board);
if (go.length === 0){
    displayMessage("It's a tie");
    setHTMLvisibilityForInputGameMode(false);
    setHTMLvisibilityForInputHumanCoordinates(false);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
    setHTMLvisibilityForButtonLabeledReset(true);
}
let secondPlayer = 'X';
if(currentPlayer === 'X'){
    secondPlayer = '0'
}else{
    secondPlayer = 'X'
}
console.log(secondPlayer);

let easyLose = getUnbeatableAiCoordinates(board, secondPlayer);
console.log(easyLose);
if(easyLose){
    board[easyLose[0]][easyLose[1]] = currentPlayer;
    gameTurn += 1;
    displayBoard(board);
}else{
let easyWin = getUnbeatableAiCoordinates(board, currentPlayer);
console.log(easyWin)
if(easyWin){
    board[easyWin[0]][easyWin[1]] = currentPlayer;
    gameTurn += 1;
    displayBoard(board);
}else{
    if(board[1][1] === ''){
       board[1][1] = currentPlayer; 
       gameTurn += 1;
       displayBoard(board);
    }else 
    {
        let corner = [[0, 0], [0, 2], [2, 0], [2, 2]]
        let freeCorner = [];
       
        for(let i = 0; i< corner.length ; i++){
        if(board[corner[i][0]][corner[i][1]] === ''){
        freeCorner.push(corner[i]);
        }}
        let freeCornerRand = freeCorner[Math.floor(Math.random() * freeCorner.length)]
        console.log(freeCorner);
       // if(board[cornerRand[0]][cornerRand[1]] === ''){
        if(freeCorner.length !== 0){
        board[freeCornerRand[0]][freeCornerRand[1]] = currentPlayer;
        gameTurn += 1;
        displayBoard(board);
        }
        else{
            let randomAiMove = go[Math.floor(Math.random() * go.length)]
            board[randomAiMove[0]][randomAiMove[1]] = currentPlayer;
            gameTurn += 1;
            displayBoard(board);
        }
    }
  
}
}
    if (isPlayerXHuman === true) {
        setHTMLvisibilityForInputHumanCoordinates(true);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
    }
    const winningPlayer = getWinningPlayer(board);
    if (winningPlayer) {
        displayMessage(`Player ${currentPlayer} has won !`);
        setHTMLvisibilityForInputGameMode(false);
        setHTMLvisibilityForInputHumanCoordinates(false);
        setHTMLvisibilityForInputAiCoordinatesInput(false);
        setHTMLvisibilityForButtonLabeledReset(true);
    }
  

    //console.log(`processAICoordinate()`);
}



// this function is called when the user clicks on 
// the button labeled `Restart Game`
function resetGame() {
    location.reload()
    gameTurn = 0;
}

// this function should change from A1..C3 to coordinates
// that are present in the `board` global variable
function extractCoordinates(input) {
    // this is a sample of what should be returned if the
    // the user had typed `A1`
    // you need to add the to also treat other cases (A2..C3)

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
let cases = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]

    if (!cases.includes(input)){
       displayMessage("Invalid coordinate entered")  

    } 

}

// this function should return `X` or `O` or undefined (carefull it's not a string )
// based on interpreting the values in the board variable
function getWinningPlayer(board) {
   if(board[0][0] === board[0][1] && board[0][0] === board[0][2] && board[0][0] !== '') {return board[0][0]}
   if(board[1][0] === board[1][1] && board[1][0] === board[1][2] && board[1][0] !== '') {return board[1][0]}
   if(board[2][0] === board[2][1] && board[2][0] === board[2][2] && board[2][0] !== '') {return board[2][0]}
   if(board[0][0] === board[1][0] && board[0][0] === board[2][0] && board[0][0] !== '') {return board[0][0]}
   if(board[0][1] === board[1][1] && board[0][1] === board[2][1] && board[0][1] !== '') {return board[0][1]}
   if(board[0][2] === board[1][2] && board[0][2] === board[2][2] && board[0][2] !== '') {return board[0][2]}
   if(board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== '') {return board[0][0]}
   if(board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] !== '') {return board[0][2]}
}

const getUnbeatableAiCoordinates = (board, player) => { 
//1
if(board[0][0] === board[0][1]  && board[0][2] === '' && board[0][0] === player) {return [0, 2] }
if(board[0][1] === board[0][2]  && board[0][0] === '' && board[0][1] === player) {return [0, 0] }
if(board[0][0] === board[0][2]  && board[0][1] === '' && board[0][0] === player) {return [0, 1] } 

//2
if(board[1][0] === board[1][1]  && board[1][2] === '' && board[1][0] === player) {return [1, 2] }
if(board[1][0] === board[1][2]  && board[1][1] === '' && board[1][0] === player) {return [1, 1] }
if(board[1][1] === board[1][2]  && board[1][0] === '' && board[1][1] === player) {return [1, 0] } 

//3
if(board[2][0] === board[2][1]  && board[2][2] === '' && board[2][0] === player) {return [2, 2] }
if(board[2][0] === board[2][2]  && board[2][1] === '' && board[2][0] === player) {return [2, 1] }
if(board[2][1] === board[2][2]  && board[2][0] === '' && board[2][1] === player) {return [2, 0] } 

//4
if(board[0][0] === board[1][0]  && board[2][0] === '' && board[0][0] === player) {return [2, 0] }
if(board[0][0] === board[2][0]  && board[1][0] === '' && board[2][0] === player) {return [1, 0] }
if(board[1][0] === board[2][0]  && board[0][0] === '' && board[2][0] === player) {return [0, 0] } 

//5
if(board[0][1] === board[1][1]  && board[2][1] === '' && board[0][1] === player) {return [2, 1] }
if(board[0][1] === board[2][1]  && board[1][1] === '' && board[2][1] === player) {return [1, 1] }
if(board[1][1] === board[2][1]  && board[0][1] === '' && board[2][1] === player) {return [0, 1] } 

//6
if(board[0][2] === board[1][2]  && board[2][2] === '' && board[0][2] === player) {return [2, 2] }
if(board[0][2] === board[2][2]  && board[1][2] === '' && board[2][2] === player) {return [1, 2] }
if(board[1][2] === board[2][2]  && board[0][2] === '' && board[2][2] === player) {return [0, 2] } 

//
if(board[0][0] === board[1][1]  && board[2][2] === '' && board[0][0] === player) {return [2, 2] }
if(board[0][0] === board[2][2]  && board[1][1] === '' && board[0][0] === player) {return [1, 1] }
if(board[1][1] === board[2][2]  && board[0][0] === '' && board[2][2] === player) {return [0, 0] } 

//
if(board[0][2] === board[1][1]  && board[2][0] === '' && board[0][2] === player) {return [2, 0] }
if(board[0][2] === board[2][0]  && board[1][1] === '' && board[2][0] === player) {return [1, 1] }
if(board[1][1] === board[2][0]  && board[0][2] === '' && board[1][1] === player) {return [0, 2] } 

}