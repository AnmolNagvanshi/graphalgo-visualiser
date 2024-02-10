
export function bfs(grid, visited, startX, startY, targetX, targetY, path, totalRows, totalCols) {
    const queue = [[startX, startY, 0, []]];

    while(queue.length > 0) {
        let size = queue.length;
        const [currentX, currentY, distance, shortestPath] = queue.shift();
        path.push({row : currentX, col : currentY, distance: distance});

        if(currentX === targetX && currentY === targetY) {
            return {"distance" : distance, "shortestPath" : shortestPath};
        }

        while(size > 0) {
            const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]
            DIRS.reverse();
            for(let dir of DIRS) {
                const [nextX, nextY] = [currentX + dir[0], currentY + dir[1]];
                if(isValid(nextX, nextY, totalRows, totalCols) && !visited[nextX][nextY]) {
                    visited[nextX][nextY] = true;
                    queue.push([nextX, nextY, distance + 1, [...shortestPath, [nextX, nextY]]]);
                    // path.push({row : currentX, col : currentY});
                }
            }
            size--;
        }
    }

    return {"distance": -1, "shortestPath" : []};
}


function isValid(x, y, totalRows, totalCols) {
    return x >= 0 && x < totalRows && y >= 0 && y < totalCols;
}