// StarCatcher Scripts for the game made by Soft Dev 2015
    // when the web page window loads up, the game scripts will be read
var star = {
    _x: null,
    _y: null,
    _xSpeed: null,
    _ySpeed: null,
    _sh: 40,
    _sw: 40,
    // add this to the variable list at the top of the star class
    _visible: true,

    //Create new star object with given starting position and speed
    //class functions exist to set other private variables
    //All inputs are double and function returns a new star
    create: function (x, y, xSpeed, ySpeed) {
        var obj = Object.create(this);
        obj._x = x;
        obj._y = y;
        obj._xSpeed=xSpeed;
        obj._ySpeed=ySpeed;
        obj._img = new Image();
        obj._img.src="images/star.png";
        return obj;
    },

    // and this just below the other functions in the star class
    visible: function() {
        return this._visible;
    },

    //Update the new x and y of the star based on the speed.
    //drawing functionality is left for calling class
    //no input or return
    update: function () {
        this._x+=this._xSpeed;
        this._y+=this._ySpeed;
    },
}; // close star object

var badStar = {
    _x: null,
    _y: null,
    _xSpeed: null,
    _ySpeed: null,
    _sh: 20,
    _sw: 20,
    // add this to the variable list at the top of the star class
    _visible: true,

    //Create new star object with given starting position and speed
    //class functions exist to set other private variables
    //All inputs are double and function returns a new star
    create: function (x, y, xSpeed, ySpeed) {
        var obj = Object.create(this);
        obj._x = x;
        obj._y = y;
        obj._xSpeed=xSpeed;
        obj._ySpeed=ySpeed;
        obj._img = new Image();
        obj._img.src="images/bstar.png";
        return obj;
    },

    // and this just below the other functions in the star class
    visible: function() {
        return this._visible;
    },

    //Update the new x and y of the star based on the speed.
    update: function () {
        this._x+=this._xSpeed;
        this._y+=this._ySpeed;
    },
}; // close bad star object

window.onload = function() {
    //load canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d"),
    w = canvas.width = 800,
    h = canvas.height = 500;
    ctx.fillStyle= "rgba(250,0,0,.4)";
    ctx.fillRect(50,50,w-100,h-100);
    ctx.fillStyle="black";
    ctx.font="30px Sans-Serif";
    ctx.fillText("Capture the Gold Stars. Avoid the Red Stars",w/8,h/2);
    ctx.fillText("two levels with total scores added to win",w/8,h-200);
    ctx.fillText("gold stars 25, 50. bad stars at 5, 10",w/8,h-100);

    // load variables
    var p1x=w/2+100, p1y=h/2, p2x=w/2-100, p2y=h/2;
    var gameOn=false;
    var p1Score=0, p2Score=0, p1Lives=3, p2Lives=3;

    //load images
    var background = new Image();
    background.src="images/bg.jpg";
    var ship1 = new Image();
    ship1.src="images/spaceship1.png"
    var ship2 = new Image();
    ship2.src="images/ship2.JPG"

    // moving stars around the screen and update the players movement
   // our stars are created using a single array with a class of information
    var starCount=25;
    var starArray=[];

    // Create an array of stars
    for (var i = 0; i < starCount; i++) {
        // this assigns each element in the array all the information for the star by 
        // using the 'star' class, pass the starting x,y locations 
        //  and speeds into the array.
        starArray.push(star.create(w/2,5*i+50,5-Math.random()*10,5-Math.random()*10));
    }  // close load star array

// our BADstars are created using a single array with a class of information
    var badStarCount=5;
    var badStarArray=[];

    // Create an array of stars
    for (var i = 0; i < badStarCount; i++) {
        badStarArray.push(badStar.create(w/2,5*i+50,5-Math.random()*10,5-Math.random()*10));
    }    
    function starsUpdate () {
        // to move the stars around
        //  draw star on screen only if visible
        for (var i = 0; i < starCount; i++) {
            // this checks to see if the star is visible
            if (starArray[i].visible()) {
                starArray[i].update();
                ctx.drawImage(starArray[i]._img, starArray[i]._x, starArray[i]._y, starArray[i]._sw, starArray[i]._sh);
                if (starArray[i]._x>w) {starArray[i]._x = 3}
                if (starArray[i]._x<0) {starArray[i]._x = w-3}

                if (starArray[i]._y>h) {starArray[i]._y = 3}
                if (starArray[i]._y<0) {starArray[i]._y = h-3}

                if (Math.abs(p1x-starArray[i]._x)<20 & Math.abs(p1y-starArray[i]._y)<20) {scoring(i,1);}
                if (Math.abs(p2x-starArray[i]._x)<20 & Math.abs(p2y-starArray[i]._y)<20) {scoring(i,2);}
            }
        }//endFor
        //  draw bad star on screen only if visible
        for (var i = 0; i < badStarCount; i++) {
            // this checks to see if the star is visible
            if (badStarArray[i].visible()) {
                badStarArray[i].update();
                ctx.drawImage(badStarArray[i]._img, badStarArray[i]._x, badStarArray[i]._y, badStarArray[i]._sw, badStarArray[i]._sh);
                if (badStarArray[i]._x>w) {badStarArray[i]._x = 3}
                if (badStarArray[i]._x<0) {badStarArray[i]._x = w-3}

                if (badStarArray[i]._y>h) {badStarArray[i]._y = 3}
                if (badStarArray[i]._y<0) {badStarArray[i]._y = h-3}

                if (Math.abs(p1x-badStarArray[i]._x)<20 & Math.abs(p1y-badStarArray[i]._y)<20) {lives(i,1);}
                if (Math.abs(p2x-badStarArray[i]._x)<20 & Math.abs(p2y-badStarArray[i]._y)<20) {lives(i,2);}
            }
        }//endFor

    }  // close starsUpdate

    //Listens to app for keyboard actions
   // a new array is made to keep track of a button being held down
    var keysDown = [];

    // if the key is held down, the keycode is placed in array
    // then it is deleted upon keyup command.  
    // playerUpdate will now control player movements and use the keysDown array

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        // start the game with keyboard command
        if (e.keyCode == 32) {
            if (gameOn==0) {
                gameOn = 1;
                main();// (key: space bar to start game)
            }
            else {gameOn=0;
                ctx.fillStyle= "rgba(250,0,0,.4)";
                ctx.fillRect(50,50,w-100,h-100);
                ctx.fillStyle="black";
                ctx.font="30px Sans-Serif";
                ctx.fillText("Capture the Gold Stars. Avoid the Red Stars",w/8,h/2);
            }
        }//end if

    }, false);

    addEventListener("keyup", function (e) {
        //take keycode out of array (not being held down anymore)

        delete keysDown[e.keyCode];
    }, false); 

//player movement
    function playerUpdate() {
        //player two hodling down a key using the array keysDown
        if (87 in keysDown) {// P2 holding down the w key
            p2y -= 5;
        }
        if (83 in keysDown) { // P2 holding down (key: s)
            p2y += 5;
        }
        if (65 in keysDown) { // P2 holding down (key: a)
            p2x -= 5;
        }
        if (68 in keysDown) { // P2 holding down (key: d)
            p2x += 5;
        }

        // player one hodling key down
        if (37 in keysDown) { // P2 holding down (key: left arrow)
            p1x -= 15;
        }
        if (38 in keysDown) { // P2 holding down (key: up arrow)
            p1y -= 5;
        }
        if (39 in keysDown) { // P2 holding down (key: right arrow)
            p1x += 15;
        }
        if (40 in keysDown) { // P2 holding down (key: down arrow)
            p1y += 5;
        }
        if (p1x>w-40) {p1x=-20}
        if (p1x<-30) {p1x=w-60}
        if (p1y>h-40) {p1y=-20}
        if (p1y<-30) {p1y=h-60}

        if (p2x>w-40) {p2x=-20}
        if (p2x<-30) {p2x=w-60}
        if (p2y>h-40) {p2y=-20}
        if (p2y<-30) {p2y=h-60}
        //draw images of ships
        ctx.drawImage(ship1, p1x, p1y, 40, 40);
        ctx.drawImage(ship2, p2x, p2y, 40, 40);
    }
           

    //Our main function which clears the screens 
    //  and redraws it all again through function updates,
    //  then calls itself out again
    function main(){
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(background,0,0,w,h+50);
        starsUpdate();
        playerUpdate();
        if (gameOn==1) {requestAnimationFrame(main)};
    } //close main
    
     //  scoring functions to place and score stars
    function scoring(k,wp) {
        starArray[k]._visible=false;
        if (wp==1) {
            // need to place a small star next to player 1 score
            p1Score++;
            $("#p1ScoreDisp").text(p1Score);
        }
        else if (wp==2) {
            p2Score++;
            $("#p2ScoreDisp").text(p2Score);
        }
    } //close scoring

    function lives(k,wp) {
        if (wp == 1) {
            p1Lives=p1Lives-1;
            if (p1Lives<=0) {
                p1Score-=10; 
                endGame(2);
                gameOn=false;
            }
            $("#p1LivesDisp").text(p1Lives);
            p1x=w/2, p1y=h/2;
            badStarArray[k]._visible=false;
            badStarArray[k]._x=w+900;
        } //close if wp
        if (wp == 2) {
            p2Lives=p2Lives-1;
            if (p2Lives<=0) {
                p2Score-=10; 
                endGame(1);
                gameOn=false;
            }
            $("#p2LivesDisp").text(p2Lives);
            p2x=w/2, p2y=h/2;
            badStarArray[k]._visible=false;
            badStarArray[k]._x=w+900;
        } //close if wp
    }   // close lives  
    
    function endGame(wp) {
        ctx.fillStyle= "rgba(250,0,0,.4)";
        ctx.fillRect(50,50,w-100,h-100);
        ctx.fillStyle="black";
        ctx.font="30px Sans-Serif";
        if (p1Score>p2Score){
            ctx.fillText("Game over, Player one Wins",w/4,h/2);
        }
        if (p2Score<p1Score){
            ctx.fillText("Game over, Player two Wins",w/4,h/2);
        }
    }  // close gameover
}    // close onload window 
