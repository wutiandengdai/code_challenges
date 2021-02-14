const directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
}

const colValues = {
    WALL: 't',
    OPEN: 'f',
    PATH: 'fp',
    DEADEND: 'fx'
}

//start and exit
var noEntry = false;
var exitReached = false;
var noExit = false;
var startRow = 0;
var startCol = 0;
var exitCol = 0;
var exitRow = 0;
var stepCount = 0;


//solve function for challege 1- default challenge
//Find the shortest path from start to exit of the grid.
function solve(){
    var grid = cGrid;
    var point = {
        row: 0,
        col: 0
    };
    stepCount = 0;  //resetStep
    exitRow = grid.length-1;
    var minDistance = -1;

    //2. Walk through grid, loop each step
    do{
        let nextSteps = [];
        let step = {};

        for( var direct in directions){
            step = movable(point, grid, direct);
            if(step.canMove){
                step.direction = direct;
                nextSteps.push(step);
            }
        }
        
        //If no direction walkable, exit
        if(nextSteps.length == 0){
            noExit = true;
            break;
        }

        //3. sort distance and take the shortest direction
        nextSteps.sort((a, b) => (a.minDistance - b.minDistance));

        //mark current step and make the move
        point = markElement(point, grid, nextSteps);

        //5. test exit condition
        if (point.row == exitRow && point.col == exitCol){
            exitReached = true;
            grid[exitRow][exitCol] = colValues.PATH;
            document.getElementById(`${exitRow}:${exitCol}`).setAttribute("blockValue", "step");
            stepCount ++;
            break;
        }
    } while(true);

    writeResults();
}


//Solve challenge 2.0 - grid 3,4,5
//Maximum one path available, no start and exit point
//No distance sort, start col and exit col won't be used.
function solvePath(){
    var grid = cGrid;
    stepCount = 0;  //resetStep
    startRow = 0;
    exitRow = grid.length-1;
    var point = {
        row: 0,
        col: 0
    };

    //1. Loop start row , find the start col and mark
    let startCol = point.col;
    for ( ;startCol < grid[startRow].length; startCol++){
        noEntry = true;
        if (grid[startRow][startCol] == colValues.OPEN){
            point.row = startRow;
            point.col = startCol;
            noEntry = false;
            break;
        }
    }
    if(noEntry){
        writeResults();
        return;
    }
    
    //2. loop and find open path and mark as walked
    do {
        let step = {};
        for( var direct in directions){
            step = movable(point, grid, direct);
            if(step.canMove && step.colValue == colValues.OPEN){
                //mark current step as walked , move and add step count
                grid[point.row][point.col] = colValues.PATH;
                document.getElementById(`${point.row}:${point.col}`).setAttribute("blockValue", "step");
                point = getNextPoint(point, direct);
                stepCount ++;
                break;
            }
        }
        //3. Test exit condition
        if ( point.row == exitRow){
            exitReached = true;
            grid[point.row][point.col] = colValues.PATH;
            document.getElementById(`${point.row}:${point.col}`).setAttribute("blockValue", "step");
            break;
        }
    } while(true);

    writeResults();
} 


//Test if movable
function movable(point, grid, direction){
    var canMove = false;
    var minDistance = -1;

    //get target point
    var tPoint = getNextPoint(point, direction);

    //Check bounds
    if (tPoint.row > grid.length -1 || tPoint.row < 0 || tPoint.col > grid[point.row].length || tPoint.col < 0){
        return {
            canMove : false,
            minDistance :-1,
            colValue : colValues.DEADEND
        };
    }

    //Get the value of the square
    var type = grid[tPoint.row][tPoint.col];
    switch(type){
        case colValues.OPEN:
        case colValues.PATH:
        case colValues.BRANCH:
            canMove = true;
            minDistance = getMinDistance(tPoint);
            break;
    }
    return {
                canMove: canMove,
                minDistance: minDistance,
                colValue : type
            };
}


// if the target has been visted before, mark previous brick as deadend and update grid
// else mark as passed (step) and update grid
function markElement(point, grid, nextSteps){
    var curRow = point.row;
    var curCol = point.col;
    var elementID = `${curRow}:${curCol}`;
    var nextStep = nextSteps[0];

    //If there is only one path, mark current brick as deadend, move to the next step 
    if (nextSteps.length == 1){
        grid[curRow][curCol] = colValues.DEADEND;
        document.getElementById(elementID).setAttribute("blockValue", "deadend");
        stepCount ++;

    //If there is only one shortest path, mark current as stepped and move to the next step
    } else if (nextStep.minDistance < nextSteps[1].minDistance){
        grid[curRow][curCol] = colValues.PATH;
        document.getElementById(elementID).setAttribute("blockValue", "step");
        stepCount ++;
    //if there is more than one shortest path, mark current as branch 
    //and move to the next unstepped step
    } else{
        grid[curRow][curCol] = colValues.PATH
        document.getElementById(elementID).setAttribute("blockValue", "step");
         //If path walked, take another one
        var curMinDis = getMinDistance(point);
        //if nextStep is closer, take the untaken path;
        //if nextStep is father, take the step taken
        if (curMinDis > nextStep.minDistance){
            if(nextStep.colValue != colValues.OPEN){
                nextStep = nextSteps[1];
                stepCount ++;
            }
        } else {
            //Minus step towards wrong brick and step returning
            if(nextStep.colValue == colValues.OPEN){
                nextStep = nextSteps[1];
                stepCount -= 2;
            }
        }
        
    }
    return getNextPoint(point, nextStep.direction);
}


//Get the minDistance
function getMinDistance (point){
    return Math.abs(exitRow-point.row) + Math.abs(exitCol-point.col);
}

//get next move point
function getNextPoint(point, direction){
    let tPoint = {
                row: point.row,
                col: point.col
            };
    switch(direction){
        case directions.UP:
            tPoint.row += 1;
            break;
        case directions.DOWN:
            tPoint.row -= 1;
            break;
        case directions.LEFT:
            tPoint.col -= 1;
            break;
        case directions.RIGHT:
            tPoint.col += 1;
            break;
    }
    return tPoint;
}


//write results after solve 
function writeResults(){
    var result = "";
    if(noEntry){
        result = "Can not find an entry!";
    }else if(exitReached){
        result = `Success! It took ${stepCount} step(s)`;
    }else {
        result = "Cannot find an exit!";
    }
    document.getElementById("results").innerHTML = result;
}