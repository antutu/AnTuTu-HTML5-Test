
var w = 480;
var h = 800;
var testTime = 10;

var fps = 0;
var timeStart = 0;
var count = 0;
var counter = 0;
var grand;
var leftEmitter;
var rightEmitter;

var game = new Phaser.Game(w, h, Phaser.CANVAS, 'antutu-test2', { preload: preload, create: create, update: update });

function preload() {
    setViewport(w);

    game.stage.disableVisibilityChange = true;

    game.load.image('bg', 'img/starfield.jpg');
    game.load.spritesheet('balls', 'img/balls.png', 17, 17);
    game.load.image('grand', 'img/invaders/bullet.png');

}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, w, h, 'bg');
    grand = game.add.sprite(0, 650, 'grand');
    grand.scale.setTo(200, 0.3);
    grand.anchor.set(0.5);

    game.add.text(110, 300, 'AnTuTu HTML5 Game Test', { font: '18px Arial', fill: '#fff' });

    leftEmitter = game.add.emitter(10, 50);
    leftEmitter.bounce.setTo(0.5, 0.5);
    leftEmitter.setXSpeed(100, 100);
    leftEmitter.setYSpeed(-50, 50);
    leftEmitter.makeParticles('balls', 0, 150, 1, true);

    rightEmitter = game.add.emitter(game.world.width - 10, 50);
    rightEmitter.bounce.setTo(0.5, 0.5);
    rightEmitter.setXSpeed(-100, -100);
    rightEmitter.setYSpeed(-50, 50);
    rightEmitter.makeParticles('balls', 1, 150, 1, true);

    // explode, lifespan, frequency, quantity
    leftEmitter.start(false, 5000, 20);
    rightEmitter.start(false, 5000, 20);

    game.physics.enable(grand, Phaser.Physics.ARCADE);

    grand.body.collideWorldBounds = false;
    grand.body.bounce.set(0.8);
    grand.body.allowRotation = false;
    grand.body.immovable = true;

    game.time.events.loop(Phaser.Timer.SECOND*testTime, timeOut, this);
    timeStart = game.time.now;
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

function update() {
    game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);
    game.physics.arcade.collide(leftEmitter, grand, change2, null, this);
    game.physics.arcade.collide(rightEmitter, grand, change3, null, this);
    count++;
}

function change(a, b) {
    a.frame = 2;
    b.frame = 3;
}

function change2(a, b) {
    b.frame = 4;
}

function change3(a, b) {
    b.frame = 5;
}
