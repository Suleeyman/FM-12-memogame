const btnSubmit = document.querySelector('button[type=submit]')

class App {
    _data = {};

    constructor() {
        btnSubmit.addEventListener('click', this._sendForm.bind(this))
    }

    _sendForm(e) {
        e.preventDefault();
        const form = e.target.parentElement;
        const userFields = form.elements;

        /* form's values*/
        let nbPlayers = userFields.players.value;
        let size = userFields.size.value;
        let theme = userFields.theme.value;

        if ( (+size[0] === 6) && (theme === 'icons') ) {
            alert('Actually impossible to make a game 6x6 with icons: Sorry ;\'(')
            return;
        }

        this._data = {nbPlayers, size, theme};
        this._setLocalStorage();
        window.open('./game.html', '_self');
    }

    _setLocalStorage() {
        localStorage.setItem('data', JSON.stringify(this._data));
    }

}

const app = new App()