var gameScreen =0;

//ball colors and props
var ballX; // change this later
var ballY;

var ballSize =20;
var ballColor;

// gravity bitch
var gravity =0.3;
var ballSpeedVert = 0;

// adding airfriciton and friction

var airfriction = 0.00001;
var friction =0.1;

// racket values and props

var racketColor;
var racketWidth = 100;
var racketHeight = 10;
var racketBounceRate =20;

// adding horizontal motion to ball

var ballSpeedHorizon =0;

// adding walls
var wallSpeed =5;
var wallvarerval =1200;
var lastAddTime =0;
var minGapHeight = 200;
var maxGapHeight =300;
var wallWidth =80;
var wallColors;
var walls = [];

// Health and Score
var maxHealth = 100;
var health =100;
var healthDecrease =1;
var healthBarWidth =60;
var score=0;

function applyGravity()
{
  ballSpeedVert+= gravity;
  ballY+= ballSpeedVert;
  ballSpeedVert-= (ballSpeedVert * airfriction);
}

function makeBounceBottom(surface)
{
  ballY= (surface - (ballSize/2));
  ballSpeedVert*=-1;
  ballSpeedVert -= (ballSpeedVert * friction);
}
function makeBounceTop(surface)
{
  ballY= (surface+ (ballSize/2));
  ballSpeedVert*=-1;
  ballSpeedVert -= (ballSpeedVert * friction);
}

function makeBounceLeft(surface)
{
  ballX = (surface + ballSize/2);
  ballSpeedHorizon*=-1;
  ballSpeedHorizon-= (ballSpeedHorizon * friction);
}
function makeBounceRight(surface)
{
  ballX = (surface - ballSize/2);
  ballSpeedHorizon*=-1;
  ballSpeedHorizon-=(ballSpeedHorizon * friction);
  
}
function keepInScreen(){
  
  if(ballX -(ballSize/2)<0)
    makeBounceLeft(0);
  if(ballX+ballSize/2 > width)
    makeBounceRight(width);
  if(ballY+(ballSize/2) > height)
    makeBounceBottom(height); 
  if(ballY - (ballSize/2)<0)
    makeBounceTop(0);
  
}

function drawBall()
{
  fill(ballColor);
  ellipse(ballX,ballY,ballSize,ballSize);
}

function drawHealthBar()
{
  noStroke();
  fill(236,240,241);
  rectMode(CENTER);
  rect(ballX -(healthBarWidth/2),ballY-30,healthBarWidth,5);
  if(health>60)
  {
    fill(46,204,113);
    
  }else if(health>30)
  {
    fill(230,126,34);
  }else
  {
    fill(231,76,60);
  }
  rectMode(CORNER);
  rect(ballX-(healthBarWidth/2), ballY - 30, healthBarWidth*(health/maxHealth), 5);

}

function decreaseHealth()
{
  health-=healthDecrease;
  if(health<=0)
  {
    gameOver();
  }
}
function printScore()
{
  textAlign(CENTER);
  fill(0);
  textSize(30); 
  text(score, height/2, 50);
}


function restart() {
  score = 0;
  health = maxHealth;
  ballX=width/4;
  ballY=height/5;
  lastAddTime = 0;
  walls=[];
  gameScreen = 1;
}





function drawracket()
{
  fill(racketColor);
  rectMode(CENTER);
  rect(mouseX,mouseY,racketWidth,racketHeight);
}



// racket motion and ball bouncing
function watchRacketBounce()
{
  var overhead = mouseY-pmouseY;
  if((ballX+ballSize/2 > mouseX - (racketWidth/2)) && (ballX - (ballSize/2) < mouseX +(racketWidth/2)))
  {
    if(dist(ballX,ballY,ballX, mouseY)<=(ballSize/2)+abs(overhead))
    {
      makeBounceBottom(mouseY);
      
      ballSpeedHorizon = (ballX -mouseX)/10;
    
    if(overhead<0)
    {
      ballY+=(overhead/2);
      ballSpeedVert+=(overhead/2);
    }
    }
  }
}
// function for walls

function wallAdder()
{
  if(millis()-lastAddTime> wallvarerval)
  {
    var randHeight = round(random(minGapHeight,maxGapHeight));
    var randY = round(random(0,height-randHeight));
    var randWall = [width,randY,wallWidth,randHeight,0];
    walls.push(randWall);
    lastAddTime = millis();
  }
}
function wallHandler()
{
  for(var i=0;i<walls.length;i++)
  {
    wallRemover(i);
    wallMover(i);
    wallDrawer(i);
    watchWallCollision(i);
  }
}


function wallDrawer(index)
{ 
  var wall = walls[index];
  var gapWallX = wall[0];
  var gapWallY = wall[1];
  var gapWallwidth = wall[2];
  var gapWallheight = wall[3];
  
  rectMode(CENTER);
  fill(wallColors);
  rect(gapWallX,0,gapWallwidth,gapWallY);
  rect(gapWallX,gapWallY+gapWallheight,gapWallwidth,height-(gapWallY+gapWallheight));
  
  
  
}

function wallMover(index)
{
  var wall = walls[index];
  wall[0]-=wallSpeed;
}

function wallRemover(index)
{
  var wall = walls[index];
  if(wall[0] + wall[2] <=0)
  {
    walls.splice(index,1);
  }
  
}

function watchWallCollision(index)
{
  var wall = walls[index];
  var gapwallX = wall[0];
  var gapwallY = wall[1];
  var gapwallwidth = wall[2];
  var gapwallheight = wall[3];
  var wallScored = wall[4];
  var wallTopX = gapwallX;
  var wallTopY =0;
  var wallTopWidth =gapwallwidth;
  var wallTopHeight =gapwallY;
  var wallBottomX= gapwallX;
  var wallBottomY =gapwallY+gapwallheight;
  var wallBottomWidth =gapwallwidth;
  var wallBottomHeight =height-(gapwallY+gapwallheight);
  
  if (
    (ballX+(ballSize/2)>wallTopX) &&
    (ballX-(ballSize/2)<wallTopX+wallTopWidth) &&
    (ballY+(ballSize/2)>wallTopY) &&
    (ballY-(ballSize/2)<wallTopY+wallTopHeight)
    ) {
    decreaseHealth();
  } 
 
   if (
    (ballX+(ballSize/2)>wallBottomX) &&
    (ballX-(ballSize/2)<wallBottomX+wallBottomWidth) &&
    (ballY+(ballSize/2)>wallBottomY) &&
    (ballY-(ballSize/2)<wallBottomY+wallBottomHeight)
    ) {
    decreaseHealth();
  }
   
   if (ballX > gapwallX+(gapwallwidth/2) && wallScored==0) {
    wallScored=1;
    wall[4]=1;
    addScore();
  }
 
 }
 
 function addScore()
{
  score++;
}
 
    
    
  
  
  
  
  
  
  


function setup()
{
  createCanvas(500,500);
  ballX = width/4;
  ballY=height/5;
  smooth();
  ballColor =color(0);
  racketColor=color(0);
  wallColors=color(44,62,80);
}
// balls horizontal motion
function applyHorizontalSpeed()
{
  ballX+= ballSpeedHorizon;
  ballSpeedHorizon-=(ballSpeedHorizon * airfriction);
}

function draw(){
  
  if(gameScreen == 0)
  {
    initScreen();
  }
  else if( gameScreen == 1)
  {
    gamePlayScreen();
  }
  else if(gameScreen == 2)
  {
    gameOverScreen();
  }
}


function initScreen()
{
  background(0);
  textAlign(CENTER);
  text("CLick to Start", height/2, width/2);
  
}
function gamePlayScreen()
{
  background(255);
  drawBall();
  drawracket();
  applyHorizontalSpeed();
  watchRacketBounce();
  applyGravity();
  keepInScreen();
  drawHealthBar();
  printScore();
  wallAdder();
  wallHandler();
  
}
function gameOverScreen()
{
  background(0);
  textAlign(CENTER);
  fill(255);
  textSize(30);
  text("Game Over", height/2, width/2 - 20);
  textSize(15);
  text("Click to Restart", height/2, width/2 + 10);
}



function mousePressed()
{
  if(gameScreen==0)
  {
    startGame();
  }
  if(gameScreen==2)
  {
    restart();
  }
}

function startGame()
{
  gameScreen=1;
}
function gameOver()
{
  gameScreen =2;
}
  
  
  
  
  
