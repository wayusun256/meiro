export function createKabe(scene, mazeArray) {
    const cellSize = 2;
    const size = mazeArray.length;

    const modelScale = 0.33;  
    const modelY = 1.0;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {

            if (mazeArray[i][j] === 1) {

                const wall = document.createElement("a-entity");
                wall.setAttribute("gltf-model", "#kabe2");

                const x = i * cellSize + cellSize / 2;
                const z = j * cellSize + cellSize / 2;

                wall.setAttribute("position", `${x} ${modelY} ${z}`);
                wall.setAttribute("scale", `${modelScale} 0.66 ${modelScale}`);

                scene.appendChild(wall);

                const hit = document.createElement("a-entity");
                hit.setAttribute("geometry", "primitive: box; width: 4.5; height: 4.5; depth: 5.3");
                hit.setAttribute("material", "visible: false; opacity: 0");
                hit.setAttribute("class", "wall-collision");

                hit.setAttribute("position", `0 0 0`);

                wall.appendChild(hit);

            }
        }
    }
}