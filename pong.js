       const canvas = document.getElementById("pongCanvas");
        const ctx = canvas.getContext("2d");


        let gameStarted = false;
        let onePlayerMode = false;


        // Set canvas dimensions
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;


        // Paddle variables
        const paddleWidth = canvas.width * 0.02;
        const paddleHeightFactor = 6; // Adjusted for better playability

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
                case 90: // Z key
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
                case 90: // Z key
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

        // Function to start the game
        function startGame(players) {
            gameStarted = true;
            onePlayerMode = players === 1;
            // Hide the buttons
            document.querySelector('div').style.display = 'none';
            // Game loop
            function gameLoop() {
                if (gameStarted) {
                    draw();
                }
                requestAnimationFrame(gameLoop);
            }
            // Handle window resize
            window.addEventListener("resize", function () {
                if (gameStarted) {
                    // Update canvas dimensions
                    canvas.width = window.innerWidth * 0.8;
                    canvas.height = window.innerHeight * 0.8;
                    // Update paddle and ball positions
                    leftPaddleHeight = canvas.width * 0.02 * paddleHeightFactor;
                    rightPaddleHeight = canvas.width * 0.02 * paddleHeightFactor;
                    leftPaddleY = canvas.height / 2 - leftPaddleHeight / 2;
                    rightPaddleY = canvas.height / 2 - rightPaddleHeight / 2;
                    resetBall();
                }
            });
            // Start the game loop
            gameLoop();
        }
        // Draw function
        function draw() {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw paddles
	@@ -142,48 +166,53 @@
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
                ballSpeedX *= 1.05;
                ballSpeedY *= 1.05;
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
            if (gameStarted) {
            ctx.fillText(leftPlayerScore, canvas.width * 0.25, canvas.height * 0.1);
            ctx.fillText(rightPlayerScore, canvas.width * 0.75, canvas.height * 0.1);
            }

            // If in 1 player mode, move the right paddle automatically (AI)
            if (onePlayerMode) {
                moveAI();
            }
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
        // Move the AI paddle in 1 player mode
        function moveAI() {
            // Simple AI: Follow the ball's Y position
            if (ballY < rightPaddleY + rightPaddleHeight / 2) {
                rightPaddleY -= paddleSpeed;
            } else {
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
            location.reload();
        }
