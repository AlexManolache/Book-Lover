const lftDice = document.getElementById("lft_dice");
const rthDice = document.getElementById("rgt_dice");

const getInitialDice = () => {
    let url = `ws://${window.location.host}/ws/initial-dices/`;
    const socketDices = new WebSocket(url);

    socketDices.onmessage = (e) => {
        let data = JSON.parse(e.data)
        lftDice.textContent = data.number.valLeftDice;
        rthDice.textContent = data.number.valRightDice;
    }
};

getInitialDice();
