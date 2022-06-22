class Game {
  constructor() {
    this.leaderboard = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false
    this.leftActiveKey = false
  }


  getState() {
    var stateRoot = database.ref("GameState")
    stateRoot.on("value", function (data) {
      mygameState = data.val()
    })
  }
  updateState(state) {
    database.ref("/").update({
      GameState: state
    })

  }

  // GameState= 0
  start() {
    form = new Form()
    form.display()
    player = new Player()
    myplayerCount = player.getCount()

    car1 = createSprite(width / 2 - 100, height / 2 + 250)
    car1.addImage("car1", car1Img)
    car1.addImage("Blast", blastImg)
    car1.scale = 0.07

    car2 = createSprite(width / 2 + 100, height / 2 + 250)
    car2.addImage("car2", car2Img)
    car2.addImage("Blast", blastImg)
    car2.scale = 0.07

    cars = [car1, car2]

    fuelgroups = new Group()
    coinsgroups = new Group()
    obstacleGroup1 = new Group()
    obstacleGroup2 = new Group()


    // fuels
    this.addSprites(fuelgroups, 40, fuelImage, 0.02)
    // coins
    this.addSprites(coinsgroups, 40, coinImage, 0.05)
    // obstacle 1
    this.addSprites(obstacleGroup1, 15, obstacle1Img, 0.03)
    // obstacle 2
    this.addSprites(obstacleGroup2, 10, obstacle2Img, 0.03)
  }

  addSprites(spriteGroup, numberSprites, spriteImage, spritescale) {
    for (var i = 0; i < numberSprites; i += 1) {
      var x, y
      x = random(width / 2 + 150, width / 2 - 150)
      y = random(-height * 5, height - 400)

      var sprite = createSprite(x, y)
      sprite.addImage(spriteImage)
      sprite.scale = spritescale

      spriteGroup.add(sprite)

    }

  }
  // GameState= 1
  play() {
    form.myhide()
    form.titleImage.position(40, 50)
    form.titleImage.class("ToEnterPlay")
    this.handleElement()
    Player.GetPlayerInfo()

    player.GetCarsAtEnd()
    console.log(player.rank)
    if (allPlayers !== undefined) {
      image(trackImg, 0, -height * 5, width, height * 6)
      this.showLeaderBoard()
      this.showlifebar()
      this.showfuelbar()
      // for loop to get individual player index, i is individual value in allPlayers
      var index = 0
      for (var i in allPlayers) {
        //    console.log(i)

        //increasing index
        index = index + 1

        var x = allPlayers[i].positionX
        var y = height - allPlayers[i].positionY

        // index 1 = index-1 = 1-1 = 0 = car1
        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        // changing animation to blast when lifetime is at zero
        var currentLife = allPlayers[i].life
        if (currentLife <= 0) {
          cars[index -1].changeImage("Blast", blastImg)
          cars[index - 1].scale = 0.3
        }
        //adding camera to move player

        if (index === player.index) {
          stroke("blue")
          strokeWeight(3)
          fill("black")
          ellipse(x, y, 70, 70)

          // camera.position.x = cars[index - 1].position.x
          camera.position.y = cars[index - 1].position.y


          this.handleCoins(index)
          this.handleFuels(index)
          this.handleCollision(index)
        }


      }
      this.handlePlayerControls()
      const finishLine = height * 6 - 100
      if (player.positionY > finishLine) {
        player.rank += 1
        Player.updateCarsAtEnd(player.rank)
        player.updatePlayerInfo()
        mygameState = 2
        this.showRank()

      }
      drawSprites()
    }

  }
  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 40
      player.updatePlayerInfo()
      this.playerMoving = true
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 10
      this.leftActiveKey = true
      player.updatePlayerInfo()
      this.playerMoving = true
    }
    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 3 + 500) {
      player.positionX += 10
      this.leftActiveKey = false
      player.updatePlayerInfo()
      this.playerMoving = true
    }

  }

  handleFuels(index) {
    // overlap funtion
    cars[index - 1].overlap(fuelgroups, function (collector, collected) {
      player.fuel = 180
      player.updatePlayerInfo()
      collected.remove()
    })

    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3
    }
    if (player.fuel < 0) {
      mygameState = 2
      this.gameOver()
    }
  }
  handleCoins(index) {
    cars[index - 1].overlap(coinsgroups, function (collector, collected) {
      player.score += 1
      player.life = 180
      player.updatePlayerInfo()
      collected.remove()
    })
    if (player.life && this.playerMoving) {
      player.life -= 0.3
    }
    if (player.life < 0) {
      mygameState = 2
      this.gameOver()
    }
  }



  handleElement() {
    this.leaderboard.html("LeaderBoard")
    this.leaderboard.class("resetText")
    this.leaderboard.position(width / 3 - 60, height / 4 - 100)
    this.leader1.class("leadersText")
    this.leader1.position(width / 3 - 50, height / 4 - 80)
    this.leader2.class("leadersText")
    this.leader2.position(width / 3 - 50, height / 4 - 60)
  }

  showLeaderBoard() {
    var Myleader1, Myleader2
    var players = Object.values(allPlayers)
    if ((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1) {
      Myleader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      Myleader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
    }
    if (players[1].rank === 1) {
      Myleader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
      Myleader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
    }

    this.leader1.html(Myleader1)
    this.leader2.html(Myleader2)
  }
  showRank() {
    swal({
      title: `Awesome Rank ${player.rank}\nScore ${player.score}`,
      text: "You won the game",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      ConfirmButtonText: "Ok"
    })
  }

  showlifebar() {
    push()
    image(lifeImage, width / 2 - 130, height - player.positionY - 100, 20, 20)
    fill("white")
    rect(width / 2 - 100, height - player.positionY - 100, 180, 20)
    fill("yellow")
    rect(width / 2 - 100, height - player.positionY - 100, player.life, 20)
    pop()
  }
  showfuelbar() {
    push()
    image(fuelImage, width / 2 - 130, height - player.positionY - 150, 20, 20)
    fill("white")
    rect(width / 2 - 100, height - player.positionY - 150, 180, 20)
    fill("green")
    rect(width / 2 - 100, height - player.positionY - 150, player.fuel, 20)
    pop()
  }
  gameOver() {
    swal({
      title: `Better luck next time! \nScore ${player.score}`,
      text: "You lost the game",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      ConfirmButtonText: "Thank you"
    })
  }
  // GameState= 2
  end() {

  }



  handleCollision(index) {
    if (cars[index - 1].collide(obstacleGroup1) || cars[index - 1].collide(obstacleGroup2)) {
      if (this.leftActiveKey) {
        player.positionX += 100
      }
      else {
        player.positionX -= 100
      }

      if (player.life > 0) {
        player.life -= 180 / 4
      }
      player.updatePlayerInfo()
    }
  }
}
