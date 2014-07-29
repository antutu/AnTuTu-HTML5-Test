
var w = 480;
var h = 800;
var testTime = 10;

var game = new Phaser.Game(w, h, Phaser.CANVAS, 'antutu-test1', { preload: preload, create: create, update: update, render: render });

function preload() {
    setViewport(w);

    game.stage.disableVisibilityChange = true;

    game.load.image('bullet', 'img/invaders/bullet.png');
    game.load.image('enemyBullet', 'img/invaders/enemy-bullet.png');
    game.load.spritesheet('invader', 'img/invaders/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'img/invaders/player.png');
    game.load.spritesheet('kaboom', 'img/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'img/starfield.jpg');
    game.load.spritesheet('rain', 'img/rain.png', 17, 17);

}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var fps = 0;
var xxText;
var enemyBullet;
var enemBulletTime = 0;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var padd = 50;
var addTimes = 0;
var timeStart = 0;
var count = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, w, h, 'starfield');

    game.add.text(110, 300, 'AnTuTu HTML5 Game Test', { font: '18px Arial', fill: '#fff' });

    var emitter = game.add.emitter(game.world.centerX, 0, 400);

    emitter.width = game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.

    emitter.makeParticles('rain');

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.6;

    emitter.setYSpeed(500, 800);
    emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 1000, 5, 0);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(100, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(500, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);

    //  The hero!
    player = game.add.sprite(w/2, 650, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();
    
    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);
    
    game.time.events.loop(Phaser.Timer.SECOND*testTime, timeOut, this);
    timeStart = game.time.now;
}

function createAliens () {

    for (var y = 0; y < 3; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 50;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 100 }, 2000, Phaser.Easing.Linear.None, true, 0, 2000, true);

    //  When the tween completes it calls descend, before looping again
    tween.onComplete.add(descend, this);
    enemBulletTime = 0;
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function timeOut() {
    fps = count*1000/(game.time.now - timeStart);
    try {
        WebInterface.callBack(fps);
    } catch (err) {
    }
    try {
        msg = fps;
        window.parent.postMessage('[antutu_web_msg]' + msg, '*');
    } catch (err) {
    }
}

function movePlayer() {

    player.body.velocity.x = padd;
    if(player.body.x >= w-20)
    	padd = -50;
    else if(player.body.x <= 0)
    	padd = 50;
}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    //  Reset the player, then check for movement keys
    player.body.velocity.setTo(0, 0);

    movePlayer();
    if (game.time.now > firingTimer)
    {
        fireBullet();
        enemyFires();
    }

    //  Run collision
    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

    count++;
}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() < 1)
    	restart()

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);


}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (game.time.now > enemBulletTime)
    {
        if (enemyBullet && livingEnemies.length > 0)
        {
            
            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToObject(enemyBullet,player,120);
            firingTimer = game.time.now + 500;
            enemBulletTime =  game.time.now + 500 * (18 - livingEnemies.length);
        }
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();

}
