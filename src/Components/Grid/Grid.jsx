import React from 'react';
import ReactDOM from 'react-dom/client';
import GridNode from '../GridNode/GridNode';
import './Grid.css';
import {dfs} from '../../algorithms/depth-first-search';
import {bfs} from '../../algorithms/breadth-first-search';
import {MazeGenerator} from '../../algorithms/maze-generation';


const GridNodeType = Object.freeze({
    START_NODE : "start-node",
    END_NODE : "end-node",
    BOUNDARY_NODE: "boundary-node",
    WORKER_NODE: "worker-node",
});

const START_POS = {row : 6, col : 2};
const END_POS = {row: 16, col: 32};

export default function Grid() {

    // const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

    // Update window width and height when the window is resized
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
    };

    // Attach and detach the event listener on component mount and unmount
    React.useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // The empty dependency array ensures that the effect runs only once after the initial render


    let isMouseDown = false;

    function handleMouseDown(row, col) {
        isMouseDown = true;
        visited[row][col] = true;
        document.getElementById(row * NUM_COLS + col).classList.add('node-wall');
    }

    function handleMouseOver(row, col) {
        if(!isMouseDown) return;
        visited[row][col] = true;
        document.getElementById(row * NUM_COLS + col).classList.add('node-wall');
    }

    function handleMouseUp(row, col) {
        visited[row][col] = true;
        document.getElementById(row * NUM_COLS + col).classList.add('node-wall');
        isMouseDown = false
    }

    // const columns;  Assuming each grid item is 40px wide, 20px for padding on each side
    // const rows; Assuming each grid item is 40px tall, 40px + 20px for padding on each side

    const NUM_ROWS =  Math.floor((windowHeight - 100) / 40);; // Math.floor(windowWidth / 42);
    const NUM_COLS = Math.floor((windowWidth - 40) / 40); // Math.floor(windowHeight / 44);

    const gridTemplateRowsStyle = `repeat(${NUM_ROWS}, 40px)`;
    const gridTemplateColumnsStyle = `repeat(${NUM_COLS}, 40px)`;

    console.log("NUM_ROWS: " + NUM_ROWS);
    console.log("NUM_COLS: " + NUM_COLS);
    
    let squares = [];
    let visited = [];

    for(let row = 0; row < NUM_ROWS; row++) { 
        const currentRow = [];
        const visitedRow = [];
        for(let col = 0; col < NUM_COLS; col++) {
            const id = row + ", " + col;
            const value = row * NUM_COLS + col;

            let type = GridNodeType.WORKER_NODE;
            if(row === START_POS.row && col === START_POS.col )
                type = GridNodeType.START_NODE;
            else if(row === END_POS.row && col === END_POS.col)
                type = GridNodeType.END_NODE;
            else if(row === 0 || row === NUM_ROWS - 1 || col === 0 || col === NUM_COLS - 1)
                type = GridNodeType.BOUNDARY_NODE;

            currentRow.push(
                <GridNode value={value} 
                type={type} key={id} 
                row={row} col={col}
                handleMouseUp={handleMouseUp}
                handleMouseDown={handleMouseDown}
                handleMouseOver={handleMouseOver}
                />
            );
            visitedRow.push(false);
        }
        squares.push(currentRow);
        visited.push(visitedRow);
    }

    let squareElements = squares.map((item) => item);

    function resetVisitedArray() {
        for(let row = 0; row < NUM_ROWS; row++) {
            for(let col = 0; col < NUM_COLS; col++) {
                visited[row][col] = false;
            }
        }
    }

    let pathBfs = [];
    let shortestPathBfs = [];
    let pathDfs = [];
    let shortestPathDfs = [];
    let lastRanAlgo = "nothing";

    function handleClickDfs() {
        // setButtonDisabled(true);
        lastRanAlgo = "DFS";
        // console.log(buttonDisabled);
        const path = [];
        const shortestPath = []
        const {isPossible, resShortestPath} = dfs(squares, visited, START_POS.row, START_POS.col, END_POS.row, END_POS.col, path, shortestPath, NUM_ROWS, NUM_COLS);
        console.log(path);
        console.log("dfs");
        console.log("isPossible: " + isPossible);
        console.log("shortestPath: ", shortestPath);
        console.log("resShortestPath: ", resShortestPath);
        animatePathDfs(path, shortestPath);
        pathDfs = path;
        shortestPathDfs = shortestPath;
    }

    function animatePathDfs(path, shortestPath, isReverse=false) {
        let time = 10;
        for(let step of path) {
            const nodeValue = step.row * NUM_COLS + step.col;
            if(isReverse)
                visited[step.row][step.col] = false;

            setTimeout(() => {
                console.log("NodeValue: " + nodeValue);
                const gridNode = document.getElementById(nodeValue);
                if (isReverse)
                    gridNode.classList.remove('node-path');
                else
                    gridNode.classList.add('node-path');
            }, time);
            time += 10;
        }
        // reactivateButton(time + 500);
        animateShortestPath(shortestPath, time, isReverse);
    }


    function handleClickBfs() {
        // setButtonDisabled(true);
        // console.log(buttonDisabled);
        const path = [];
        const {distance, shortestPath} = bfs(squares, visited, START_POS.row, START_POS.col, END_POS.row, END_POS.col, path, NUM_ROWS, NUM_COLS);
        console.log(path);
        console.log("bfs");
        console.log("distance: " + distance);
        console.log("shortestPath: ", shortestPath);
        animatePathBfs(path, shortestPath);
        pathBfs = path;
        shortestPathBfs = shortestPath;
        lastRanAlgo = "BFS";
        console.log('bfs running');
        console.log(lastRanAlgo);
    }

    function animatePathBfs(path, shortestPath, isReverse=false) {
        let time = 20;
        // let previousNodes = [];
        // let prevDistance = path[0].distance;

        for(let step of path) {
            const nodeValue = step.row * NUM_COLS + step.col;
            if(isReverse)
                visited[step.row][step.col] = false;
            // const distance = step.distance;
            // const nodeClass = distance % 2 === 0 ? 'node-path0' : 'node-path1';
            setTimeout(() => {
                console.log("NodeValue: " + nodeValue);
                const gridNode = document.getElementById(nodeValue);
                if (isReverse)
                    gridNode.classList.remove('node-path');
                else
                    gridNode.classList.add('node-path');
            }, time);
             time += 20;
        }

        animateShortestPath(shortestPath, time + 30, isReverse);
    }

    function animateShortestPath(shortestPath, time, isReverse=false) {
        for(let step of shortestPath) {
            const nodeValue = step[0] * NUM_COLS + step[1];
            setTimeout(() => {
                const gridNode = document.getElementById(nodeValue);
                if (isReverse)
                    gridNode.classList.remove('node-shortest-path');
                else
                    gridNode.classList.add('node-shortest-path');
            }, time);
            time += 40;
        }
        reactivateButton(time + 500);
    }

    function reactivateButton(time) {
        setTimeout(() => {
            // setButtonDisabled(false);
            // console.log(buttonDisabled);
        }, time);
    }

    function handleClickMaze() {
        lastRanAlgo = "nothing";
        const mazeGenerator = new MazeGenerator(NUM_ROWS, NUM_COLS);
        const maze = mazeGenerator.generateMaze(START_POS.row, START_POS.col, END_POS.row, END_POS.col);
        console.log(maze);
        let time = 20;
        // for(let row = 0; row < NUM_ROWS; row++) {
        //     for(let col = 0; col < NUM_COLS; col++) {
        //         if(maze[row][col] === 1 || isNotValid(row, col)) continue;
        //         const nodeValue = row * NUM_COLS + col;
        //         console.log(row, col, nodeValue);
        //         visited[row][col] = true;
        //         setTimeout(() => {
        //             const gridNode = document.getElementById(nodeValue);
        //             gridNode.classList.add('node-maze');
        //         }, time);
        //         time += 20;
        //     }
        // }

        for(let col = 0; col < NUM_COLS; col++) {
            for(let row = 0; row < NUM_ROWS; row++) {
                if(maze[row][col] === 1 || isNotValid(row, col)) continue;
                const nodeValue = row * NUM_COLS + col;
                console.log(row, col, nodeValue);
                visited[row][col] = true;
                setTimeout(() => {
                    const gridNode = document.getElementById(nodeValue);
                    gridNode.classList.add('node-maze');
                }, time);
                time += 20;
            }
        }
    }

    function isNotValid(row, col) {
        return (row === START_POS.row && col === START_POS.col) || 
                (row === END_POS.row && col === END_POS.col);
    }

    
    function handleClickReset() {
        console.log("reset algo: ", lastRanAlgo);
        // reverseBfs();
        if(lastRanAlgo === "BFS")
            reverseBfs();
        else if(lastRanAlgo === "DFS")
            reverseDfs();
        lastRanAlgo = "nothing";
    }

    function reverseBfs() {
        console.log("reversing bfs");
        pathBfs.reverse();
        shortestPathBfs.reverse();
        // resetVisitedArray();
        animatePathBfs(pathBfs, shortestPathBfs, true);
        console.log("visited after reverse bfs: ");
        console.log(visited);
    }

    function reverseDfs() {
        console.log("reversing dfs");
        pathDfs.reverse();
        shortestPathDfs.reverse();
        // resetVisitedArray();
        animatePathDfs(pathDfs, shortestPathDfs, true);
        console.log("visited after reverse dfs: ");
        console.log(visited);
    }

    return (
        <React.Fragment>
            <div className='main-nav'>
                <button className='dfs-button button' onClick={handleClickDfs} >Start DFS</button>
                <button className='bfs-button button' onClick={handleClickBfs} >Start BFS</button>
                <button className='maze-button button' onClick={handleClickMaze} >Create Maze</button>
                <button className='reset-button button' onClick={handleClickReset} >Reset</button>
            </div>
            <div className='grid-container' style={{ display: 'grid', gridTemplateColumns: gridTemplateColumnsStyle, gridTemplateRows: gridTemplateRowsStyle }}>
                {squareElements}
            </div>
        </React.Fragment>
    );
}
