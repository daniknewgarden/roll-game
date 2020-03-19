// helpers
Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};

function SceneManager( scenes ) {

    const self = this;

    let _scenes = scenes;

    self.setScene = function( name, action ) {

        console.log( 'scenes', scenes );
        _scenes.forEach( function( scene ) {

            console.log( 'scene', scene );

            if( !scene.element )
                return console.warn( 'Сцена', scene ? scene.name : 'undefined', 'не найдена!' );

            scene.element.setAttribute( 'sm-display', (scene.name === name).toString() );
        });

        if( action === 'function' ) action();
    };
}

// app variables.

let body = document.body, sm;

function initializeApplication() {

    // fix images drag.
    document.querySelectorAll( 'img' ).forEach( function( i ) {
        i.ondragstart = function () { return false; };
    });

    // Настройка игровых сцен
    let scenes = [ 'menu', 'game', 'results', 'share' ].map( function( sceneName ) {

        return {
            name: sceneName,
            element: document.getElementById( sceneName )
        };
    });
    
    sm = new SceneManager( scenes );
    sm.setScene( 'menu' );

    document.querySelector('#start').addEventListener('click', function () {
        sm.setScene( 'game' );
        game();
    });

    document.querySelector('.again').addEventListener( 'click', function() { location.reload(); } );

}

initializeApplication();

// game variables.

function game() {

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

        swipePosition = 0,
        lastRender = 0,

        isGame = false,

        roll = document.querySelector('.roll'),
        rollItems = document.querySelectorAll('.rolling-items__item'),
        rollStyle = document.getElementById('roll').style,
        rollBackground = document.querySelector('.roll__background'),
        resultText = document.querySelector('.purple');


    function update(progress, deltaTime) {

        if (position > -itemSize * 4) {
            position -= itemSize * 4;
        }
    
        velocity = Math.max(velocity - (velocityDrag * deltaTime + velocity * deltaTime), 0);
    
        distance += velocity * deltaTime / itemSize / 4;
    
        jumpMargin = Math.lerp(jumpMargin, jumpMarginTarget, deltaTime * jumpMarginSensivity);
    
        position += velocity * deltaTime;
    }
    
    function draw() {
        rollStyle.top = position + 'px';
        document.querySelector('.roll').style.marginTop = jumpMargin + 'px';
        document.getElementById('distance').innerText = Math.floor(distance).toLocaleString('ru') + ' м';
        document.getElementById('speed').innerText = Number((velocity / 1000).toFixed(1)).toLocaleString('ru') + ' м/сек';

        body.style.overflow = 'hidden';
    }

    function startTimer(num) {
        let timeInterval = setInterval(updateTime, 1000);
    
        timer.textContent = num;

        function updateTime(params) {
            num--;
            timer.textContent = num;
    
            if (num < 4) {
                timer.classList.add('ended');
            }
    
            if (num < 1) {
                clearInterval(timeInterval);
    
                setTimeout(() => {
                    let scoreResult = document.getElementById('distance').innerText,
                        parse = parseInt(scoreResult);
                        
                    resultText.textContent = parse + ' метров';

                    let stock = document.querySelector('.stock');
                    stock.textContent = Math.round(parse / 10);

                    let link = document.getElementById('share');
                    link.href = 'https://vk.com/share.php?url=https://covidgame.ru&comment=(Я намотал ' + parse + ' метров туалетной бумаги! Сможешь больше?';

                    sm.setScene( 'results' );
    
                }, 500);
                
            }
        }
    
    }

    function onDragStart(e) {

        if( !isGame ) {
            startTimer( 5 );
            isGame = true;
        }

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
    
    let touchArea = document.querySelector( '#game' );
        touchArea.addEventListener('mousedown', onDragStart, false);
        touchArea.addEventListener('touchstart', onDragStart, false);
    
        touchArea.addEventListener('mouseup', onDragEnd, false);
        touchArea.addEventListener('touchend', onDragEnd, false);
    
    function loop(timestamp) {
        let progress = timestamp - lastRender,
            deltaTime = Date.now() - lastTime;
    
        lastTime = Date.now();
    
        update(progress, deltaTime / 1000);
        draw();
    
        lastRender = timestamp;
        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}