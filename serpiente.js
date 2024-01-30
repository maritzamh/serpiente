// Obtenemos el canvas y su contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tamaño de cada caja en el lienzo y tamaño del lienzo en cajas
const box = 20;
const canvasSize = 20;

// Creamos un elemento para mostrar la puntuación del juego
const scoreEl = document.createElement('p');
scoreEl.style.color = 'black';
scoreEl.style.textAlign = 'center';
scoreEl.style.marginTop = '10px';
document.body.appendChild(scoreEl).style.display = 'block';

// Inicializamos la serpiente con una posición central en el canvas
let snake = [];
snake[0] = { x: canvasSize / 2 * box, y: canvasSize / 2 * box };

// Generamos la posición inicial de la comida de manera aleatoria
let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box
};

// Variable para la dirección de la serpiente
let d;

// Escuchamos los eventos de teclado para controlar la dirección de la serpiente
document.addEventListener('keydown', direction);

function direction(event) {
    // Cambiamos la dirección según la tecla presionada, evitando que la serpiente se mueva en la dirección opuesta a su movimiento actual
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    } else if (event.keyCode == 27 ) {// Tecla Esc para finalizar el juego
        clearInterval(game); // Detener el juego
        document.getElementById('gameOverMessage').style.display = 'block'; // Mostrar el mensaje de juego terminado
        d = 'DOWN';
    }
    
}

// Función para dibujar en el canvas
function draw() {
    // Limpiamos el canvas en cada fotograma
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujamos la serpiente
    for (let i = 0; i < snake.length; i++) {
        // El primer segmento de la serpiente es verde, el resto es blanco
        ctx.fillStyle = (i == 0) ? 'gray' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'gray';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujamos la comida
    ctx.fillStyle = 'white';
    ctx.fillRect(food.x, food.y, box, box);

    // Movemos la cabeza de la serpiente en la dirección actual
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    // Permitimos que la serpiente atraviese los bordes del lienzo y aparezca en el lado opuesto
    if (snakeX < 0) snakeX = canvasSize * box - box;
    if (snakeY < 0) snakeY = canvasSize * box - box;
    if (snakeX >= canvasSize * box) snakeX = 0;
    if (snakeY >= canvasSize * box) snakeY = 0;

    // Si la serpiente come la comida, incrementamos la puntuación y generamos nueva comida
    if (snakeX == food.x && snakeY == food.y) {
        scoreEl.textContent = `Score: ${snake.length}`;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        // Si no come, eliminamos el último segmento de la serpiente
        snake.pop();
    }

    // Creamos la nueva cabeza de la serpiente
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Verificamos si hay colisión con la serpiente misma
    ///if (collision(newHead, snake)) {
        //clearInterval(game); // Si hay colisión, detenemos el juego
        
    //}
    // Dentro de la función collision()
    if (collision(newHead, snake)) {
        clearInterval(game); // Detener el juego
        document.getElementById('gameOverMessage').style.display = 'block'; // Mostrar el mensaje de juego terminado
    }

    // Agregamos la nueva cabeza a la serpiente
    snake.unshift(newHead);

    // Mostramos la puntuación en el centro del canvas
    //ctx.fillStyle = 'white';
    //ctx.font = '45px Changa one';
    ctx.fillText(scoreEl.textContent, canvas.width / 2 - 30, canvas.height / 2 + 20);
}

// Función para verificar colisión con la serpiente misma
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Configuramos un intervalo para llamar a la función draw y animar el juego
let game = setInterval(draw, 150); // Controla la velocidad del juego ajustando este valor
