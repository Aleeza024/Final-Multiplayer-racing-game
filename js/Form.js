class Form {
  constructor() {
    this.input = createInput("").attribute("createInputplaceholder", " Enter your name")
    this.button = createButton("Play")
    this.titleImage = createImg("./assets/title.png", "gameTitle")
    this.greeting = createElement("h1")
    this.ResetTitleButton = createElement("h2")
    this.ResetButton = createButton(" ") 
  }


  SetPosition() {
    this.input.position(width / 2 - 100, height / 2 - 80)
    this.button.position(width / 2 - 80, height / 2 - 20)
    this.titleImage.position(width / 4 - 200, height / 2 - 300)
    this.greeting.position(width / 2 - 150, height / 2 - 100)
    this.ResetButton.position(1000,100)
    //this.ResetTitleButton.html("Reset Button")
    //this.ResetTitleButoon.position(1000,50)
  }
  setStyle() {
    this.input.class("customInput")
    this.button.class("customButton")
    this.titleImage.class("gameTitle")
    this.greeting.class("greeting")
    this.ResetButton.class("resetButton")
    this.ResetTitleButton.class("greeting")
  }
  myhide() {
    this.input.hide()
    this.button.hide()
    this.greeting.hide()
  }
  handlemousePressed() {
    this.button.mousePressed(() => {
      this.input.hide()
      this.button.hide()
      var message = `Hello ${this.input.value()}
    <br/> wait for another player to join`
      this.greeting.html(message)
      myplayerCount += 1
      player.updateCount(myplayerCount)
      player.name= this.input.value()
      player.index= myplayerCount
      player.addPlayers()
      player.getPlayerDistance()
      
    })


  }
handleResetButtonPressed(){
  this.ResetButton.mousePressed(() => {
  database.ref("/").update({
    GameState: 0,
    PlayerCount: 0,
    players:{},
    CarsAtEnd: 0
  })
  window.location.reload()

  })
}
  display() {
    this.SetPosition()
    this.setStyle()
    this.handlemousePressed()
    this.handleResetButtonPressed()
  }
}
