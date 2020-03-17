let body = document.body,
    startScreen = document.querySelector('.before-screen'),
    gameContent = document.querySelector('.game-screen'),
    afterScreen  = document.querySelector('after-screen'),
    timer = document.querySelector('#timer'),
    reelText = document.querySelector('.start-text'),
    startBtn = document.querySelector('#start');

    function showGame () {
        startScreen.classList.remove('show');
        gameContent.classList.add('show');
    }

    startBtn.addEventListener('click', function () {
        console.log('ok');
        showGame(); 
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
        reelTitle.classList.add('hide');
    }

    
