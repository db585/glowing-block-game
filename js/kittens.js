// This sectin contains some game constants. It is not super interesting
let GAME_WIDTH = 450
let GAME_HEIGHT = 550

// Enemy parameters
let ENEMY_WIDTH = 75
let ENEMY_HEIGHT = 150
let MAX_ENEMIES = 4
let ENEMY_SPEED_ADDEND = 0
// *db* Speed direction array for enemies
const enemySpeedDirection = Array.apply(null, { length: GAME_WIDTH / ENEMY_WIDTH }).map(x => 1)

let PLAYER_WIDTH = 75
let PLAYER_HEIGHT = 55

// These two constants keep us from using "magic numbers" in our code
const LEFT_ARROW_CODE = 37
const RIGHT_ARROW_CODE = 39
const UP_ARROW_CODE = 38
const DOWN_ARROW_CODE = 40
const NEVERDIE_CODE = 68
const CHANGE_DIRECTION_0 = 81
const CHANGE_DIRECTION_1 = 87
const CHANGE_DIRECTION_2 = 69
const CHANGE_DIRECTION_3 = 82
const CHANGE_DIRECTION_4 = 84
const CHANGE_DIRECTION_5 = 89

// These two constants allow us to DRY
const MOVE_LEFT = 'left'
const MOVE_RIGHT = 'right'
const MOVE_UP = 'up'
const MOVE_DOWN = 'down'

// Timeperiod for update
let timePeriodForUpdate = 0
let UPDATE_TIME_LIMIT = 10000

// HTML selectors
const appDiv = document.getElementById('app')
const bodyPage = document.querySelector('body')
// declare as global to acces to it from different context
let restartBtn

// Initial styling body to zero
bodyPage.style.margin = 0
appDiv.style.margin = 0
document.querySelector('html').style.margin = 0
// NOTE:
// No element will NOT render out of appDiv
// Solution for annoying div at the botton of the game by Ziad
// It's important to have all those settings together to get the result.
appDiv.style.width = GAME_WIDTH + 'px'
appDiv.style.height = GAME_HEIGHT + 'px'
appDiv.style.overflow = 'hidden'
appDiv.style.position = 'relative'

// Preload game images
let imageFilenames = ['enemy.png', 'stars.png', 'player.png']
let images = {}

imageFilenames.forEach(function (imgName) {
  let img = document.createElement('img')
  img.src = 'images/' + imgName
  images[imgName] = img
})

let textForDivs = [
  '[].forEach()',
  'arr.some()',
  'arr.every',
  'f.bind(this)',
  'constructor()',
  'super()',
  'let',
  'const'
]

// This section is where you will be doing most of your coding

// Super class for Player and Enemy classes
// DONE:
class Entity {
  render (ctx) {
    this.domElement.style.left = this.x + 'px'
    this.domElement.style.top = this.y + 'px'
  }
}
class Enemy extends Entity {
  constructor (root, xPos) {
    super()
    // *db* Setting speed direction
    // Choosing from enemySpeedDirection slot number equals to slot we are generating now
    let direction = enemySpeedDirection.filter((x, i) => {
      return i === xPos / ENEMY_WIDTH
    })[0]

    this.root = root
    this.x = xPos
    this.y = direction === 1 ? -ENEMY_HEIGHT : GAME_HEIGHT
    // if (this.y === undefined) {
    //   // debugger
    // }
    this.direction = direction
    let div = document.createElement('div')
    div.src = 'images/enemy.png'

    div.style.borderRadius = '5px'
    div.style.position = 'absolute'
    div.style.left = this.x + 'px'
    div.style.top = this.y + 'px'
    div.style.width = ENEMY_WIDTH + 'px'
    div.style.height = ENEMY_HEIGHT + 'px'
    div.style.background = '#7ce0c3'
    div.style.color = '#e660f7'
    div.style.fontSize = '1.5em'
    div.style.writingMode = 'vertical-rl'
    div.style.textAlign = 'center'
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.justifyContent = 'center'
    let divInside = document.createElement('div')
    // span.style.verticalAlign = 'middle'
    // divInside.style.margin = 'auto'
    // divInside.style.display = 'static'
    // divInside.style.top = '50px'
    divInside.innerText = textForDivs[Math.floor(Math.random() * textForDivs.length + 1)]
    div.appendChild(divInside)

    // div.innerText = textForDivs[Math.floor(Math.random() * textForDivs.length)]

    div.style.zIndex = '5'
    root.appendChild(div)

    this.domElement = div
    // Each enemy should have a different speed
    // this.speed = Math.random() / 2 + 0.25

    this.speed = (Math.random() / 4 + ENEMY_SPEED_ADDEND) * direction
  }

  update (timeDiff, index) {
    // Update direction with enemySpeedDirection
    if (this.direction !== enemySpeedDirection[index]) {
      // console.log(this.direction, enemySpeedDirection[index])
      this.speed = Math.abs(this.speed) * enemySpeedDirection[index]
      this.direction = enemySpeedDirection[index]
    }

    timePeriodForUpdate += timeDiff
    if (timePeriodForUpdate > UPDATE_TIME_LIMIT) {
      // console.log(this.direction, enemySpeedDirection[index], timeDiff)
      timePeriodForUpdate = 0
    }

    // Update position
    this.y = this.y + timeDiff * this.speed
  }

  render (ctx) {
    this.domElement.style.left = this.x + 'px'
    this.domElement.style.top = this.y + 'px'
  }

  destroy () {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement)
  }
}

class Player extends Entity {
  constructor (root) {
    super()
    this.root = root
    // this.x = 2 * PLAYER_WIDTH
    // Position to down left corner
    this.x = 0
    this.y = GAME_HEIGHT - PLAYER_HEIGHT
    // this.y = GAME_HEIGHT - PLAYER_HEIGHT - 10

    let img = document.createElement('img')
    img.src = 'images/player.png'
    img.style.position = 'absolute'
    img.style.left = this.x + 'px'
    img.style.top = this.y + 'px'
    img.style.zIndex = '8'
    img.style.borderRadius = '5px'

    root.appendChild(img)

    this.domElement = img
  }

  // This method is called by the game engine when left/right arrows are pressed
  move (direction) {
    if (direction === MOVE_LEFT && this.x > 0) {
      this.x = this.x - PLAYER_WIDTH
    } else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_WIDTH) {
      this.x = this.x + PLAYER_WIDTH
    } else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT - PLAYER_HEIGHT - 2) { // *db*
      this.y = this.y + PLAYER_HEIGHT
    } else if (direction === MOVE_UP && this.y > 0) {
      this.y = this.y - PLAYER_HEIGHT
    }
  }

  // render (ctx) {
  //   this.domElement.style.left = this.x + 'px'
  //   this.domElement.style.top = this.y + 'px'
  // }
}

class Text {
  constructor (root, xPos, yPos) {
    this.root = root

    let span = document.createElement('span')
    span.style.position = 'absolute'
    span.style.left = xPos + 'px'
    span.style.top = yPos + 'px'
    span.style.zIndex = '10'
    span.style.color = 'beige'
    span.style.font = 'bold 30px Impact'

    root.appendChild(span)
    this.domElement = span

    this.update = this.update.bind(this)
  }

  // This method is called by the game engine when left/right arrows are pressed
  update (txt) {
    this.domElement.innerText = txt
  }
}

// super class for Buttons
class Button {
  constructor (root, xPos, yPos, text) {
    this.root = root

    let button = document.createElement('button')
    button.innerText = text
    button.style.position = 'absolute'
    button.style.left = xPos + 'px'
    button.style.top = yPos + 'px'
    button.style.zIndex = 10
    root.appendChild(button)
    this.domElement = button
  }
}

class RestartButton extends Button {
  constructor (root, xPos, yPos) {
    super(root, xPos, yPos, 'RESTART')

    let btn = this.domElement
    // btn.innerText = 'RESTART'
    btn.style.fontSize = '2em'
    btn.style.zIndex = 10
    btn.style.color = 'beige'
    btn.style.background = 'brown'
    btn.style.border = '2px solid beige'
    btn.style.borderRadius = '10px'
    // this.domElement.style.font = 'bold 30px Impact'
  }

  destroy () {
    this.root.removeChild(this.domElement)
  }
}
class LevelButton extends Button {
  constructor (root, xPos, yPos, text) {
    super(root, xPos, yPos, text)

    let btn = this.domElement

    // Attach to parent element because we use grid
    btn.style.position = 'static'
    btn.style.fontSize = '2em'
    btn.style.zIndex = 10
    btn.style.color = 'beige'
    btn.style.background = '#003366'
    btn.style.border = '2px solid beige'
    btn.style.borderRadius = '5px'
    // this.domElement.style.font = 'bold 30px Impact'
  }

  destroy () {
    this.root.removeChild(this.domElement)
  }
}

// Set difficulty level
class Level {
  constructor () {
    // Setup backgound
    let bg = document.createElement('img')
    // *db*
    // bg.src = 'images/stars.png'
    bg.style.backgroundColor = '#333'
    bg.id = 'bgImg'
    bg.style.position = 'absolute'
    bg.style.height = GAME_HEIGHT + 'px'
    bg.style.width = GAME_WIDTH + 'px'
    appDiv.append(bg)

    // Setup div for buttons
    let levDiv = document.createElement('div')
    levDiv.style.position = 'absolute'
    levDiv.style.display = 'grid'
    levDiv.style.gridTemplate = '1fr/ repeat(7, 1fr)'
    // levDiv.style.justifyContent = 'center'
    levDiv.style.width = GAME_WIDTH + 'px'
    levDiv.style.height = '2em'
    levDiv.style.top = '300px'
    appDiv.appendChild(levDiv)
    this.levDiv = levDiv

    // Bind methods to Level class
    this.setLevel = this.setLevel.bind(this)
  }
  setButtons () {
    let levels = [
      { difficulty: 'LOUNGE',
        column: 2 },
      { difficulty: 'NORM',
        column: 4 },
      { difficulty: 'WAKATA',
        column: 6 }
    ]
    this.levelBtns = []
    levels.forEach(el => {
      let btn = new LevelButton(this.levDiv, '', '', el.difficulty)
      btn.domElement.style.gridColumn = el.column
      btn.domElement.addEventListener('click', this.setLevel)
      this.levelBtns.push(btn)
    })
  }

  setLevel (e) {
    switch (e.target.innerText) {
      default: // EASY/ LOUNGE level
        MAX_ENEMIES = 2
        ENEMY_SPEED_ADDEND = 0
        break
      case 'NORM':
        MAX_ENEMIES = 3
        ENEMY_SPEED_ADDEND = 0.1
        break
      case 'WAKATA':
        MAX_ENEMIES = 4
        ENEMY_SPEED_ADDEND = 0.25
    }

    // Remove level buttons and parent div of them
    this.levelBtns.forEach(el => this.levDiv.removeChild(el.domElement))
    appDiv.removeChild(this.levDiv)

    // Start the game
    let gameEngine = new Engine(appDiv)
    gameEngine.start()
  }
}

class Sound {
  constructor (src) {
    let sound = document.createElement('audio')
    sound.src = src
    sound.setAttribute('preload', 'auto')
    sound.setAttribute('controls', 'none')
    sound.style.display = 'none'
    bodyPage.appendChild(sound)
    this.domElement = sound

    // Binding methods to Sound class context
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  play () {
    this.domElement.play()
  }

  pause () {
    this.domElement.pause()
  }
}
/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
*/
class Engine {
  constructor (element) {
    this.root = element
    // Setup the player
    this.player = new Player(this.root)
    this.info = new Text(this.root, 5, 0)
    this.livesBanner = new Text(this.root, GAME_WIDTH - 30, 0)
    this.livesBanner.update(this.lives)
    this.lastRoundWin = true

    // Setup enemies, making sure there are always three
    this.setupEnemies()

    // Put a white div at the bottom so that enemies seem like they dissappear
    // let whiteBox = document.createElement('div')
    // whiteBox.style.zIndex = 100
    // whiteBox.style.position = 'absolute'
    // whiteBox.style.top = GAME_HEIGHT + 'px'
    // whiteBox.style.height = ENEMY_HEIGHT + 'px'
    // whiteBox.style.width = GAME_WIDTH + 'px'
    // whiteBox.style.background = 'white'
    // // whiteBox.style.display = 'none'
    // this.root.append(whiteBox)

    // Since gameLoop will be called out of context, bind it once here.
    this.gameLoop = this.gameLoop.bind(this)
    this.restart = this.restart.bind(this)
  }

  /*
    The game allows for 5 horizontal slots where an enemy can be present.
    At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
  setupEnemies () {
    if (!this.enemies) {
      this.enemies = []
    }

    while (
      this.enemies.filter(function () {
        return true
      }).length < MAX_ENEMIES
    ) {
      this.addEnemy()
    }
  }

  // This method finds a random spot where there is no enemy, and puts one in there
  addEnemy () {
    let enemySpots = GAME_WIDTH / ENEMY_WIDTH

    let enemySpot

    // // Commengted old code with bug where enemies can NOT be places in 0 slot.
    // while (!enemySpot || this.enemies[enemySpot]) {
    //   enemySpot = Math.floor(Math.random() * enemySpots)
    //   // if (enemySpot === 0) {
    //   //   // debugger
    //   // }
    // }
    // debugger
    // Keep looping until we find a free enemy spot at random
    // DONE:
    while (typeof (obj) === 'number' || this.enemies[enemySpot]) {
      enemySpot = Math.floor(Math.random() * enemySpots)
      // if (enemySpot === 0) {
      //   // debugger
      // }
    }

    this.enemies[enemySpot] = new Enemy(this.root, enemySpot * ENEMY_WIDTH)
  }

  // This method kicks off the game
  start () {
    this.score = 0

    // *db* set lives max
    this.lives = 2
    this.livesBanner.update(this.lives)

    // *db* Never die flag
    this.isNotNeverDie = true

    this.lastFrame = Date.now()
    let keydownHandler = function (e) {
      // console.log(e)
      // debugger
      if (e.keyCode === LEFT_ARROW_CODE) {
        this.player.move(MOVE_LEFT)
      } else if (e.keyCode === RIGHT_ARROW_CODE) {
        this.player.move(MOVE_RIGHT)
      } else if (e.keyCode === UP_ARROW_CODE) {
        this.player.move(MOVE_UP)
      } else if (e.keyCode === DOWN_ARROW_CODE) {
        this.player.move(MOVE_DOWN)
      } else if (e.keyCode === NEVERDIE_CODE) {
        this.isNotNeverDie = !this.isNotNeverDie
      } else if (e.keyCode === CHANGE_DIRECTION_0) {
        enemySpeedDirection[0] = enemySpeedDirection[0] === 1 ? -1 : 1
      } else if (e.keyCode === CHANGE_DIRECTION_1) {
        enemySpeedDirection[1] = enemySpeedDirection[1] === 1 ? -1 : 1
      } else if (e.keyCode === CHANGE_DIRECTION_2) {
        enemySpeedDirection[2] = enemySpeedDirection[2] === 1 ? -1 : 1
      } else if (e.keyCode === CHANGE_DIRECTION_3) {
        enemySpeedDirection[3] = enemySpeedDirection[3] === 1 ? -1 : 1
      } else if (e.keyCode === CHANGE_DIRECTION_4) {
        enemySpeedDirection[4] = enemySpeedDirection[4] === 1 ? -1 : 1
      } else if (e.keyCode === CHANGE_DIRECTION_5) {
        enemySpeedDirection[5] = enemySpeedDirection[5] === 1 ? -1 : 1
      }
    }
    keydownHandler = keydownHandler.bind(this)

    // Listen for keyboard left/right and update the player
    document.addEventListener('keydown', keydownHandler)

    this.gameLoop()
  }

  restart () {
    // *db* Remove restart buttom
    restartBtn.destroy()

    if (this.lastRoundWin === true) {
      this.root.removeChild(document.querySelector('#winSetMsg'))
      this.livesBanner.update(this.lives)
    } else {
      this.score = 0
    }
    // Uncover image by background
    document.querySelector('#bgImg').style.zIndex = '0'
    document.querySelector('#bgImg').style.opacity = '1'
    // *db* remove enemies from DOM and clear enemies array
    this.enemies.forEach((enemy) => {
      enemy.destroy()
    })
    this.enemies = []

    // Set score to zero and start time to Now

    this.lastFrame = Date.now()

    // place player at the start position
    // this.player.x = 2 * PLAYER_WIDTH
    this.player.x = 0
    this.player.y = 9 * PLAYER_HEIGHT

    // Run
    this.gameLoop()
  }

  overlap (enemy) {
    let rect1 = {
      left: this.player.x,
      right: this.player.x + PLAYER_WIDTH,
      bottom: this.player.y + PLAYER_HEIGHT,
      top: this.player.y
    }
    let rect2 = {
      left: enemy.x,
      right: enemy.x + ENEMY_WIDTH,
      bottom: enemy.y + ENEMY_HEIGHT,
      top: enemy.y
    }
    // Check overlape positons. One of the conditions should be true
    // them NO overlaping. When all of them are false overlap returns true
    if (rect1.right <= rect2.left ||
        rect1.left >= rect2.right ||
        rect1.bottom <= rect2.top ||
        rect1.top >= rect2.bottom) {
      return false

      // (a.left >= b.right || a.top >= b.bottom ||
      //   a.right <= b.left || a.bottom <= b.top)
    }
    return true
  }

  /*
    This is the core of the game engine. The `gameLoop` function gets called ~60 times per second
    During each execution of the function, we will update the positions of all game entities
    It's also at this point that we will check for any collisions between the game entities
    Collisions will often indicate either a player death or an enemy kill

    In order to allow the game objects to self-determine their behaviors, gameLoop will call the `update` method of each entity
    To account for the fact that we don't always have 60 frames per second, gameLoop will send a time delta argument to `update`
    You should use this parameter to scale your update appropriately
     */
  gameLoop () {
    // Check how long it's been since last frame
    let currentFrame = Date.now()
    let timeDiff = currentFrame - this.lastFrame

    // Increase the score!
    this.score += timeDiff

    // Call update on all enemies
    this.enemies.forEach(function (enemy, index) {
      enemy.update(timeDiff, index)
    })

    // Draw everything!
    // this.ctx.drawImage(images["stars.png"], 0, 0); // draw the star bg
    let renderEnemy = function (enemy) {
      enemy.render(this.ctx)
    }
    renderEnemy = renderEnemy.bind(this)
    this.enemies.forEach(renderEnemy) // draw the enemies
    this.player.render(this.ctx) // draw the player

    // Check if any enemies should die
    this.enemies.forEach((enemy, enemyIdx) => {
      // Kill enemies on bottom and top
      if (enemy.y > GAME_HEIGHT || enemy.y < -ENEMY_HEIGHT - 10) {
        this.enemies[enemyIdx].destroy()
        delete this.enemies[enemyIdx]
      }
    })
    this.setupEnemies()

    // Check if player is dead
    // debugger
    if (this.isPlayerDead()) {
      // Reduce lives
      this.lives--
      this.livesBanner.update(this.lives)

      // Check for lives
      if (this.lives === 0) {
        // If they are dead, then it's game over!
        this.info.update(this.score + ' GAME OVER')

        if (this.score > 1000) {
          (new Text(this.root, GAME_WIDTH / 2 - 100, GAME_HEIGHT / 2 - 43)).update('You Are in TOP 100')
        }

        // Cover image by background
        document.querySelector('#bgImg').style.zIndex = '9'
        document.querySelector('#bgImg').style.opacity = '0.9'
      } else {
        // Set flag to true to analyse in this.restart()
        this.lastRoundWin = false
        // Print restart button
        restartBtn = new RestartButton(appDiv,
          GAME_WIDTH / 2 - 70,
          GAME_HEIGHT / 2 - 43)

        restartBtn.domElement.addEventListener('click', this.restart)
      }
    } else if (this.player.x === GAME_WIDTH - PLAYER_WIDTH && this.player.y === 0) {
      this.lives++
      // Set flag to true to analyse in this.restart()
      this.lastRoundWin = true
      // debugger
      // FIXME: err thrown gameloop can't call this.livesBanner.update
      // this.livesBanner.update(this.lives)
      let winMsg = new Text(this.root, GAME_WIDTH / 2 - 140, GAME_HEIGHT / 3 - 43)
      winMsg.domElement.id = 'winSetMsg'
      winMsg.update('You Gain One More Life!!')

      // Print restart button
      restartBtn = new RestartButton(appDiv,
        GAME_WIDTH / 2 - 70,
        GAME_HEIGHT / 2 - 43)
      restartBtn.domElement.innerText = 'FORWARD'

      restartBtn.domElement.addEventListener('click', this.restart)
    } else {
      // If player is not dead, then draw the score
      this.info.update(this.score)

      // Set the time marker and redraw
      this.lastFrame = Date.now()
      setTimeout(this.gameLoop, 20)
    }
  }

  isPlayerDead () {
    // DONE: fix this function!
    // debugger
    // console.log()
    return this.enemies.some((enemy, enemyIdx) => {
      if (this.overlap(enemy) && this.isNotNeverDie) {
        return true
      }
      // *db* simple check for overlaping without moving player up and down
      // if (enemy.y + ENEMY_HEIGHT >= this.player.y && enemy.x === this.player.x) {
      //   // debugger
      //   // console.log('overlaped')
      //   return true
      // }
    })
    // return false
  }
}

// Start background music
// FIXME: uncomment for production
let backMusic = new Sound('./snd/XavierTheHollow.mp3')
backMusic.play()
// debug purpose only
// setTimeout(backMusic.pause, 10000)

// Set difficulty level and start the game
let level = new Level()
level.setButtons()

// *db* old version to call Engine.start
// let gameEngine = new Engine(appDiv)
// gameEngine.start()
