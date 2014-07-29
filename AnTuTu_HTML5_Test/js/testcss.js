
var w = 480;
var h = 800;

var fps = 0;
var fpsString = '';
var fpsText;
var count = 0;
var timeStart = 0;

var game = new Phaser.Game(w, h, Phaser.CANVAS, 'antutu-css', { preload: preload, create: create, update: update });

function preload() {
}

function create() {
    fpsString = 'FPS : ';
    fpsText = game.add.text(10, 680, fpsString + fps, { font: '16px Arial', fill: '#fff' });

    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
    timeStart = game.time.now;
}

function updateCounter() {
    fps = count*1000/(game.time.now - timeStart);
    fpsText.text = fpsString + fps.toFixed(2);
}

function update() {
    count++;
}
