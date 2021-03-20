fitShapesToCanvas(canvas: HTMLCanvasElement, game_state: GameState) {
    // declaring constants
    const width = canvas.width;
    const height = canvas.height;
    const rows = game_state.array.length;
    const shapes_in_row = game_state.array[0].length;
    // declaring an array which will eventually include all the shapes
    let shapes = [];
    // empty space gap from the corners
    const gapX = Math.floor(width / 40);
    const gapY = Math.floor((height / 40)); 
    // calculating maximum bound radius
    const r = Math.floor(
      width > height?
        ((height * 0.85) /(rows > shapes_in_row ? rows : shapes_in_row)) / 2
        : ((width * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2
    );
    // calculating the gap between the space the shapes take and space the canvas has
    const dx = Math.round((width * 0.85) / (shapes_in_row-1));
    const dy = Math.round((height * 0.85) / (rows-1));
    // calculating xI - the first x position we can a shape at
    // and yI - the first y position we can a shape at
    const xI = gapX + r, xE = gapX + (r + dx) * shapes_in_row - dx; 
    const yI = gapY + r, yE = gapY + (r + dy) * rows - dy; 

    // logs
    console.log(`rows is [${rows}], shapes_in_row: [${shapes_in_row}]`);
    console.log(`window height [${window.innerHeight}], window width: [${window.innerWidth}]\n
      canvas height: [${height}], canvas width: [${width}]`);
    console.log(`gapX [${gapX}], gapY [${gapY}]`);
    console.log(
      `the radius is [${r}], would have been [${
        (height * 0.9) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2)
      }]`
    );
    console.log(`dx is [${dx}], dy is [${dy}]`);
    console.log(`xI is [${xI}], yI is ${yI}`);
    // creating the shapes
    for (let i = 0; i < rows; i++) {
      const curr_row = game_state.array[i];
      for (let j = 0; j < curr_row.length; j++) {
        let curr_shape = curr_row[j];
        if (curr_shape != null) {
          const x = Math.round(gapX + j * r + (j-1) * dx);
          const y = Math.round(gapY + i * r + (i-1) * dy);
          let shape = new Shape(x, y, r, i, j, curr_shape);
          shapes.push(shape);
        }
      }
    }
    this.updateGameStateShapes(shapes);
    return shapes;
  }