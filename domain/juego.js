class Board{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.play = false;
        this.game_over=false;
        this.bars=[];
        this.ball=null;
        this.playing = false;
    }

    elements(){
        var elements = this.bars.map((bar)=>{return bar;})
        elements.push(this.ball);
        return elements;
    }
}





class Bar{

    constructor(x,y,width, height, board){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = 'rectangle';
        this.speed=10;
    }

    /**
     * Metodo para mover las barras, hacia abajo 
     */
    down(){
        if(this.y < 300) this.y += this.speed;
    }

    /**
     * Metodo para mover las barras, hacia arriba
     */
    up(){
        if(this.y > 0) this.y -= this.speed;
    }
}




class BoardView {

    constructor(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height= board.height;
        this.board = board;
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Metodo para dibujar las figuras de nuetro tablero/mesa
     */
    draw(){
        let elements = this.board.elements();
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            this.#dibujar(element);
        };
    }

    /**
     * Metodo que reune 2 metodo 
     * que encargan de las barras y la pelota: hit et Collision
     *  
     */
    check_collisions(){
        let bars = this.board.bars;
        for (let i = 0; i < bars.length; i++) {
            let bar = bars[i];
            if(this.#hit(bar, this.board.ball)){
                this.board.ball.collision(bar);
            }
        };
    }

    /**
     * Metodo que ayuda a controlar cuando la pelota encontra con las barras
     */
    #hit(bar, ball){
        if(ball.x + ball.width >= bar.x && ball.x < bar.x + bar.width){
            if(ball.y + ball.height >= bar.y && ball.y < bar.y + bar.height){
                return true;
            }
        }
    
        if(ball.x <= bar.x && ball.x + ball.width >= bar.x + bar.width){
            if(ball.y <= bar.y && ball.y + ball.height >= bar.y + bar.height){
                return true;
            }
        }
    
        if(bar.x <= ball.x && bar.x + bar.width >= ball.x + ball.width){
            if(bar.y <= ball.y && bar.y + bar.height >= ball.y + ball.height){
                return true;
            }
        }
        return false;
    }

    /**
     * Permite a limpiar las trazas de la pelota cuando se mueve
     */
    clear(){
        this.canvas.getContext('2d').clearRect(0,0,this.board.width, this.board.height);
    }

    /**
     * Metodo para iniciar el juego
     */
    play(){
        if(this.board.playing){
            this.clear();
            this.draw();
            this.check_collisions();
            this.board.ball.move();
        }
    }

    replay(){
        if(this.board.ball.isMatchEnd()) this.board.playing=false;
    }

    /**
     * Un metodo privado para dibujar los objetos 
     * en nuestra elemento canva
     */

    #dibujar(element){
        switch (element.kind) {
            case "rectangle":
                this.ctx.fillStyle = "#dee1ec";
                this.ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                this.ctx.beginPath();
                this.ctx.fillStyle = "#f9ff21";
                this.ctx.arc(element.x, element.y, element.radius,0,7);
                this.ctx.fill();
                this.ctx.closePath();
                break;
        }
    }

}




/**
 * Objeto pelota
 */

class Ball{
    constructor(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.height = radius * 2;
        this.width = radius * 2;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.speed = 3;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        board.ball=this;
        this.kind='circle';
    }

    /**
     * Metodo que nos permite a mover la pelota
     * 
     */
    move(){
        this.#reboundBoderTopBottom();
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y);
    }

    /**
     * Permite a rebotar la pelato cuando alcanza su
     * altura maximal que es el border Top y lo de abajo
     */
    #reboundBoderTopBottom(){
        if (this.y <= 10 || this.y >= 390) {
            this.speed_y = this.speed_y * - 1;
        }
    }

    /**
     * Permite a dar la pelota otra orientacion
     * cuando se choqua con un bar
     */
    collision(bar){
        let relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

        let normalized_intersect_y = relative_intersect_y / (bar.height / 2);
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
        
        this.speed_y = this.speed * Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        this.direction = (this.x > (this.board.width / 2)) ? -1 : 1;
        this.speed+=0.1;
    }

    /**
     * Controla cuando pasa la pelota detras de las barras
     * para reiniciar el juego
     */
    isMatchEnd(){
        if (this.x >= 790 || this.x <= 10){
            return true;
        }
    }
}