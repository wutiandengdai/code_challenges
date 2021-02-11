const grid1 = [
    ['f', 'f', 'f', 'f'],
    ['t', 't', 'f', 't'],
    ['f', 'f', 'f', 'f'],
    ['f', 'f', 'f', 'f']
];

const grid2 = [
    ['f', 'f', 'f', 'f', 'f'],
    ['t', 't', 'f', 't', 'f'],
    ['f', 'f', 'f', 'f', 'f'],
    ['f', 't', 'f', 'f', 'f']
];

const grid3 = [
    ['t', 'f', 't', 't', 't'],
    ['f', 'f', 't', 't', 't'],
    ['f', 't', 'f', 'f', 'f'],
    ['f', 'f', 'f', 't', 'f'],
    ['t', 't', 't', 'f', 'f'],
    ['t', 't', 't', 'f', 't']
];

const grid4 = [
    ['t', 't', 't', 't', 'f'],
    ['f', 'f', 'f', 't', 'f'],
    ['f', 't', 'f', 't', 'f'],
    ['f', 't', 'f', 't', 'f'],
    ['f', 't', 'f', 'f', 'f'],
    ['f', 't', 't', 't', 't']
];

const grid5 = [
    ['t', 'f', 't', 't', 't'],
    ['t', 'f', 'f', 'f', 'f'],
    ['t', 't', 't', 't', 'f'],
    ['f', 'f', 'f', 't', 'f'],
    ['f', 't', 'f', 'f', 'f'],
    ['f', 't', 't', 't', 't']
];

//Current selected grid
cGrid = [];

//render rows and columns of displaying grid
function displayGrid(grid, title){

    let resultHTML = "";
    cGrid = grid;

    //Title styling
    document.getElementById("gridTitle").innerHTML = title;
    if (title.includes("void")){
        document.getElementById("gridTitle").setAttribute("colorValue", "void");
    } else if (title.includes("arc")){
        document.getElementById("gridTitle").setAttribute("colorValue", "arc");
    } else if (title.includes("solar")){
        document.getElementById("gridTitle").setAttribute("colorValue", "solar");
    } else{
        document.getElementById("gridTitle").setAttribute("colorValue", "default");
    }

    //Grid reverse loop
    for (irow = cGrid.length-1; irow>=0 ; irow--){
        let rowVal = "";
        let blockVal = "";
        let colVal = "";
        let name = "";
        for (icol = 0; icol < cGrid[irow].length; icol ++){
            blockVal = cGrid[irow][icol];

            switch(cGrid[irow][icol].toLowerCase()){
                case "t":
                    blockVal = "wall";
                    break;
                case "f":
                    blockVal = "path";
                    break;
                //reset if walked
                case "fp":
                    blockVal = "path";
                    cGrid[irow][icol] = "f";
                    break;
                //deadend
                case "fx":
                    blockVal = "path";
                    cGrid[irow][icol] = "f"
                    break;
            }

            colVal = cGrid[irow][icol];
            //literal template
            name = `${irow}:${icol}`;
            rowVal += renderColumn(colVal, blockVal, name);
        }
        resultHTML += renderRow(rowVal);
    }
    document.getElementById("gridDisplay").innerHTML = resultHTML;
}

//template function to render grid columns
function renderColumn(colVal, blockVal, name){
    return `<td id="${name}" blockValue="${blockVal}" class="gridStyle">
                ${colVal}
            </td>`;
}

//template function to render row
function renderRow (rowVal){
    return `<tr h-100>
                ${rowVal}
            </tr>`;
}