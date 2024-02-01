const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Paddle variables
const paddleWidth = canvas.width * 0.02;
const paddleHeightFactor = 6; // Factor relative to ball size
let leftPaddleHeight = canvas.width * 0.02 * paddleHeightFactor;
let rightPaddleHeight = canvas.width * 0.02 * paddleHeightFactor;
let leftPaddleY = canvas.height / 2 - leftPaddleHeight / 2;
let rightPaddleY = canvas.height / 2 - rightPaddleHeight / 2;

// Paddle speed
const paddleSpeed = canvas.height * 0.02;

// Ball variables
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5;

// Score variables
let leftPlayerScore = 0, rightPlayerScore = 0;

// Paddle movement variables
let leftPaddleMoveUp = false;
let leftPaddleMoveDown = false;
let rightPaddleMoveUp = false;
let rightPaddleMoveDown = false;

// Event listeners for keydown and keyup events
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

// Functions to handle key events
function handleKeyDown(event) {
    switch (event.keyCode) {
        case 87: // W key
            leftPaddleMoveUp = true;
            break;
        case 83: // S key
            leftPaddleMoveDown = true;
            break;
        case 38: // Up arrow
            rightPaddleMoveUp = true;
            break;
        case 40: // Down arrow
            rightPaddleMoveDown = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.keyCode) {
        case 87: // W key
            leftPaddleMoveUp = false;
            break;
        case 83: // S key
            leftPaddleMoveDown = false;
            break;
        case 38: // Up arrow
            rightPaddleMoveUp = false;
            break;
        case 40: // Down arrow
            rightPaddleMoveDown = false;
            break;
    }
}

// Draw function
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, leftPaddleY, paddleWidth, leftPaddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, rightPaddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, canvas.width * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top and bottom walls
    if (ballY - canvas.width * 0.02 < 0 || ballY + canvas.width * 0.02 > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce off paddles
    if (
        (ballX - canvas.width * 0.02 < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + leftPaddleHeight) ||
        (ballX + canvas.width * 0.02 > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + rightPaddleHeight)
    ) {
        // Calculate the hit angle based on the position of the ball relative to the center of the paddle
        let deltaY;
        if (ballX < canvas.width / 2) {
            deltaY = ballY - (leftPaddleY + leftPaddleHeight / 2);
        } else {
            deltaY = ballY - (rightPaddleY + rightPaddleHeight / 2);
        }

        // Adjust the horizontal speed of the ball based on the hit angle
        ballSpeedX = -ballSpeedX; // Invert the horizontal direction
        ballSpeedY = deltaY * 0.1;

        // Increase ball speed slightly
        ballSpeedX *= 1.02;
        ballSpeedY *= 1.02;
    }

    // Check for scoring
    if (ballX < 0) {
        // Right player scores
        rightPlayerScore++;
        checkGameEnd();
        resetBall();
    }

    if (ballX > canvas.width) {
        // Left player scores
        leftPlayerScore++;
        checkGameEnd();
        resetBall();
    }

    // Move the paddles
    movePaddles();

    // Display scores
    ctx.font = `${canvas.width * 0.04}px Arial`;
    ctx.fillText("Left Player: " + leftPlayerScore, canvas.width * 0.1, canvas.height * 0.1);
    ctx.fillText("Right Player: " + rightPlayerScore, canvas.width * 0.7, canvas.height * 0.1);
}

// Move the paddles
function movePaddles() {
    // Move left paddle
    if (leftPaddleMoveUp && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    }

    if (leftPaddleMoveDown && leftPaddleY + leftPaddleHeight < canvas.height) {
        leftPaddleY += paddleSpeed;
    }

    // Move right paddle
    if (rightPaddleMoveUp && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }

    if (rightPaddleMoveDown && rightPaddleY + rightPaddleHeight < canvas.height) {
        rightPaddleY += paddleSpeed;
    }
}

// Reset ball function
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
}

// Check if the game has ended
function checkGameEnd() {
    if (leftPlayerScore === 7 || rightPlayerScore === 7) {
        alert(`Game Over! ${leftPlayerScore === 7 ? 'Left' : 'Right'} player wins!`);
        resetGame();
    }
}

// Reset game function
function resetGame() {
    leftPlayerScore = 0;
    rightPlayerScore = 0;
    resetBall();
}

// Game loop
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Handle window resize
window.addEventListener("resize", function () {
    // Update canvas dimensions
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    // Update paddle and ball positions
    leftPaddleHeight = canvas.width * 0.02 * paddleHeightFactor;
    rightPaddleHeight = canvas.width * 0.02 * paddleHeightFactor;
    leftPaddleY = canvas.height / 2 - leftPaddleHeight / 2;
    rightPaddleY = canvas.height / 2 - rightPaddleHeight / 2;
    resetBall();
});

// Start the game loop
gameLoop();