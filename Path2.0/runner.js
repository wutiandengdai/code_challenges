const directions = {
    UP: 'UP',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN'
}

const colValues = {
    WALL: 't',
    OPEN: 'f',
    PATH: 'fp',
    DEADEND: 'fx'
}

//start and exit
var startRow = 0;
var startCol = 0;
var exitRow = 3;
var exitCol = 0;

//solve function for challege 1- default challenge
function solve(){
    var grid = cGrid;
    var curRow = 0;
    var curCol = 0;
    var prevRow = 0;
    var prevCol = 0;
    var stepCount = 0;
    var exitReached = false;
    var noexit = false;
    var minDistance = -1;
    var nextDirection;
    var moveUp = {};
    var moveLeft = {};
    var moveRight = {};
    var moveDown = {};
    

    //Mark the start on UI
    grid[startRow][startCol] = colValues.PATH;
    var elementID = `${startRow}:${startCol}`;
    document.getElementById(elementID).setAttribute("blockValue", "step");

    //solve
    do{
        let nextStep = [];
        let prevRow = curRow;
        let prevCol = curCol;

        moveUp = move(curRow, curCol, grid, directions.UP);
        if (moveUp.canMove){
            nextStep.push(moveUp);
        }
        moveDown = move(curRow, curCol, grid, directions.DOWN);
        if (moveDown.canMove){
            nextStep.push(moveDown);
        }
        moveLeft = move(curRow, curCol, grid, directions.LEFT);
        if (moveLeft.canMove){
            nextStep.push(moveLeft);
        }
        moveRight = move(curRow, curCol, grid, directions.RIGHT);
        if (moveRight.canMove){
            nextStep.push(moveRight);
        }

        //If no direction walkable, exit
        if(nextStep.length == 0){
            noExit = true;
            break;
        }

        //sort distance and take the shortest direction
        nextStep.sort((a, b) => (a.minDistance - b.minDistance));
        //Update current position
        switch(nextStep[0].direction){
            case directions.UP:
                stepCount ++;
                curRow += 1;
                break;
            case directions.DOWN:
                stepCount ++;
                curRow -= 1;
                break;
            case directions.LEFT:
                stepCount ++;
                curCol -= 1;
                break;
            case directions.RIGHT:
                stepCount ++;
                curCol += 1;
                break;
        }
        //mark element
        exitReached = markElements(curRow, curCol, prevRow, prevCol, grid);

    } while(exitReached == false || noExit == true);

    if(exitReached == true){
        document.getElementById("results").innerHTML = `Success! It took ${stepCount} step(s)`;
    }else {
        document.getElementById("results").innerHTML = "Cannot find an exit!"
    }
}


//Solve challenge 2.0 - grid 3,4,5
function runnerSolve(){

} 


//move action
function move(curRow, curCol, grid, direction){
    var targetRow = curRow;
    var targetCol = curCol;
    var targetVal = "";
    var canMove = false;
    var minDistance = -1;

    //move
    switch (direction){
        case directions.UP:
            targetRow += 1;
            break;
        case directions.LEFT:
            targetCol -= 1;
            break;
        case directions.RIGHT:
            targetCol += 1;
            break;
        case directions.DOWN:
            targetRow -= 1;
            break;
    }

    //Check bounds
    if (targetRow > grid.length -1 || targetRow < 0 || targetCol > grid[targetRow].length || targetCol < 0){
        return {
            canMove : false,
            minDistance :-1,
            direction : direction,
            colValue: colValues.WALL
        };
    }

    //Get the value of the square
    targetVal = grid[targetRow][targetCol];

    //Check if current position is start
    if (targetRow == startRow && targetCol == startCol){
        return {
            canMove : false,
            minDistance : -1,
            direction: direction,
            colValue : colValues.WALL
        };
    
    //cannot move to wall or deadend
    } else if (targetVal == colValues.WALL || targetVal == colValues.DEADEND){
        return {
            canMove : false,
            minDistance : -1,
            direction: direction,
            colValue : targetVal
        };

    // can move if path
    } else if (targetVal == colValues.PATH || targetVal == colValues.OPEN){
        return {
            canMove : true,
            minDistance : getMinDistance(targetRow, targetCol),
            direction: direction,
            colValue: targetVal
        };
    }

    return {
        canMove: false,
        minDistance: -1,
        direction: direction,
        colValue: colValues.WALL
    };

}

//Get the minDistance
function getMinDistance (targetRow, targetCol){
    return Math.abs(exitRow-targetRow) + Math.abs(exitCol-targetCol);
}


// if the target has been visted before, mark as deadend
function markElements(targetRow, targetCol, prevRow, prevCol, grid){

    var elementID = "";
    if (grid[targetRow][targetCol] == colValues.PATH){
        grid[prevRow][prevCol] = colValues.DEADEND;
        elementID = `${prevRow}:${prevCol}`;
        document.getElementById(elementID).setAttribute("blockValue", "deadend");
    }

    elementID = `${targetRow}:${targetCol}`;
    document.getElementById(elementID).setAttribute("blockValue", "step");
    grid[targetRow][targetCol] = colValues.PATH;

    //test exit
    if (targetRow == exitRow && targetCol == exitCol){
        return true;
    } else {
        return false;
    }
}