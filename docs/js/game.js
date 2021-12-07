const toggle = document.querySelector('.toggle')
const overlay = document.querySelector('#overlay')
const closeToggle = document.querySelector('.close-toggle')
const game = document.querySelector('#game')
const footer = document.querySelector('#footer')
const results = document.querySelector('#results')

class Game {
    _size = -1
    _nbPlayers = -1
    _type = ''
    _html = ''
    _randomNum = []
    _firstCard = ''
    _secondCard = ''
    _numOfActiveCards = 0
    _intervalOfClick = false
    _numOfPairs = -1;
    _timerStarted = false
    _intervalID
    _timer
    _moves
    _currentPlayer = ''
    _playersPoint

    constructor() {
        this._getLocalStorage();
        this._generateCards();
        this._generateFooter();

        if (this._nbPlayers === 1) {
            game.addEventListener('click', this._startTimer.bind(this));
            this._timer = document.querySelector('#timer');
            this._moves = document.querySelector('#moves');
        }

        toggle.addEventListener('click', this._toggleBar);
        closeToggle.addEventListener('click', this._toggleBar)
        game.addEventListener('click', this._turnCard.bind(this))
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('data'));

        this._size = +data.size[0];
        this._numOfPairs = this._size**2 / 2
        this._nbPlayers = +data.nbPlayers;
        this._type = data.theme;

    }

    _generateCards() {

        this._randomNum = Array.from({length: this._size**2}, (_, idx) => idx);
        this._randomNum = 
            this._randomNum
            .map(num => Math.floor(num / 2))
            .map(p => [p, Math.random()])
            .sort( (a,b) => a[1] - b[1])
            .map( p => p[0] )

        if (this._type === 'numbers') {
            this._typeOfNumber()
        } else {
            this._typeOfIcon()
        }
    
    }

    _generateFooter() {
        if (this._nbPlayers === 1) {
            this._onePlayer()
        } else {
            this._nPlayers()
        }
    }

    _typeOfNumber() {
        if (this._size === 6) {
            game.classList.add('size-6');
        }
        
        for (let i = 0, n = this._size**2; i < n; i++) {
            this._html = `
                <li data-card="${this._randomNum[i]}">
                    <span>${this._randomNum[i]}</span>
                </li>
            `
            game.insertAdjacentHTML('beforeend', this._html);
        }
    }

    _typeOfIcon() {
        for (let i = 0, n = this._size**2; i < n; i++) {
            this._html = `
                <li data-card="${this._randomNum[i] + 1}">
                    <img src="./assets/icon-${this._randomNum[i] + 1}.svg"/>
                </li>
            `
            game.insertAdjacentHTML('beforeend', this._html);
        }
    }

    _onePlayer() {
        footer.classList.add('st');
        this._html = `
            <li class="stats">
                Time
                <h4 id="timer">0:00</h4>
            </li>
            <li class="stats">
                Moves
                <h4 id="moves">0</h4>
            </li>
        `
        footer.insertAdjacentHTML('beforeend', this._html)
    }

    _startTimer() {
        if (!this._timerStarted) {
            this._timerStarted = true;
            let seconds = 0;
            let minutes = 0;
            this._intervalID = setInterval(() => {
                seconds++;
                if (seconds === 60) {
                    minutes++;
                    seconds = 0;
                }
                this._timer.innerText = `${minutes}:${seconds > 10 ? seconds : '0'+seconds}`
            }, 1000);
        }
        game.removeEventListener('click', this._startTimer)
    }

    _nPlayers() {
        this._timerStarted = true;
        for (let i = 1; i <= this._nbPlayers; i++) {
            this._html = `
                <li class="players ${i === 1 ? 'is-playing' : ''}" data-player="${i}">
                    <h4>
                        <span class="mobile">P${i}</span>
                        <span class="tablet">Player ${i}</span>
                    </h4>
                    <p>0</p>
                </li>
            `
            footer.insertAdjacentHTML('beforeend', this._html)
        }
        this._currentPlayer = footer.children[0]
        this._playersPoint = Array.from({length: this._nbPlayers}, () => 0);
    }

    _turnCard(e) {
        if (this._intervalOfClick) return;
        const li = e.target.closest('li');
        
        if (!li) return;
        let nameOfClass = li.className
        
        if (nameOfClass === 'is-opened') return;
        if (nameOfClass === '') {
            li.classList.add('is-active')
            if (this._numOfActiveCards === 0) {
                this._firstCard = li;
                this._numOfActiveCards++;
            } 
            else if (this._numOfActiveCards === 1) {
                this._secondCard = li;
                this._numOfActiveCards = -1;
                this._matchCard();
            }
        }
    }

    _matchCard() {
        let card1 = this._firstCard.dataset.card;
        let card2 = this._secondCard.dataset.card;

        this._numOfActiveCards = 0;
        this._intervalOfClick = true
        
        if (card1 === card2) {
            this._secondCard.classList.remove('is-active');
            this._firstCard.classList.remove('is-active');

            this._secondCard.classList.add('is-opened');
            this._firstCard.classList.add('is-opened');
            this._intervalOfClick = false;

            this._numOfPairs--;
            if (this._nbPlayers !== 1) {
                this._currentPlayer.children[1].textContent = +this._currentPlayer.children[1].textContent + 1;
                this._playersPoint[this._currentPlayer.dataset.player - 1]++;
            }
        } else {
            setTimeout(() => {
                this._secondCard.classList.remove('is-active');
                this._firstCard.classList.remove('is-active');
                this._intervalOfClick = false;
                
                /* Swap the curent player */
                this._currentPlayer.classList.remove('is-playing')
                if (this._currentPlayer.nextElementSibling === null) {
                    this._currentPlayer = this._currentPlayer.parentElement.children[0];
                } else {
                    this._currentPlayer = this._currentPlayer.nextElementSibling;
                }
                this._currentPlayer.classList.add('is-playing')
            }, 1000)
        }

        if (this._nbPlayers === 1) {
            this._moves.innerText = +this._moves.innerText + 1
        }

        this._winOrNot()
    }

    _winOrNot() {
        if (this._numOfPairs === 0) {
            if (this._nbPlayers === 1) {
                clearInterval(this._intervalID)
                this._html = `
                    <h3>You did it!</h3>
                    <p>Game over! Here's how you got on...</p>
                    <ul>
                        <li>
                            Time Elapsed
                            <h4>${this._timer.textContent}</h4>
                        </li>
                        <li>
                            Moves Taken
                            <h4>${this._moves.textContent} Moves</h4>
                        </li>
                    </ul>
                    <div>
                        <button type="button" class="button-orange" onclick="GAME.restartTheGame()">Restart</button>
                        <a href="./index.html" class="new-game">Setup New Game</a>
                    </div>
                `
                results.insertAdjacentHTML('beforeend', this._html);
                overlay.classList.add('fixed');
                results.classList.add('is-open');
                document.querySelector('body').style.overflowY = "hidden";
            } else {
                let idxOfTheWinner = this.findTheIndexOfTheWinner(this._playersPoint);
                this._html = `
                    <h3>${this.checkForOneWinner(this._playersPoint) ? `Player ${idxOfTheWinner + 1} Wins!` : 'It\'s a tie!'}</h3>
                    <p>Game over! Here are the results...</p>
                    <ul>
                        ${this.genreateLis(this._playersPoint)}
                    </ul>
                    <div>
                        <button type="button" class="button-orange" onclick="GAME.restartTheGame()">Restart</button>
                        <a href="./index.html" class="new-game">Setup New Game</a>
                    </div>
                `;
                results.insertAdjacentHTML('beforeend', this._html);
                overlay.classList.add('fixed');
                results.classList.add('is-open');
                document.querySelector('body').style.overflowY = "hidden";
            }
        }
    }

    _toggleBar() {
        let nav;
        if (this.textContent === "Menu") {
            nav = this.nextElementSibling;
        } else {
            nav = this.parentElement;
        }
        nav.classList.toggle('is-open');
        overlay.classList.toggle('fixed');
        if (overlay.className === "fixed") {
            document.querySelector('body').style.overflowY = "hidden"
        } else {
            document.querySelector('body').style.overflowY = "auto"
        }
    }

    restartTheGame() {
        window.location.reload()
    }

    checkForOneWinner(arr) {
        let arrTemp = arr.slice() /* We make a copy, for not wasting the array */
        arrTemp = arrTemp.sort( (a, b) => b - a );
        if (arrTemp[0] === arrTemp[1]) return false
        return true
    }

    findTheIndexOfTheWinner(arr) {
        return arr.findIndex(el => el === Math.max(...arr))
    }

    genreateLis(arr) {
        let array = arr.map( (el, idx) => [el, idx + 1])
        array = array.sort( (a, b) => b[0] - a[0]);
        let li = `
            <li class="winner">
                Player ${array[0][1]} (Winner!)
                <h4>${array[0][0]} Pairs</h4>
            </li>
        `

        for (let i = 1; i < arr.length; i++) {
            li += `
                <li ${array[i][0] === array[0][0] ? 'class="winner"' : ''}>
                    Player ${array[i][1]} ${array[i][0] === array[0][0] ? '(Winner!)' : ''}
                    <h4>${array[i][0]} Pairs</h4>
                </li>
            ` 
        }

        return li;
    }

}

const GAME = new Game();