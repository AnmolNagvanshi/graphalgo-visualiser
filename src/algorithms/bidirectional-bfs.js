
export function bidirectionalBfs(grid, visited1, visited2, x1, y1, targetX, targetY, path, totalRows, totalCols) {
    let x2 = targetX;
    let y2 = targetY;
    const queue1 = [[x1, y1, 0, []]];
    const queue2 = [[x2, y2, 0, []]];
    console.log(visited1 === visited2);
    console.log("Total:", totalRows, totalCols);

    const map1 = new Map();
    const map2 = new Map();


    while(queue1.length > 0 || queue2.length > 0) {
        let size1 = queue1.length;
        let size2 = queue2.length;
        const [currentX1, currentY1, distance1, shortestPath1] = queue1.shift();
        const [currentX2, currentY2, distance2, shortestPath2] = queue2.shift();       

        const key1 = currentX1 + "," + currentY1;
        const key2 = currentX2 + "," + currentY2;

        path.push({row : currentX1, col : currentY1, distance: distance1});
        path.push({row : currentX2, col : currentY2, distance: distance2});

        if(visited2[currentX1][currentY1] || visited1[currentX2][currentY2]) {
            console.log("shortest path 1", shortestPath1);
            console.log("shortest path 2", shortestPath2);
            console.log("1: ", currentX1, currentY1);
            console.log("2: ", currentX2, currentY2);

            let shortestPath;
            if(visited2[currentX1][currentY1]) {
                console.log("1 visited in 2");
                console.log("map2: ", map2);
                console.log(map2.get(key1));
                shortestPath = shortestPath1.concat(map2.get(key1).reverse());
            } else {
                console.log("2 visited in 1");
                console.log(map1.get(key2));
                console.log("map1: ", map1);
                shortestPath = shortestPath2.concat(map1.get(key2).reverse());
            }

            return {"distance" : distance1 + distance2, "shortestPath" : shortestPath};
        }

        const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        DIRS.reverse();

        while(size1 > 0) {
            for(let dir of DIRS) {
                const [nextX1, nextY1] = [currentX1 + dir[0], currentY1 + dir[1]];
                if(isValid(nextX1, nextY1, totalRows, totalCols) && visited1[nextX1][nextY1] === false) {
                    visited1[nextX1][nextY1] = true;
                    queue1.push([nextX1, nextY1, distance1 + 1, [...shortestPath1, [nextX1, nextY1]]]);
                    map1.set(nextX1 + "," + nextY1, [...shortestPath1, [nextX1, nextY1]]);
                }
            }
            size1--;
        }

        while(size2 > 0) {
            for(let dir of DIRS) {
                const [nextX2, nextY2] = [currentX2 + dir[0], currentY2 + dir[1]];
                if(isValid(nextX2, nextY2, totalRows, totalCols) && visited2[nextX2][nextY2] === false) {
                    visited2[nextX2][nextY2] = true;
                    queue2.push([nextX2, nextY2, distance2 + 1, [...shortestPath2, [nextX2, nextY2]]]);
                    map2.set(nextX2 + "," + nextY2, [...shortestPath2, [nextX2, nextY2]]);
                }
            }
            size2--;
        }

    }

    return {"distance": -1, "shortestPath" : []};
}

function isValid(x, y, totalRows, totalCols) {
    return x >= 0 && x < totalRows && y >= 0 && y < totalCols;
}