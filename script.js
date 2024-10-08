function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

squares = []

function create_tile(color) {
    let div = document.createElement("div");
    // div.style.background = color;
    div.className = "tile";
    if (color == "black") div.className = "tile flipped";
    return div;
}

function create_square(x, y) {
    let size = 48;
    let div = document.createElement("div");
    div.id = `${x} ${y}`;
    squares[div.id] = {
        filled: false,
        filled_color: null
    };

    div.className = "square";

    div.style.top = `${size * y}px`;
    div.style.left = `${size * x}px`; 
    document.body.appendChild(div);
}

function create_grid() {
    let x = 1;
    let y = 1;
    for (let i = 0; i < 64; i++) {
        create_square(x, y);
        x++;
        if (x > 8) {
            x = 1;
            y++;
        }
    }}

function find_to_flip(x, y, color) {
    let to_flip = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            i = 1;
            if (dx != 0 || dy != 0) {
                let id = `${x + dx * i} ${y + dy * i}`;
                let should_flip = true;
                let flip = [];
                while (document.getElementById(id)) {
                    if (!squares[id].filled) {
                        should_flip = false;
                        break;
                    } else {
                        if (squares[id].filled_color == color) {
                            break;
                        } else {
                            flip.push(id);
                        }
                    }
                    
                    i++;
                    id = `${x + dx * i} ${y + dy * i}`;
                }

                if (should_flip && document.getElementById(id)) {
                    for (let e of flip) to_flip.push(e);
                }
            }
        }
    }

    return to_flip;

}

create_grid();
                              
document.getElementById("4 4").appendChild(create_tile("white"));
squares["4 4"].filled = true;
squares["4 4"].filled_color = "white";
document.getElementById("5 4").appendChild(create_tile("black"));
squares["5 4"].filled = true;
squares["5 4"].filled_color = "black";
document.getElementById("5 5").appendChild(create_tile("white"));
squares["5 5"].filled = true;
squares["5 5"].filled_color = "white";
document.getElementById("4 5").appendChild(create_tile("black"));
squares["4 5"].filled = true;
squares["4 5"].filled_color = "black";

let player = 1;

[...document.querySelectorAll(".square")].forEach(s => {
    s.onclick = async (e) => {
        let square = e.target;
        if (square.className == "square") {
            if (!squares[square.id].filled) {
                let [x, y] = square.id.split(" ").map(Number);
                if (find_to_flip(x, y, player == 1 ? "white" : "black").length) {
                    squares[square.id].filled = true;
                    squares[square.id].filled_color = player == 1 ? "white" : "black";
                    square.appendChild(create_tile(player == 1 ? "white" : "black"));
                    for (let e of find_to_flip(x, y, player == 1 ? "white" : "black")) {
                        let el = document.getElementById(e);
                        squares[e].filled = true;
                        squares[e].filled_color = player == 1 ? "white" : "black";

                        el.firstElementChild.classList.toggle('flipped', player == 2);
                        await sleep(100);
                    }
                    player = 3 - player;

                    let okay = false;
                    let b = 0;
                    let w = 0;
                    for (let elem of document.querySelectorAll(".square")) {
                        if (!squares[elem.id].filled) okay = true;
                        if (squares[elem.id].filled_color) {
                            if (squares[elem.id].filled_color == "black") b++;
                            else w++;
                        }
                    }

                    document.title = `B:W = ${b}:${w}`;

                    if (!okay) {
                        alert(`${b > w ? "Black" : "White"} wins ${Math.max(b, w)}-${Math.min(b, w)}`);
                    }
                }
            }
        }
    }
})