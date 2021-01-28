class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage(car1Img);
    car2 = createSprite(300,200);
    car2.addImage(car2Img);
    car3 = createSprite(500,200);
    car3.addImage(car3Img);
    car4 = createSprite(700,200);
    car4.addImage(car4Img);

    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    
    player.getFinishedPlayers();

    if(allPlayers !== undefined){
      //var display_position = 100;
      background(rgb(198,135,103));
      image(track,0,-displayHeight*4,displayWidth,displayHeight*5);
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 0;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 270;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          fill("blue");
          stroke(4);
          ellipse(x,y,70,70);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null && passed===false){
      player.distance +=50
      player.update();
    }

    if(player.distance>4280 && passed===false){
      passed = true;
      Player.updateFinishedPlayers();
      player.rank = finishedPlayers
      player.update();
    }

    drawSprites();
  }

  end(){
    Player.getPlayerInfo();
    for(var plr in allPlayers){
      textSize(35)
      if(allPlayers[plr].rank===1){
        fill("blue");
        text("First place goes to: "+allPlayers[plr].name,displayWidth/2,200);
      }
      if(allPlayers[plr].rank===2){
        fill("green");
        text("Second place goes to: "+allPlayers[plr].name,displayWidth/2,270);
      }
      if(allPlayers[plr].rank===3){
        fill("yellow")
        text("Third place goes to: "+allPlayers[plr].name,displayWidth/2,340);
      }
      if(allPlayers[plr].rank===4){
        fill("red")
        text("The loser is: "+allPlayers[plr].name,displayWidth/2,410);
      }
    }
  }
}
