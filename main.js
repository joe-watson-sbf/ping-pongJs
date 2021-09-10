let board = new Board(800, 400);
let bar1 = new Bar(20, 130, 20, 100, board)
let bar2 = new Bar(760, 130, 20, 100, board)
let canvas = document.getElementById('canvas');
let board_view = new BoardView(canvas, board);
let ball = new Ball(400, 189, 20, board);



// Control key press
document.addEventListener('keydown', (event)=>{
    if(event.key==='ArrowDown') bar1.down();
    if(event.key==='ArrowUp') bar1.up();

    if(event.key==='s') bar2.down();
    if(event.key==='w') bar2.up();
    if(event.key===' ') board.playing = !board.playing;
    
    event.preventDefault();
})



window.requestAnimationFrame(controller);

board_view.draw();
function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
    board_view.replay();
}


function ganador(params) {
    if (this.x >= 790){
        this.contadorJugador1++;
        this.x = 350;
        this.y = 100;
        this.direction = 1;
        this.speed_y = 0;
        this.speed_x = 3;
        this.speed = 3;
        this.board.arePlaying = false;

        
    }else if (this.x <= 10) {
        this.contadorJugador2++;
        this.x = 350;
        this.y = 100;
        this.direction = -1;
        this.speed_y = 0;
        this.speed_x = 3;
        this.speed = 3;
        this.board.arePlaying = false;

    }
}