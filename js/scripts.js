let body = document.body,
    startScreen = document.querySelector('.before-screen'),
    gameContent = document.querySelector('.game-screen'),
    afterScreen  = document.querySelector('after-screen'),
    timer = document.querySelector('#timer'),
    reelText = document.querySelector('.start-text'),
    startBtn = document.querySelector('#start'),
    rollItems = document.querySelectorAll('.rolling-items__item'),
    rollStyle = document.getElementById('roll').style,
    rollBackground = document.querySelector('.roll__background');




    function showGame () {
        startScreen.classList.remove('show');
        gameContent.classList.add('show');
    }

    startBtn.addEventListener('click', function () {
        console.log('ok');
        showGame(); 
        // startGame();
    });

    function startTimer(num) {
        num = 30;
        let timeInterval = setInterval(updateTime, 1000);

        function updateTime(params) {
            num--;
            timer.textContent = num;

            if (num < 1) {
                clearInterval(timeInterval);
                console.log('ok');
            }
        }

    }

    function startGame() {
        reelText.classList.add('hide');
        startTimer();
    }

Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};



//  Отключить перетаскивание картинок
rollBackground.ondragstart = function () {
    return false;
};

rollItems.forEach(function (item) {
    item.ondragstart = function () {
        return false;
    };
});

// Переменные
let position = -1590,
    itemSize = 138,
    offset = 10,
    swipeVelocity = 0,
    velocity = 0,
    velocityDrag = 50,
    velocitySensivity = 3,
    maxVelocity = 30000,
    speed = 3,
    distance = 0,

    jumpDefaultMargin = -72,
    jumpMarginTouch = -48,
    jumpMargin = jumpDefaultMargin,
    jumpMarginTarget = jumpDefaultMargin,
    jumpMarginSensivity = 8,

    lastTime = Date.now(),

    swipePosition = 0;

rollStyle.top = position + 'px';

function update(progress, deltaTime) {

    if (position > -itemSize * 4) {
        position -= itemSize * 4;
    }

    velocity = Math.max(velocity - (velocityDrag * deltaTime + velocity * deltaTime), 0);

    distance += velocity * deltaTime / itemSize / 4;

    jumpMargin = Math.lerp(jumpMargin, jumpMarginTarget, deltaTime * jumpMarginSensivity);

    position += velocity * deltaTime;
    //     console.log( 'deltaTime', deltaTime );
    //     console.log( 'velocity', velocity );
    //     console.log( 'position', position );
    //     console.log( 'distance', distance );

    //     console.log( '---', '\n');

}

function draw() {
    rollStyle.top = position + 'px';
    document.querySelector('.roll').style.marginTop = jumpMargin + 'px';
    // document.getElementById('distance').innerText = Math.floor(distance).toLocaleString('ru') + ' м';
    // document.getElementById('speed').innerText = Number((velocity / 1000).toFixed(1)).toLocaleString('ru') + ' м/сек';
}

function loop(timestamp) {
    let progress = timestamp - lastRender,
        deltaTime = Date.now() - lastTime;

    lastTime = Date.now();

    update(progress, deltaTime / 1000);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

function onDragStart(e) {
    jumpMarginTarget = jumpMarginTouch;
    console.log('drag start', e);

    if (e.changedTouches && e.changedTouches.length > 0) {
        e = e.changedTouches[0];
    }

    swipePosition = e.clientY;
}

function onDragEnd(e) {
    jumpMarginTarget = jumpDefaultMargin;
    console.log('drag end', e);

    if (e.changedTouches && e.changedTouches.length > 0) {
        e = e.changedTouches[0];

    }

    swipeVelocity = Math.min(Math.max(e.clientY - swipePosition, 0), 480);
    velocity += swipeVelocity * velocitySensivity;

    console.log('velocity', velocity);
    swipePosition = e.clientY;

}

let touchArea = document.querySelector('.game-screen');
touchArea.addEventListener('mousedown', onDragStart, false);
touchArea.addEventListener('touchstart', onDragStart, false);

touchArea.addEventListener('mouseup', onDragEnd, false);
touchArea.addEventListener('touchend', onDragEnd, false);

let lastRender = 0;
window.requestAnimationFrame(loop);

    
