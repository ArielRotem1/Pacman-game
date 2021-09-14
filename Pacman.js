const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

var width = 1500;
var height = 650;
var MazeSize = 50;
var Maze = [];
var MazeKeys = [];

canvas.width = width;
canvas.height = height;

var Score = 0;

var interval;

var Points = [];

var SavedCommand = undefined;

var LestBottom = 100;
var LestTop = 170;
var Radius = 20;

var PointR = 5;

var Speed = 5;
var Pac;

var SpeedG = 5;
var NumberOfGhosts = 4;
var Ghosts = [];
var ConnectedSpot;
var TeleportSpot;

var StartGame = false;

class Ghost{
	
	constructor(x, y, speedX, speedY, color){
		this.x = x;
		this.y = y;
		this.SpeedX = speedX;
		this.SpeedY = speedY;
		this.color = color;
		this.width = 50;
		this.height = 50;
	}
	
	draw(){
		
		if(Pac.CanKill == false)
			ctx.fillStyle = this.color;
		else
			ctx.fillStyle = "LightGray";

		ctx.beginPath();
		ctx.arc(this.x + 25, this.y + 25, 20, Math.PI, 2* Math.PI);
		ctx.lineTo(this.x + 45, this.y + 45);
		ctx.lineTo(this.x + 5, this.y + 45);
		//ctx.arc(this.x + 10 / 2 + 20, this.y + 20 + 20, 10 * 0.5, 0, Math.PI);
		//ctx.arc(this.x + 10 / 2 - 10 + 20, this.y + 20 + 20, 10 * 0.5, 0, Math.PI);
		//ctx.arc(this.x + 10 / 2 - 20 + 20, this.y + 20 + 20, 10 * 0.5, 0, Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = 3;
		ctx.stroke();

		ctx.fillStyle = "black";

		//eyes
		ctx.beginPath();
		ctx.arc(this.x + 15, this.y + 25, 5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(this.x + 35, this.y + 25, 5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		ctx.fillStyle = "white";

		ctx.beginPath();
		ctx.arc(this.x + 15, this.y + 25, 3, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(this.x + 35, this.y + 25, 3, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		
		//ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	
	CanMoveToThere(CheckTurn){
		
		if(this.ThisCurrentDirectionIsOk()){
			this.x += this.SpeedX;
			this.y += this.SpeedY;
			return true;
		}
		else if(!BoxGhostMaze.every((pos) => pos.x != this.x || pos.y != this.y)){
			//The ghost is still in the box
			this.x += this.SpeedX;
			this.y += this.SpeedY;
			return true;
		}
		else if(CheckTurn) return false;
		
		let turn = this.Turn(true);
		
		if(turn == false){
			//return in the same way you got to here because there is no other exit
			if(this.SpeedX == SpeedG){
				this.SpeedX = -SpeedG;
				this.SpeedY = 0;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					return;
				}
			}
			else if(this.SpeedX == -SpeedG){
				this.SpeedX = SpeedG;
				this.SpeedY = 0;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					return;
				}
			}
			else if(this.SpeedY == SpeedG){
				this.SpeedX = 0;
				this.SpeedY = -SpeedG;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					return;
				}
			}
			else if(this.SpeedY == -SpeedG){
				this.SpeedX = 0;
				this.SpeedY = SpeedG;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					return;
				}
			}
		}
		
	}
	
	ThisCurrentDirectionIsOk(){
		
		let Dis = 1000000;
		
		if(this.SpeedX == -SpeedG){
			//Left
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].y == this.y + 25){
					let MazeKeysX = MazeKeys[i].x;
					if(this.x + 25 - MazeKeysX > 0 && this.x + 25 - MazeKeysX < Dis){
						Dis = this.x + 25 - MazeKeysX;
					}
				}
			}
		}
		else if(this.SpeedX == SpeedG){
			//Right
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].y == this.y + 25){
					let MazeKeysX = MazeKeys[i].x;
					if(MazeKeysX - (this.x + 25) > 0 && MazeKeysX - (this.x + 25) < Dis){
						Dis = MazeKeysX - (this.x + 25);
					}
				}
			}
		}
		else if(this.SpeedY == SpeedG){
			//Down
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].x == this.x + 25){
					let MazeKeysY = MazeKeys[i].y;
					if(MazeKeysY - (this.y + 25) > 0 && MazeKeysY - (this.y + 25) < Dis){
						Dis = MazeKeysY - (this.y + 25);
					}
				}
			}
		}
		else if(this.SpeedY == -SpeedG){
			//Up
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].x == this.x + 25){
					let MazeKeysY = MazeKeys[i].y;
					if(this.y + 25 - MazeKeysY > 0 && this.y + 25 - MazeKeysY < Dis){
						Dis = this.y + 25 - MazeKeysY;
					}
				}
			}
		}
		
		if(Dis <= 50){
			return true;
		}
		
		return false;
		
	}
	
	
	Turn(DidGhostHaveToTurn){
		
		if(DidGhostHaveToTurn == false){
			//What is the chance that the ghost will turn, now: 50%
			if(Math.random() > 0.5){
				return;
			}
		}
		
		let SavedSpeedX = this.SpeedX;
		let SavedSpeedY = this.SpeedY;
		
		let Commands;
		
		if(this.SpeedX != 0)
			Commands = ["Up", "Down"];
		else if(this.SpeedY != 0)
			Commands = ["Left", "Right"];
		
		//Shuffle
		let j, x, i;
		for (i = Commands.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = Commands[i];
			Commands[i] = Commands[j];
			Commands[j] = x;
		}
		
		//console.log("Commands: ")
		//console.log(Commands)
		//console.log()
		
		/*if(this.SpeedX == SpeedG){
			Commands.push("Left");
		}
		else if(this.SpeedX == -SpeedG){
			Commands.push("Right");
		}
		else if(this.SpeedY == SpeedG){
			Commands.push("Up");
		}
		else if(this.SpeedY == -SpeedG){
			Commands.push("Down");
		}*/
		
		for(let i = 0; i < Commands.length; i++){
			let Command = Commands[i];
			
			if(Command == "Up"){
				this.SpeedX = 0;
				this.SpeedY = -SpeedG;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					if(DidGhostHaveToTurn)
						return true;
					return;
				}
			}
			else if(Command == "Down"){
				//console.log("HERE");
				this.SpeedX = 0;
				this.SpeedY = SpeedG;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					if(DidGhostHaveToTurn)
						return true;
					return;
				}
			}
			else if(Command == "Left"){
				this.SpeedX = -SpeedG;
				this.SpeedY = 0;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					if(DidGhostHaveToTurn)
						return true;
					return;
				}
			}
			else if(Command == "Right"){
				this.SpeedX = SpeedG;
				this.SpeedY = 0;
				if(this.CanMoveToThere(true) == false){
					this.SpeedX = SavedSpeedX;
					this.SpeedY = SavedSpeedY;
				}
				else{
					if(DidGhostHaveToTurn)
						return true;
					return;
				}
			}
		}
		
		
		if(DidGhostHaveToTurn)
			return false;
	}
	
	Colide(){
		
		let PointOfColide;
		
		if(this.SpeedX == SpeedG){
			PointOfColide = {x: this.x + 50, y: this.y + 25};
		}
		else if(this.SpeedX == -SpeedG){
			PointOfColide = {x: this.x, y: this.y + 25};
		}
		else if(this.SpeedY == SpeedG){
			PointOfColide = {x: this.x + 25, y: this.y + 50};
		}
		else if(this.SpeedY == -SpeedG){
			PointOfColide = {x: this.x + 25, y: this.y};
		}
		
		let dist = GetDis(Pac.x, Pac.y, PointOfColide.x, PointOfColide.y);
			
		if(dist < Radius){
			return true;
		}
		else{
			return false;
		}
	}
	
}


class Pacman{
	
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.SpeedX = 0;
		this.SpeedY = 0;
		this.CanKill = false;
		this.KillTime = 0;
	}
	
	draw(){
		
		// An arc which goes from 36 degrees to 324 degrees to draw Pacman's head
		ctx.beginPath();
		ctx.arc(
			this.x,
			this.y,
			Radius,
			(LestBottom / 500) * Math.PI,
			(LestTop / 100) * Math.PI
		);

		// The line leading back to the center and then closing the path to finish the
		// open mouth
		ctx.lineTo(this.x, this.y);
		ctx.closePath();

		// Fill pacman's head yellow
		ctx.fillStyle = "#FF0";
		ctx.fill();
		//Next, since Pacman is cartoony, let’s add an outline to him:

		// Outline the head
		ctx.strokeStyle = "#000";
		ctx.stroke();
		//Now we can add the eye to this popular cyclops :lol::
		
	}
	
	
	CanMoveThere(){
		if(this.ThisCurrentDirectionIsOk()){
			this.x += this.SpeedX;
			this.y += this.SpeedY;
			return true;
		}
		return false;
	}
	
	
	ThisCurrentDirectionIsOk(){
		
		let Dis = 1000000;
	
		if(this.SpeedX == -Speed){
			//Left
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].y == this.y){
					let MazeKeysX = MazeKeys[i].x;
					if(this.x - MazeKeysX > 0 && this.x - MazeKeysX < Dis){
						Dis = this.x - MazeKeysX;
					}
				}
			}

			if(Dis == 1000000 && TeleportSpot.y + 25 == this.y && this.x + Radius > 0){
				return true;
			}
			else if(Dis == 1000000 && TeleportSpot.y + 25 == this.y && this.x + Radius <= 0){
				this.x = width + Radius;
			}
		}
		else if(this.SpeedX == Speed){
			//Right
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].y == this.y){
					let MazeKeysX = MazeKeys[i].x;
					if(MazeKeysX - this.x > 0 && MazeKeysX - this.x < Dis){
						Dis = MazeKeysX - this.x;
					}
				}
			}

			if(Dis == 1000000 && TeleportSpot.y + 25 == this.y && this.x - Radius < width){
				return true;
			}
			else if(Dis == 1000000 && TeleportSpot.y + 25 == this.y && this.x - Radius >= width){
				this.x = -Radius;
			}
		}
		else if(this.SpeedY == Speed){
			//Down
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].x == this.x){
					let MazeKeysY = MazeKeys[i].y;
					if(MazeKeysY - this.y > 0 && MazeKeysY - this.y < Dis){
						Dis = MazeKeysY - this.y;
					}
				}
			}
		}
		else if(this.SpeedY == -Speed){
			//Up
			for(let i = 0; i < MazeKeys.length; i++){
				if(MazeKeys[i].x == this.x){
					let MazeKeysY = MazeKeys[i].y;
					if(this.y - MazeKeysY > 0 && this.y - MazeKeysY < Dis){
						Dis = this.y - MazeKeysY;
					}
				}
			}
		}
		
		if(Dis <= 50){
			return true;
		}
		
		return false;
		
	}
	
	
	Turn(){
		
		let SavedSpeedX = this.SpeedX;
		let SavedSpeedY = this.SpeedY;
		
		if(SavedCommand == "Up"){
			this.SpeedX = 0;
			this.SpeedY = -Speed;
			if(this.CanMoveThere() == false){
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SavedCommand = undefined;
			}
		}
		else if(SavedCommand == "Down"){
			this.SpeedX = 0;
			this.SpeedY = Speed;
			if(this.CanMoveThere() == false){
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SavedCommand = undefined;
			}
		}
		else if(SavedCommand == "Left"){
			this.SpeedX = -Speed;
			this.SpeedY = 0;
			if(this.CanMoveThere() == false){
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SavedCommand = undefined;
			}
		}
		else if(SavedCommand == "Right"){
			this.SpeedX = Speed;
			this.SpeedY = 0;
			if(this.CanMoveThere() == false){
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SavedCommand = undefined;
			}
		}
		
	}

	
	CheckKey(e){
		
		e = e || window.event;
	
		let SpeedHasChange = false;
	  
		let SavedSpeedX = this.SpeedX;
		let SavedSpeedY = this.SpeedY;

		if (e.keyCode == "38" && this.SpeedY != -Speed) {
			this.SpeedX = 0;
			this.SpeedY = -Speed;
			if(this.CanMoveThere() == false){
				SavedCommand = "Up";
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SpeedHasChange = true;
			}
		} 
		else if (e.keyCode == "40" && this.SpeedY != Speed) {
			this.SpeedX = 0;
			this.SpeedY = Speed;
			if(this.CanMoveThere() == false){
				SavedCommand = "Down";
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SpeedHasChange = true;
			}
		} 
		else if (e.keyCode == "37" && this.SpeedX != -Speed) {
			this.SpeedX = -Speed;
			this.SpeedY = 0;
			if(this.CanMoveThere() == false){
				SavedCommand = "Left";
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SpeedHasChange = true;
			}
		} 
		else if (e.keyCode == "39" && this.SpeedX != Speed) {
			this.SpeedX = Speed;
			this.SpeedY = 0;
			if(this.CanMoveThere() == false){
				SavedCommand = "Right";
				this.SpeedX = SavedSpeedX;
				this.SpeedY = SavedSpeedY;
			}
			else{
				SpeedHasChange = true;
			}
		}
		
		if(SpeedHasChange == true && StartGame == false){
			StartGame = true;
			interval = setInterval(Game, 50);
		}
		
	}
	
	
}


let BoxGhostMaze = [{x: 750, y: 300, point: false}, {x: 800, y: 300, point: false}, {x: 850, y: 300, point: false},
					{x: 750, y: 350, point: false}, {x: 800, y: 350, point: false}, {x: 850, y: 350, point: false}];
					
let SpotsThatCouldBeConnectedToMaze = [{x: 750, y: 250, SpotBox: {x: 750, y: 300, SpeedX: 0, SpeedY: -SpeedG}}, {x: 700, y: 300, SpotBox: {x: 750, y: 300, SpeedX: -SpeedG, SpeedY: 0}},
									   {x: 800, y: 250, SpotBox: {x: 800, y: 300, SpeedX: 0, SpeedY: -SpeedG}},
									   {x: 850, y: 250, SpotBox: {x: 850, y: 300, SpeedX: 0, SpeedY: -SpeedG}}, {x: 900, y: 300, SpotBox: {x: 850, y: 300, SpeedX: SpeedG, SpeedY: 0}},
									   {x: 700, y: 350, SpotBox: {x: 750, y: 350, SpeedX: -SpeedG, SpeedY: 0}}, {x: 750, y: 400, SpotBox: {x: 750, y: 350, SpeedX: 0, SpeedY: SpeedG}},
									   {x: 800, y: 400, SpotBox: {x: 800, y: 350, SpeedX: 0, SpeedY: SpeedG}},
									   {x: 850, y: 400, SpotBox: {x: 850, y: 350, SpeedX: 0, SpeedY: SpeedG}}, {x: 900, y: 350, SpotBox: {x: 850, y: 350, SpeedX: SpeedG, SpeedY: 0}}]



window.onload = function(){
  setup();
};


function setup(){
	
	StartGame = false;
	
	Pac = new Pacman(-1, -1);

	LestBottom = 100;
	LestTop = 170;
	Points = [];

	Clear();
	
	Maze = [];
	MazeKeys = [];
	
	for(let i = 0; i < BoxGhostMaze.length; i++){
		Maze.push(BoxGhostMaze[i])
	}
	
	CreateMaze(8, 7, 11);
  
	while(true){

		TheConnectedSpot = undefined;
		TeleportSpot = undefined;
		
		TheConnectedSpot = TheBoxOfGhostsIsConnectedToTheMaze();

		let TeleportSpots = [];

		for(let i = 0; i < Maze.length; i++){
			if(Maze[i].x == 0){
				for(let j = 0; j < Maze.length; j++){
					if(Maze[j].x == width - MazeSize && Maze[i].y == Maze[j].y){
						TeleportSpots.push(Maze[i]);
						break;
					}
				}
			}
		}

		let RandomIndex = Math.floor(Math.random() * TeleportSpots.length);
		TeleportSpot = TeleportSpots[RandomIndex];
		
		if(TheConnectedSpot != undefined && TeleportSpot != undefined){
			break;
		}
		else{
			
			Maze = [];
			MazeKeys = [];
			Pac = new Pacman(-1, -1);
			
			for(let i = 0; i < BoxGhostMaze.length; i++){
				Maze.push(BoxGhostMaze[i])
			}
			
			CreateMaze(8, 7, 11);
		}
	  
	}
	
	//console.log("TheConnectedSpot: ")
	//console.log(TheConnectedSpot)
	//console.log()

	console.log();
	console.log("TeleportSpot: ");
	console.log(TeleportSpot);
	console.log();
	
	Ghosts = [];
	
	let Colors = ["green", "red", "blue", "brown"];
	
	for(let i = 0; i < NumberOfGhosts; i++){
		Ghosts.push(new Ghost(TheConnectedSpot.x, TheConnectedSpot.y, TheConnectedSpot.SpeedX, TheConnectedSpot.SpeedY, Colors[i % Colors.length]));
	}
  
	DrawMaze();
	DrawPoints(true);
	CheckEatPoints();
  
	for(let i = 0; i < Maze.length; i++){
		let check = true;
		
		//Do so ghosts and Pac can't move in the ghost box
		/*for(let j = 0; j < BoxGhostMaze.length; j++){
			if(Maze[i].x == BoxGhostMaze[j].x &&
			Maze[i].y == BoxGhostMaze[j].y){
				check = false;
				break;
			}
		}*/
		
		if(check)
			MazeKeys.push({x: Maze[i].x + 25, y: Maze[i].y + 25});
	}

	Clear();
	DrawMaze();
	DrawPoints(false);
	Pac.draw();
	for(let i = 0; i < Ghosts.length; i++){
		Ghosts[i].draw();
	}

	Score = 0;
	document.getElementById("Score").innerHTML = "Score: " + Score;

	document.onkeydown = checkKey;
}


//Creating Maze
function CreateMaze(NumberOfStartingPoints, MinimumNumberOfSteps, MaximumNumberOfSteps){
	
	let StartingPoints = [];
	let Walkers = [];
	
	//console.log("NumberOfStartingPoints: "+NumberOfStartingPoints)
	
	for(let i = 0; i < NumberOfStartingPoints; i++){
		
		let NumberOfWalkers = 4;//Math.floor(Math.random() * 4) + 1;
		let Dir = ["Up", "Down", "Right", "Left"];
		let XStartingP = Math.floor(Math.floor(Math.random() * (width - 50)) / MazeSize) * 50;
		let YStartingP = Math.floor(Math.floor(Math.random() * (height - 50)) / MazeSize) * 50;
		
		//console.log("XStartingP: "+XStartingP)
		//console.log("YStartingP: "+YStartingP)
		//console.log("NumberOfWalkers: "+NumberOfWalkers)
		
		//Location is colliding so we change it
		while(!LocStartingOkay(StartingPoints, XStartingP, YStartingP, MazeSize) || CheckDouble(XStartingP, YStartingP, "StartingPoint")){
			XStartingP = Math.floor(Math.floor(Math.random() * (width - 50)) / MazeSize)  * 50;
			YStartingP = Math.floor(Math.floor(Math.random() * (height - 50)) / MazeSize) * 50;
		}
		
		if(Pac.x == -1){
			Pac.x = XStartingP + 25;
			Pac.y = YStartingP + 25;
			//console.log("PosPx: "+PosPx)
			//console.log("PosPy: "+PosPy)
		}
		
		Draw(XStartingP, YStartingP, MazeSize, MazeSize, "red");
		
		//saving the data to draw the maze later and to know if there are collidies
		let data = {x: XStartingP, y: YStartingP, point: true};
		StartingPoints.push(data);
		Maze.push(data);
		
		let CurrWalkers = [];
		
		for(let j = 0; j < NumberOfWalkers; j++){
			let CurrDir = Dir.splice(Math.floor(Math.random() * Dir.length),1)[0];
			//console.log("CurrDir: "+CurrDir)
			let Steps = Math.floor(Math.random() * (MaximumNumberOfSteps - MinimumNumberOfSteps + 1)) + MinimumNumberOfSteps;
			//console.log("Steps: "+Steps)
			let x = XStartingP;
			let y = YStartingP;
			
			if(!NextStepOkay(x, y, CurrDir)){
				
				//console.log("Turn!!!")
				
				//Turn

				switch(CurrDir){
					
					case "Up": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
									CurrDir = "Right";
								else if(NextStepOkay(x,y,"Left"))
										CurrDir = "Left";
								else if(NextStepOkay(x,y,"Right"))
									CurrDir = "Right";
								
								break;
								
					case "Down": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									else if(NextStepOkay(x,y,"Left"))
										CurrDir = "Left";
									else if(NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
								
								break;
								
					case "Right": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
										CurrDir = "Up";
									else if(NextStepOkay(x,y,"Down"))
										CurrDir = "Down";
									else if(NextStepOkay(x,y,"Up"))
										CurrDir = "Up";
								
								break;
								
					case "Left": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
										CurrDir = "Up";
									else if(NextStepOkay(x,y,"Down"))
										CurrDir = "Down";
									else if(NextStepOkay(x,y,"Up"))
										CurrDir = "Up";
								
								break;
					
				}
				
				
			}
			
			//Check if coliide
			
			let Skip = false;
			let Index = -1;
			
			for(let k = 0; k < Maze.length; k++){
				
				let Wx = Maze[k].x;
				let Wy = Maze[k].y;
				
				switch(CurrDir){
					
					case "Up":	if(OverRide(x,y - MazeSize, Wx, Wy,MazeSize)){
									Index = i;
									Skip = true;
								}
								
							break;
							
					case "Down":	if(OverRide(x,y + MazeSize, Wx, Wy,MazeSize)){
										Index = i;
										Skip = true;
									}
								
							break;
							
					case "Right":	if(OverRide(x + MazeSize,y, Wx, Wy,MazeSize)){
									Index = i;
									Skip = true;
								}
								
							break;
							
					case "Left":	if(OverRide(x  - MazeSize,y, Wx, Wy,MazeSize)){
									Index = i;
									Skip = true;
								}
								
							break;
					
				}
				
				if(Skip)
					break;
				
			}
			
			if(Index == -1){
				
				switch(CurrDir){
					
					case "Up":	y -= MazeSize; break;
					case "Down":	y += MazeSize; break;
					case "Right":	x += MazeSize; break;
					case "Left":	x -= MazeSize; break;
					
				}
				
				let data = {x, y, CurrSteps: Steps - 1, Steps, CurrDir, Mone: 1, point: true};
				CurrWalkers.push(data);
				Walkers.push(data);
				Maze.push(data);
			}
			else{
				
				//console.log("Coliding!!!!!")
				
				let ColiideX = Maze[Index].x;
				let ColiideY = Maze[Index].y;
				
				switch(CurrDir){
					
					case "Up":	y -= MazeSize; 
								Draw(x, y + (ColiideY + MazeSize - y), MazeSize, MazeSize - (ColiideY + MazeSize - y));
								
							break;
							
					case "Down":	y += MazeSize;
									Draw(x, y, MazeSize, MazeSize - (y + MazeSize - ColiideY));
									
							break;
									
					case "Right":	x += MazeSize;
									Draw(x, y, MazeSize, MazeSize);
					
							break;
					
					case "Left":	x -= MazeSize;
									Draw(x, y, MazeSize, MazeSize);
					
							break;
					
				}
				
			}
			
		}

		//console.log("CurrWalkers")
		//console.log(CurrWalkers)
		
	}
	
	//console.log("StartingPoints")
	//console.log(StartingPoints)
	//console.log("Walkers")
	//console.log(Walkers)
	
	SimulateWalkers(Walkers);

}

function SimulateWalkers(Walkers){
	
	while(Walkers.length != 0){
		//console.log("Walkers.length: "+Walkers.length);
		//console.log("----------------------------------- 1");
		for(let i = Walkers.length - 1; i > -1; i--){
			
			let CurrDir = Walkers[i].CurrDir;
			let CurrSteps = Walkers[i].CurrSteps;
			let Steps = Walkers[i].Steps;
			let x = Walkers[i].x;
			let y = Walkers[i].y;
			let Mone = Walkers[i].Mone;
			
			/*console.log();
			console.log("CurrDir: "+CurrDir);
			console.log("CurrSteps: "+CurrSteps);
			console.log("Steps: "+Steps);
			console.log("x: "+x);
			console.log("y: "+y);
			console.log();*/
			
			if(CurrDir == "Up")
				Draw(x, y, MazeSize, MazeSize, "lightblue");
			else if(CurrDir == "Down")
				Draw(x, y, MazeSize, MazeSize, "yellow");
			else if(CurrDir == "Right")
				Draw(x, y, MazeSize, MazeSize, "white");
			else if(CurrDir == "Left")
				Draw(x, y, MazeSize, MazeSize, "green");
			
			ctx.fillStyle = "black";
			ctx.font = "15px Arial";
			ctx.fillText(Mone, x + 25, y + 25);
			
			if(CheckDouble(x, y, CurrDir)){
				//console.log("Coliding CheckDouble!!!!!")
					
				//console.log("Deleting Walkers")
				Walkers.splice(i,1);
				continue;
			}
			
			if(!NextStepOkay(x, y, CurrDir)){
				
				CurrSteps = Steps;
				
				//console.log("Turn!!!")
					
				//Turn

				switch(CurrDir){
						
						case "Up": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
									else if(NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									
									break;
									
						case "Down": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
										else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
										else if(NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
									
									break;
									
						case "Right": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
									
						case "Left": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
						
					}
					
					
			}
			//CurrSteps over so we change dir
			else if(CurrSteps == 0){
				
				//console.log("Turn Over CurrSteps!!!")
					
				//Turn

				switch(CurrDir){
						
						case "Up": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
									else if(NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									
									break;
									
						case "Down": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
										else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
										else if(NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
									
									break;
									
						case "Right": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
									
						case "Left": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
						
					}
				
				
				CurrSteps = Steps;
			}
			
			//Check if coliide
				
				let Skip = false;
				let Index = -1;
				
				for(let k = 0; k < Maze.length; k++){
					
					let Wx = Maze[k].x;
					let Wy = Maze[k].y;
					
					switch(CurrDir){
						
						case "Up":	if(x == Wx && y - MazeSize == Wy){
										Index = i;
										Skip = true;
									}
									
								break;
								
						case "Down":	if(x == Wx && y + MazeSize == Wy){
											Index = i;
											Skip = true;
										}
									
								break;
								
						case "Right":	if(x + MazeSize == Wx && y == Wy){
										Index = i;
										Skip = true;
									}
									
								break;
								
						case "Left":	if(x - MazeSize == Wx && y == Wy){
										Index = i;
										Skip = true;
									}
									
								break;
						
					}
					
					if(Skip)
						break;
					
				}
				
				if(Index == -1){
					
					switch(CurrDir){
						
						case "Up":	y -= MazeSize; break;
						case "Down":	y += MazeSize; break;
						case "Right":	x += MazeSize; break;
						case "Left":	x -= MazeSize; break;
						
					}
					
					let data = {x, y, CurrSteps: CurrSteps - 1, Steps, CurrDir, Mone: Mone + 1, point: true};
					Walkers[i] = data;
					Maze.push(data);
				}
				else{
					
					//console.log("Coliding!!!!!")
					
					//console.log("Deleting Walkers")
					Walkers.splice(i,1);
					
				}
				
		}
		
	}
		/*console.log("Walkers.length: "+Walkers.length);
		console.log("----------------------------------- 2");
		for(let i = Walkers.length - 1; i > -1; i--){
			
			let CurrDir = Walkers[i].CurrDir;
			let CurrSteps = Walkers[i].CurrSteps;
			let Steps = Walkers[i].Steps;
			let x = Walkers[i].x;
			let y = Walkers[i].y;
			let Mone = Walkers[i].Mone;
			
			/*console.log();
			console.log("CurrDir: "+CurrDir);
			console.log("CurrSteps: "+CurrSteps);
			console.log("Steps: "+Steps);
			console.log("x: "+x);
			console.log("y: "+y);
			console.log();
			
			if(CurrDir == "Up")
				Draw(x, y, MazeSize, MazeSize, "lightblue");
			else if(CurrDir == "Down")
				Draw(x, y, MazeSize, MazeSize, "yellow");
			else if(CurrDir == "Right")
				Draw(x, y, MazeSize, MazeSize, "white");
			else if(CurrDir == "Left")
				Draw(x, y, MazeSize, MazeSize, "green");
			
			ctx.fillStyle = "black";
			ctx.font = "15px Arial";
			ctx.fillText(Mone, x + 25, y + 25);
			
			if(CheckDouble(x, y, CurrDir)){
				console.log("Coliding CheckDouble!!!!!")
					
				console.log("Deleting Walkers")
				Walkers.splice(i,1);
				continue;
			}
			
			if(!NextStepOkay(x, y, CurrDir)){
				
				CurrSteps = Steps;
				
				console.log("Turn!!!")
					
				//Turn

				switch(CurrDir){
						
						case "Up": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
									else if(NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									
									break;
									
						case "Down": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
										else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
										else if(NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
									
									break;
									
						case "Right": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
									
						case "Left": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
						
					}
					
					
			}
			//CurrSteps over so we change dir
			else if(CurrSteps == 0){
				
				console.log("Turn Over CurrSteps!!!")
					
				//Turn

				switch(CurrDir){
						
						case "Up": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
									else if(NextStepOkay(x,y,"Right"))
										CurrDir = "Right";
									
									break;
									
						case "Down": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
										else if(NextStepOkay(x,y,"Left"))
											CurrDir = "Left";
										else if(NextStepOkay(x,y,"Right"))
											CurrDir = "Right";
									
									break;
									
						case "Right": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
									
						case "Left": 	if(Math.random() > 0.5 && NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
										else if(NextStepOkay(x,y,"Down"))
											CurrDir = "Down";
										else if(NextStepOkay(x,y,"Up"))
											CurrDir = "Up";
									
									break;
						
					}
				
				
				CurrSteps = Steps;
			}
			
			//Check if coliide
				
				let Skip = false;
				let Index = -1;
				
				for(let k = 0; k < Maze.length; k++){
					
					let Wx = Maze[k].x;
					let Wy = Maze[k].y;
					
					switch(CurrDir){
						
						case "Up":	if(x == Wx && y - MazeSize == Wy){
										Index = i;
										Skip = true;
									}
									
								break;
								
						case "Down":	if(x == Wx && y + MazeSize == Wy){
											Index = i;
											Skip = true;
										}
									
								break;
								
						case "Right":	if(x + MazeSize == Wx && y == Wy){
										Index = i;
										Skip = true;
									}
									
								break;
								
						case "Left":	if(x - MazeSize == Wx && y == Wy){
										Index = i;
										Skip = true;
									}
									
								break;
						
					}
					
					if(Skip)
						break;
					
				}
				
				if(Index == -1){
					
					switch(CurrDir){
						
						case "Up":	y -= MazeSize; break;
						case "Down":	y += MazeSize; break;
						case "Right":	x += MazeSize; break;
						case "Left":	x -= MazeSize; break;
						
					}
					
					let data = {x, y, CurrSteps: CurrSteps - 1, Steps, CurrDir, Mone: Mone + 1};
					Walkers[i] = data;
					Maze.push(data);
				}
				else{
					
					console.log("Coliding!!!!!")
					
					console.log("Deleting Walkers")
					Walkers.splice(i,1);
					
				}
				
		}*/
		
}

function CheckDouble(x, y, CurrDir){
	
	for(let i = 0; i < Maze.length; i++){
		
		let Wx = Maze[i].x;
		let Wy = Maze[i].y;
	
		switch(CurrDir){
			
			case "Up":		if((x + MazeSize == Wx && y == Wy) || (x - MazeSize == Wx && y == Wy))
								return true;
					break;
				
			case "Down":	if((x + MazeSize == Wx && y == Wy) || (x - MazeSize == Wx && y == Wy))
								return true;
					break;

			case "Right":	if((x == Wx && y + MazeSize == Wy) || (x == Wx && y - MazeSize == Wy))
								return true;
					break;
					
			case "Left":	if((x == Wx && y + MazeSize == Wy) || (x == Wx && y - MazeSize == Wy))
								return true;
					break;
			
			default:	if((x == Wx && y + MazeSize == Wy) || (x == Wx && y - MazeSize == Wy) || (x + MazeSize == Wx && y == Wy) || (x - MazeSize == Wx && y == Wy))
								return true;
					break;
		}
	}
	
	return false;
	
}

function Draw(x, y, widthh, heightt, color){
	
	ctx.fillStyle = color;
	ctx.fillRect(x, y, widthh, heightt);
	
}


function NextStepOkay(x, y, dir){
	
	
	switch(dir){
		
		case "Up":	if(y - MazeSize >= 0) return true;
					else return false;
					
				break;
				
		case "Down":	if(y + MazeSize * 2 <= height) return true;
						else return false;
					
				break;
				
		case "Right":	if(x + MazeSize * 2 <= width) return true;
					else return false;
					
				break;
				
		case "Left":	if(x - MazeSize >= 0) return true;
					else return false;
					
				break;
		
	}
	
}

function LocStartingOkay(Points, x, y){
	
	for(let i = 0; i < Points.length; i++)
		if(OverRide(x, y, Points[i].x, Points[i].y))
			return false;
		
	return true;
	
}

function OverRide(x1, y1, x2, y2){
	
	if((x1 < x2 && x2 < x1 + MazeSize && y1 < y2 && y2 < y1 + MazeSize) || 
	  (x2 < x1 && x1 < x2 + MazeSize && y1 < y2 && y2 < y1 + MazeSize) || 
	  (x1 < x2 && x2 < x1 + MazeSize && y2 < y1 && y1 < y2 + MazeSize) || 
	  (x2 < x1 && x1 < x2 + MazeSize && y2 < y1 && y1 < y2 + MazeSize)){
		return true;
	}
	
	return false
	
}


function TheBoxOfGhostsIsConnectedToTheMaze(){
	
	for(let i = 0; i < SpotsThatCouldBeConnectedToMaze.length; i++){
		let s1 = SpotsThatCouldBeConnectedToMaze[i];
		for(let j = 0; j < Maze.length; j++){
			let s2 = Maze[j];
			if(s1.x == s2.x && s1.y == s2.y){
				return s1.SpotBox;
			}
		}
	}
	
}



function DrawPoints(Firstime) {
    //Check if I can draw a points and where
	
	let NumberOfPointsKill = 4;
  
	let Diff = 35;
	
	let Mone = Diff;

	if (Firstime) {
		for (let i = 0; i < Maze.length; i++) {
			if(Maze[i].point == true){
				DrawPoint(Maze[i].x + 25, Maze[i].y + 25);
				let Pos = {x: Maze[i].x + 25, y: Maze[i].y + 25, Kill: false};
				if(Mone == 0 && NumberOfPointsKill > 0){
					Pos.Kill = true;
					Mone = Diff;
					NumberOfPointsKill--;
				}
				Mone--;
				Points.push(Pos);
			}
		}
	} 
	else {
		for (let i = 0; i < Points.length; i++) {
		let Pos = Points[i];
		if(Pos.Kill == false)
			DrawPoint(Pos.x, Pos.y, PointR, "red");
		else
			DrawPoint(Pos.x, Pos.y, PointR + 5, "blue");
		}
	}
  
}


function CheckEatPoints() {
	for (let i = Points.length - 1; i > -1; i--) {
		let PosPoint = Points[i];
		let DisBetweenCenterPointToCenterPac = GetDis(
		Pac.x,
		Pac.y,
		PosPoint.x,
		PosPoint.y
		);

		if (DisBetweenCenterPointToCenterPac - Radius - PointR <= 0) {
			if(Points[i].Kill == true){
				Pac.CanKill = true;
				Pac.KillTime = 150;
			}
		Points.splice(i, 1);
		Score++;
		}
	}

	document.getElementById("Score").innerHTML = "Score: " + Score;
}


function DrawPoint(x, y, R, color) {
  // A circle for the eye
  ctx.beginPath();
  ctx.arc(x, y, R, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}



function DrawGhost(x, y){
	ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(x , y, 20, Math.PI, 2* Math.PI);
    ctx.lineTo(x + 20, y + 20);
    ctx.arc(x + 20 / 2, y + 20, 20 * 0.5, 0, Math.PI);
    ctx.arc(x + 20 / 2 - 20 , y + 20, 20 * 0.5, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 3;
    ctx.stroke();
}

function DrawMaze() {

	for(let i = 0; i < Maze.length; i++){
		Draw(Maze[i].x, Maze[i].y, MazeSize, MazeSize, "white");
	}

	Draw(TeleportSpot.x, TeleportSpot.y, 5, MazeSize, "green");
	Draw(TeleportSpot.x + width - 5, TeleportSpot.y, 5, MazeSize, "green");
}

function Clear() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}




function Game() {
	
	if(Pac.KillTime != 0){
		Pac.KillTime--;
	}
	
	if(Pac.CanKill && Pac.KillTime == 0){
		Pac.CanKill = false;
	}
	
  //Open and Close mouth

		if (LestBottom == 0) {
			LestBottom = 100;
		}

		if (LestTop == 200) {
			LestTop = 170;
		}

		if (LestBottom > 0) {
			LestBottom -= 10;
		}

		if (LestTop > 0) {
			LestTop += 3;
		}

	//console.log("LestTop: "+LestTop);
  
	Clear();
	DrawMaze();
	DrawPoints(false);
	
	//Move and Draw Pac
	Pac.CanMoveThere();
	Pac.draw();
	
	//Draw and Move Ghosts
	for(let i = 0; i < Ghosts.length; i++){
		Ghosts[i].CanMoveToThere(false);
		Ghosts[i].draw();
		//Check Ghost Coliide with Pac
		let IsColide = Ghosts[i].Colide();
		if(IsColide == true && Pac.CanKill == false){
			let answer = confirm("The ghost caught you!!! \n Do you want to play again?");
			if(answer == true){
				Restart();
			}
			else{
				clearInterval(interval);
				Clear();
				DrawMaze();
				Pac.draw();
				for(let i = 0; i < Ghosts.length; i++){
					Ghosts[i].draw();
				}
				
				return;
			}
		}
		else if(IsColide == true && Pac.CanKill == true){
			Ghosts[i] = new Ghost(TheConnectedSpot.x, TheConnectedSpot.y, TheConnectedSpot.SpeedX, TheConnectedSpot.SpeedY, Ghosts[i].color);
			Score += 20;
			document.getElementById("Score").innerHTML = "Score: " + Score;
		}
		else
			Ghosts[i].Turn(false);
	}
  
	//If Pac eat point
	CheckEatPoints();

	if (Points.length == 0) {
		//Game Over!!!!
		let answer = confirm("You won!!! \n Do you want to play again?");
		if(answer == true){
			Restart();
		}
		else{
			clearInterval(interval);
			Clear();
			DrawMaze();
			Pac.draw();
			for(let i = 0; i < Ghosts.length; i++){
				Ghosts[i].draw();
			}
		}
	}

	document.onkeydown = checkKey;
	
	if(SavedCommand != undefined){
		Pac.Turn();
	}

}


function GetDis(x1, y1, x2, y2) {
  let XDelta = Math.abs(x1 - x2);
  let YDelta = Math.abs(y1 - y2);
  let Dis = Math.sqrt(Math.pow(XDelta, 2) + Math.pow(YDelta, 2));
  return Dis;
}

function checkKey(e) {
	Pac.CheckKey(e);
}

function Restart() {
  clearInterval(interval);
  setup();
}




