document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.querySelector(".game-board");
    const distanceElement = document.querySelector(".kilometer");
    const speedElement = document.querySelector(".speed");
    const columns = document.querySelectorAll(".road-column");
    const botRespawnDistance = 300;
  
    let kilometer = 0;
    let speed = 0;
    let currentPlayerColumnIndex = 0;
    let botInterval;
    let occupiedColumns = [];
    let activeBots = [];
  
    const updateKilometers = (speed, time) => {
        const distance = speed * time;
        kilometer += distance;
        distanceElement.innerHTML = `Dystance: ${kilometer.toFixed(0)}km`;
    };
  
    const updateSpeed = (time) => {
        const acceleration = 0.8;
        const maxSpeed = 200;
        const displaySpeed = speed + 195;
        speed += acceleration * time;
        speed = Math.min(speed, maxSpeed);
        speedElement.innerHTML = `${Math.floor(displaySpeed)}km/h`;
    };
  
    const createPlayer = () => {
        const player = document.createElement("div");
        player.classList.add("player");
        const currentColumn = document.querySelectorAll(".road-column")[
            currentPlayerColumnIndex
        ];
        currentColumn.appendChild(player);
    };
  
    const updatePlayerPosition = () => {
        const player = document.querySelector(".player");
        const currentColumn = document.querySelectorAll(".road-column")[
            currentPlayerColumnIndex
        ];
        currentColumn.appendChild(player);
    };
  
    const getRandomColumnIndexes = (maxIndex, count) => {
        const indexes = Array.from({ length: maxIndex }, (_, index) => index);
        const randomIndexes = [];
    
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * indexes.length);
            randomIndexes.push(indexes.splice(randomIndex, 1)[0]);
        }
    
        return randomIndexes;
    };
  
    const changeDirection = (e) => {
        const columns = document.querySelectorAll(".road-column").length;
    
        if (e.key === "ArrowUp") {
            updateSpeed(1);
        } else if (e.key === "ArrowDown") {
            updateSpeed(-1);
        } else if (e.key === "ArrowLeft") {
            currentPlayerColumnIndex = (currentPlayerColumnIndex - 1 + columns) % columns;
        } else if (e.key === "ArrowRight") {
            currentPlayerColumnIndex = (currentPlayerColumnIndex + 1) % columns;
        }
    
        updatePlayerPosition();
    };
  
    const createBot = () => {
        const columns = document.querySelectorAll(".road-column");
        const bots = document.querySelectorAll(".bot");
    
        if (activeBots.length >= 2) {
            return; // Przerwij tworzenie nowego bota, jeśli już są obecne dwa boty na planszy
        }
        
        const availableColumns = Array.from(columns).filter((column) => {
            const isOccupied = column.dataset.isOccupied === "true";
            return !isOccupied;
        });
    
        if (availableColumns.length > 0) {
            const botImages = [
                "bot1.png",
                "bot2.png",
                "bot3.png",
                "bot4.png",
                "bot5.png",
            ];
    
            const randomColumnIndex = Math.floor(Math.random() * availableColumns.length);
            const column = availableColumns[randomColumnIndex];
            const bot = document.createElement("div");
            bot.classList.add("bot");
            const randomImage =
                botImages[Math.floor(Math.random() * botImages.length)];
            bot.style.backgroundImage = `url(${randomImage})`;
            column.appendChild(bot);
            column.dataset.isOccupied = "true";
            occupiedColumns.push(column);
    
            activeBots.push({ bot, column });
        }
    };
    
  
    const removeBotFromActive = (bot) => {
        const botIndex = activeBots.findIndex((b) => b.bot === bot);
        if (botIndex !== -1) {
            activeBots.splice(botIndex, 1);
        }
    };
  
    const moveBots = () => {
        const columnHeight = document.querySelector(".road-column").offsetHeight;
        const columns = document.querySelectorAll(".road-column");
    
        activeBots.forEach((activeBot) => {
            const { bot, column } = activeBot;
            const botPosition = bot.offsetTop;
            const newPosition = botPosition + speed;
    
            if (newPosition >= columnHeight) {
                column.dataset.isOccupied = "false";
                bot.remove();
                removeBotFromActive(bot);
            } else {
                bot.style.top = newPosition + "px";
            }
        });
    };
  
    const checkCollisions = () => {
        const player = document.querySelector(".player");
        const playerPosition = player.offsetTop;
        const playerHeight = player.offsetHeight;
    
        activeBots.forEach((activeBot) => {
            const { bot, column } = activeBot;
            const botPosition = bot.offsetTop;
    
            if (
                botPosition <= playerPosition + playerHeight &&
                botPosition + bot.offsetHeight >= playerPosition
            ) {
                gameOver();
            }
        });
    };
  
    
  
    const gameLoop = () => {
        const time = 10;
    
        updateKilometers(speed, time);
        moveBots();
        checkCollisions();
    };
  
    const startGame = () => {
        createPlayer();
        createBot();
    
        botInterval = setInterval(() => {
            createBot();
        }, botRespawnDistance);
    
        document.addEventListener("keydown", changeDirection);
    
        setInterval(gameLoop, 10);
    };
  
    startGame();
});
