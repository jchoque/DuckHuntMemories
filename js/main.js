var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});

function preload() 
{
    game.load.audio('music','assets/music.mp3');
    game.load.audio('dog_laughs','assets/dog_laughs.wav');
    game.load.audio('cannon_hits_duck','assets/cannon_hits_duck.wav');
    game.load.audio('cannon_fires','assets/cannon_fires.wav');
    game.load.image('cannon', 'assets/cannon.png');
    game.load.image('cannon_ball', 'assets/cannon_ball.png');
    game.load.image('background', 'assets/background.png');
    
    
    game.load.spritesheet('duck', 'assets/duck.png', 79, 66);
    game.load.spritesheet('dog', 'assets/dog.png', 60, 45);
    //game.load.image('duck', 'assets/duck.png');
}

var sprite;
var dog;
var dogLaughs;
var duck;
var music;
var cannon_balls;
var cannonHitsDuckSound;
var bulletsText;
var cannonFiresSound;
var gameOverText;
var killedDucksText;
var killedDucks = 0;
var fireRate = 800;
var nextFire = 0;
var numCannonBalls = 20;

function create()
{

    music = game.add.audio('music');
    cannonFiresSound = game.add.audio('cannon_fires');
    cannonHitsDuckSound = game.add.audio('cannon_hits_duck');
    dogLaughs = game.add.audio('dog_laughs');
    music.play();
    game.physics.startSystem(Phaser.Physics.ARCADE);

    
    game.add.image(0,0, 'background');
    /*cannon_balls = game.add.group();
    cannon_balls.enableBody = true;
    cannon_balls.physicsBodyType = Phaser.Physics.ARCADE;*/
    //startNewRound();
/*
    cannon_balls.createMultiple(50, 'cannon_ball');
    cannon_balls.setAll('checkWorldBounds', true);
    //cannon_balls.setAll('outOfBoundsKill', true);*/
    sprite = game.add.sprite(400, 580, 'cannon');
    sprite.scale.setTo(0.4, 0.4);
    sprite.anchor.set(0.5);

    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    sprite.body.allowRotation = false;

     //ADD BULLETS TEXT
    bulletsText = game.add.text(32, 550, 'Cannons Left: ' + numCannonBalls, { font: "25px Arial", fill: "#020202", align: "left" });
    
    //ADD KILLED DUCKS TEXT
    killedDucksText = game.add.text(600, 550, 'Killed Ducks: ' + killedDucks, { font: "25px Arial", fill: "#020202", align: "left" });
    
    //introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    //introText.anchor.setTo(0.5, 0.5);

   // game.input.onDown.add(startNewRound, this);
    //startNewRound();
   // game.input.onDown.add(removeIntroText, this);
    
    
    
    
    startNewRound();
    //spawnDuck();
}

function cannonBallHitsDuck(cannon_balls, duck)
{
    cannon_balls.kill();
    duck.kill();
    cannonHitsDuckSound.play();
    killedDucks++;
    killedDucksText.text = 'Killed Ducks: ' + killedDucks;
   
    startNewRound();
}



function spawnDuck()
{
    
   // duck = game.add.sprite(game.world.randomX, game.world.randomY, 'duck');
    //duck.scale.setTo(0.3, 0.3);
     //ADD BIRD
    duck = game.add.sprite(game.world.randomX, game.world.randomY, 'duck');
    //bird = game.add.sprite(400, 300, 'bird');
    //bird.scale.setTo(0.1, 0.1);
   // bird.anchor.setTo(0.1, 0.1);
    var walk = duck.animations.add('walk');
    duck.animations.play('walk', 8, true);
    
    
    
    
    game.physics.enable(duck, Phaser.Physics.ARCADE);
    duck.body.velocity.setTo(100,100);
    
    //  This makes the game world bounce-able
    duck.body.collideWorldBounds = true;
    
    //  This sets the image bounce energy for the horizontal 
    //  and vertical vectors. "1" is 100% energy return
    duck.body.bounce.set(1);
}

function startNewRound()
{     
    //cannon_balls = null;
    //this.numCannonBalls = 5;
    //bulletsText.text = 'Bullets Left: ' + this.numCannonBalls/*cannon_balls.countDead()*/;
   // bulletsText.text = 'Bullets Left: ' + this.numCannonBalls/*cannon_balls.countDead()*/;
    cannon_balls = game.add.group();
    cannon_balls.enableBody = true;
    cannon_balls.physicsBodyType = Phaser.Physics.ARCADE;
    
    cannon_balls.createMultiple(this.numCannonBalls, 'cannon_ball');
    cannon_balls.setAll('checkWorldBounds', true);
    //bulletsText.text = 'Bullets Left: ' +  this.numCannonBalls/*cannon_balls.countDead()*/;
    spawnDuck();
}
function update() 
{
    
    sprite.rotation = game.physics.arcade.angleToPointer(sprite);
    game.physics.arcade.overlap(cannon_balls, duck, cannonBallHitsDuck, null, this);
    if (game.input.activePointer.isDown)
    {
        fire();
    }
    /*if(this.numCannonBalls == 0)
    {
            cannon_balls.kill();
            duck.kill();
            startNewRound();
    }*/
}

function fire() 
{

    if (game.time.now > nextFire && this.numCannonBalls > 0)
    {
        cannonFiresSound.play();
        nextFire = game.time.now + fireRate;

        var bullet = cannon_balls.getFirstDead();

        bullet.reset(sprite.x -30, sprite.y - 50 );

        game.physics.arcade.moveToPointer(bullet, 300);
        this.numCannonBalls--;
        bulletsText.text = 'Cannons Left: ' + this.numCannonBalls/*cannon_balls.countDead()*/;
        //this.numCannonBalls--;
         if(this.numCannonBalls == 0)
        {   
            dogLaughs.play();
            dog = game.add.sprite(680, 330, 'dog');
            dog.scale.setTo(2,2);
            var walk = dog.animations.add('walk');
            dog.animations.play('walk', 8, true);
            duck.animations.stop();
            gameOverText = game.add.text(game.world.centerX, 300, 'GAME OVER', { font: "40px Arial", fill: "#e5e500", align: "center" });
            gameOverText.anchor.setTo(0.5, 0.5);
        }
    }

}

