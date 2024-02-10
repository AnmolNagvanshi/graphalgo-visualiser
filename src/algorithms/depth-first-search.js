
export function dfs(grid, visited, startX, startY, targetX, targetY, path, shortestPath, totalRows, totalCols) {
    // if(startX < 1 || startX > 40 || startY < 1 || startY > 22 || visited[startX][startY])
    //     return false;
    // path.push({row : startX, col : startY});


    if(startX === targetX && startY === targetY) {
        path.push({row : startX, col : startY});
        shortestPath.push([startX, startY]);
        visited[startX][startY] = true;
        return [true, shortestPath.slice()];
    }

    // const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    // DIRS.reverse();
    for(let dir of DIRS) {
        const [nextX, nextY] = [startX + dir[0], startY + dir[1]];
        // console.log("startY: " + startY);
        // console.log("startX: " + startX);
        // console.log("y: " + nextY);
        // console.log("x: " + nextX);
        if(isValid(nextX, nextY, totalRows, totalCols) && !visited[nextX][nextY]) {
            path.push({row : nextX, col : nextY});
            shortestPath.push([nextX, nextY]);
            visited[nextX][nextY] = true;
            const result = dfs(grid, visited, nextX, nextY, targetX, targetY, path, shortestPath, totalRows, totalCols);
            if(result[0]) {
                console.log("result: " + result);
                return result;
            }
            shortestPath.pop();
        }
    }

    return [false, []];
}

function isValid(x, y, totalRows, totalCols) {
    return x >= 0 && x < totalRows && y >= 0 && y < totalCols;
}
