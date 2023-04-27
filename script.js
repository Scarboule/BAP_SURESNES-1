// Constants
const GAME_DURATION = 20; // seconds
const OBJECT_FALL_SPEED = 1; // pixels per frame
const OBJECT_SPAWN_DELAY = 800; // milliseconds
const OBJECT_SPAWN_PROBABILITY = 0.7; // probability of a new object spawning on each frame
const OBJECT_POINTS = 10; // points awarded for catching a collectible object
const OBJECT_PENALTY_POINTS = 20; // points deducted for catching a dangerous object
const OBJECT_SIZE = 50;
const GAME_HEIGHT = 600; // Change the value as needed
const BUCKET_HEIGHT = 50;
const BUCKET_TOP = GAME_HEIGHT - BUCKET_HEIGHT;
const fruits = ["url('image/banane.png')","url('image/cerise.png')","url('image/fraise.png')","url('image/orange.png')","url('image/poire.png')","url('image/pomme.png')"]
const fruitsnul = ["url('image/burger.png')","url('image/donut.png')","url('image/frite.png')","url('image/sandwich.png')"]


// Game variables
let score = 0;
let objects = [];
let lastSpawnTime = 0;
let gameStartTime = null;
let gameTimer = null;

let isStarted = false;

// DOM elements
const scoreEl = document.getElementById('score');
const bucketEl = document.getElementById('bucket');
const spawn = document.getElementById("spawn-container")
const result = document.getElementById("Result")
const objectsContainerEl = document.getElementById('objects-container');
const gameOverlay = document.querySelector('.game-overlay');
const game = document.getElementById('game-container');
const BODY = document.querySelector("body");
let gameMargin = BODY.offsetWidth - game.offsetWidth;


// Event listeners
// bucketEl.addEventListener('mousedown', startMoveBucket);
// bucketEl.addEventListener('touchstart', startMoveBucket, { passive: false });
// document.addEventListener('mouseup', stopMoveBucket);
// document.addEventListener('touchend', stopMoveBucket);

// Functions



// function startMoveBucket(e) {
//   e.preventDefault();
//   bucketEl.classList.add('moving');
//   document.addEventListener('mousemove', moveBucket);
//   document.addEventListener('touchmove', moveBucket, { passive: false });
// }

// function stopMoveBucket() {
//   bucketEl.classList.remove('moving');
//   document.removeEventListener('mousemove', moveBucket);
//   document.removeEventListener('touchmove', moveBucket);
// }

// function moveBucket(e) {
//   e.preventDefault();
//   const containerRect = objectsContainerEl.getBoundingClientRect();
//   const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
//   const relX = x - containerRect.left;
//   const bucketWidth = bucketEl.offsetWidth;
//   const maxLeft = containerRect.width - bucketWidth + gameMargin; // Nouvelle valeur pour définir la position maximale à gauche
//   const left = Math.min(Math.max(relX - bucketWidth / 2, 0), maxLeft); // Utiliser Math.min() et Math.max() pour limiter la position gauche du seau
//   bucketEl.style.left = `${left}px`;
// }
/*function moveBucket(e) {
  e.preventDefault();
  const containerRect = objectsContainerEl.getBoundingClientRect();
  const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const relX = x - containerRect.left;
  bucketEl.style.left = `${Math.max(Math.min(relX - bucketEl.offsetWidth / 2, containerRect.width - bucketEl.offsetWidth), 0)}px`;
}*/

game.addEventListener('mousemove', (e) => {
  let borderGame = game.getBoundingClientRect();

  bucketEl.style.left = `calc(${e.clientX - 50}px - 10vw)`;

  if (e.clientX < borderGame.left + 50) {
    bucketEl.style.left = `0px`;
  }
  if (e.clientX > borderGame.right - 50) {
    bucketEl.style.left = `calc(${borderGame.right - 100}px - 10vw)`;
  }
})


function spawnObject() {
  const object = document.createElement('div');
  object.classList.add('object');
  if (Math.random() < OBJECT_SPAWN_PROBABILITY) {
    object.classList.add('collectible');
    object.style.backgroundImage = fruits[Math.floor(Math.random() * fruits.length)]
  } else {
    object.classList.add('dangerous');
    object.style.backgroundImage = fruitsnul[Math.floor(Math.random() * fruitsnul.length)]

  }
  object.style.top = '-50px';

  object.style.left = `${Math.floor(Math.random() * (spawn.offsetWidth - 60))}px`;
  objectsContainerEl.appendChild(object);
  objects.push(object);
  lastSpawnTime = Date.now();
}

function updateImage() {
  if (score >= 50) {
    bucketEl.style.backgroundImage = "url(image/panier_pomme.png)";
  } else {
    //console.log("pas cool")
    bucketEl.style.backgroundImage = "url(image/Panier.png)";
  }
}

function removeObject(object) {
  object.remove();
  objects.splice(objects.indexOf(object), 1);
}

function handleObjectFall() {
  // Loop through all objects and update their position
  bucketcollide = bucketEl.getBoundingClientRect();
  objects.forEach((obj) => {
    actualheight = parseFloat(obj.style.top)
    obj.style.top = actualheight + OBJECT_FALL_SPEED + "px";


    objcollide = obj.getBoundingClientRect();
    // Check for collision with bucket
    if (bucketcollide.bottom >= objcollide.bottom && bucketcollide.top <= objcollide.top) {
      if (bucketcollide.left <= objcollide.left && bucketcollide.right >= objcollide.right) {
        // Deduct score and remove object
        if (obj.classList.contains("collectible")) {
          score += OBJECT_POINTS;

        }
        else {
          score -= OBJECT_PENALTY_POINTS
        }

        updateImage();
        scoreEl.textContent = score;
        objectsContainerEl.removeChild(obj);
      }
    }

    // Remove object if it goes below the screen
    if (objcollide.bottom > GAME_HEIGHT) {
      objectsContainerEl.removeChild(obj);
    }
  });
}

function handleGameEnd() {
  clearInterval(gameTimer);
  spawn.style.display = "None"
  result.style.display = "Block"
  generateCode();
  gameEndCloseTimer();
}


function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
  const remainingSeconds = GAME_DURATION - elapsedSeconds;
  if (remainingSeconds <= 0) {
    handleGameEnd();
  } else {
    document.getElementById('timer').textContent = remainingSeconds;
  }
}
function stopGame() {
  clearInterval(gameTimer);
  isStarted = false;
}
function startGame() {
  spawn.style.display = "Block"
  result.style.display = "None"
  var scrollTopValue = window.pageYOffset || document.documentElement.scrollTop;
  gameOverlay.style.top = scrollTopValue + "px";
  gameOverlay.classList.toggle("hidd");
  console.log("cool")
  isStarted = true;
  // Reset game variables
  updateImage();
  score = 0;
  objects = [];
  lastSpawnTime = 0;
  gameStartTime = null;

  // Clear objects container
  while (objectsContainerEl.firstChild) {
    objectsContainerEl.removeChild(objectsContainerEl.firstChild);
  }

  // Set up initial score and timer display
  scoreEl.textContent = score;
  document.getElementById('timer').textContent = GAME_DURATION;



  // Start game loop
  gameTimer = setInterval(() => {
    if (!gameStartTime) {
      gameStartTime = Date.now();
    }
    if (Date.now() - lastSpawnTime > OBJECT_SPAWN_DELAY) {
      spawnObject();
    }
    handleObjectFall();
    updateTimer();
  }, 1); // frames per second
}


function generateCode() {
  code = ""
  listcharacter = ['A', "B"];
  for (i = 0; i < 4; i++) {
    code += listcharacter[Math.floor(Math.random() * listcharacter.length)]
  }
  document.getElementById('promocode').textContent = code
}

const wincodes = ['AAAA', "BBBB", "ABAB", "BBAA", "BAAA", "BBBA", "BABA"];


function checkcode() {
  let win = false
  let textresultcode = ""
  wincodes.forEach(wincode => {
    if (code == wincode) {
      win = true
    }
  })
  const resultcode = document.createElement("p");
  if (win == true) {
    resultcode.textContent = ("you win")
  } else {
    resultcode.textContent = ("you lose")
  }
  result.appendChild(resultcode);
}

// Start the game

window.onscroll = function () {
  var scrollTopValue = window.pageYOffset || document.documentElement.scrollTop;
  gameOverlay.style.top = scrollTopValue + "px";
};

gameOverlay.addEventListener('click', () => {
  if (!isStarted) {
    gameOverlay.classList.toggle("hidd");
  }
});

async function gameEndCloseTimer() {
  await new Promise(r => setTimeout(r, 2000));
  isStarted = false;
}