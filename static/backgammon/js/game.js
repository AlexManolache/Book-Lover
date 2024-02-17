const whitePieces = document.querySelectorAll(".white_pieces");
const blackPieces = document.querySelectorAll(".black_pieces");
const arrows = document.querySelectorAll(".arrow");

const bar = document.querySelector(".middle-bar");

const leftDice = document.querySelector(".left_dice");
const rightDice = document.querySelector(".right_dice");
const dice = leftDice.parentElement;
let draggedPiece;
let targetArrow;
const outPieces = [];
let isOut = false;
let canMovePieces = false;

let valueDiece = [];

const movePieces = (pieces) => {
  let url = `ws://${window.location.host}/ws/move-pieces/`;
  const piecesSocket = new WebSocket(url);
  const sss = document.querySelector(".sss");
  piecesSocket.onopen = () => {};
  pieces.forEach((piece) => {
    piece.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", piece.id);
      event.target.classList.add("active");
      draggedPiece = piece;
    });
  });
  arrows.forEach((arrow) => {
    arrow.addEventListener("dragover", (event) => {
      const targetArrow = event.target.closest(".arrow");
      arrow.classList.add("cover");
      // for test websocket endpoint

      // check collision between pieces and board margin
      if (event.clientY > 295 && event.clientY < 716) {
        event.preventDefault();
      }

      const nr = numberPieces(targetArrow);

      // maximul number of pieces on an arrow must be five
      if (nr >= 5) {
        event.dataTransfer.dropEffect = "none";
      }

      // Check if arrow has one piece and which type is the second one
      if (nr == 1) {
        const isWhitePieces =
          targetArrow.children[0].classList.contains("white_pieces");
        const isBlackPieces =
          targetArrow.children[0].classList.contains("black_pieces");

        if (
          (isWhitePieces && draggedPiece.classList.contains("black_pieces")) ||
          (isBlackPieces && draggedPiece.classList.contains("white_pieces"))
        ) {
          isOut = true;
        }
      } else {
        isOut = false;
      }

      // When on the arrow are at least two pieces, the third piece must has the same color as the first two

      if (nr >= 2) {
        const isWhitePieces =
          targetArrow.children[0].classList.contains("white_pieces") &&
          targetArrow.children[1].classList.contains("white_pieces");
        const isBlackPieces =
          targetArrow.children[0].classList.contains("black_pieces") &&
          targetArrow.children[1].classList.contains("black_pieces");

        if (
          (isWhitePieces && draggedPiece.classList.contains("black_pieces")) ||
          (isBlackPieces && draggedPiece.classList.contains("white_pieces"))
        ) {
          event.dataTransfer.dropEffect = "none";
        }
      }
    });

    arrow.addEventListener("dragleave", () => {
      isOut = false;
      arrow.classList.remove("cover");
    });

    arrow.addEventListener("drop", (event) => {
      const pieceId = event.dataTransfer.getData("text/plain");
      draggedPiece = document.getElementById(pieceId);
      targetArrow = event.target.closest(".arrow");

      const rect = targetArrow.getBoundingClientRect();

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      draggedPiece.style.left = offsetX + targetArrow.offsetLeft + "px";
      draggedPiece.style.top = offsetY + targetArrow.offsetTop + "px";
      draggedPiece.classList.add("centered");
      // console.log("left " + draggedPiece.style.left);
      // console.log("top " + draggedPiece.style.top);
      let dataPiece = JSON.stringify({
        pieceId,
        position: {
          x: draggedPiece.style.left,
          y: draggedPiece.style.top,
        },
        newTarget: targetArrow.id,
      });
      piecesSocket.send(dataPiece);

      targetArrow.appendChild(draggedPiece);
      console.log(targetArrow.id);
      //

      // Adding pieces to array and adding to the bar, which have been out from arrows by the opposition
      if (isOut == true) {
        const barPiece = targetArrow.children[0];
        outPieces.push(barPiece);
        barPiece.classList.add("move");

        movePieceToBar(barPiece, event);
      }

      draggedPiece.classList.remove("active");
      targetArrow.classList.remove("cover");
      isOut = false;
    });
  });
  piecesSocket.addEventListener("message", (e) => {
    let pieceDroped = JSON.parse(e.data);
    let pcsId = pieceDroped.content.pieceId;
    let pcsPosition = pieceDroped.content.position;
    let draggedPiece = document.getElementById(pcsId);
    let parentTargetId = pieceDroped.content.newTarget;
    let stylePcs = pieceDroped.cssCenter;
    draggedPiece.style.left = pcsPosition.x;
    draggedPiece.style.top = pcsPosition.y;
    draggedPiece.classList.add(stylePcs);
    let parentElement = document.getElementById(parentTargetId);
    parentElement.appendChild(draggedPiece);
    console.log(parentElement);
  });
};
// set position and transition on X and add outPieces on bar from left areas of the table
const movePieceToBar = (outPiece, event) => {
  const rectBar = bar.getBoundingClientRect();

  const offsetX = event.clientX;

  const offsetY = event.clientY;

  const horizontalDistance = offsetX - rectBar.left;

  const middleBar = rectBar.y + rectBar.height / 2;

  // 9 px for adjustment
  outPiece.style.left = horizontalDistance - 9 + "px";

  let transXvalue = Math.abs(horizontalDistance);
  let transYvalue;

  // if pieces is located in right side top or bottom
  // change direction of animation
  if (offsetX > rectBar.x) {
    transXvalue = -horizontalDistance;
  }

  // Pythagorean theorem
  trajectory = Math.sqrt(
    Math.pow(horizontalDistance, 2) + Math.pow(middleBar, 2)
  );

  // vertical movement
  if (offsetY > middleBar) {
    if (outPiece.classList.contains("white_pieces")) {
      outPiece.style.top = "350px";
    } else {
      outPiece.style.top = "300px";
    }
    transYvalue = -trajectory / 2;
  } else {
    if (outPiece.classList.contains("white_pieces")) {
      outPiece.style.top = "135px";
    } else {
      outPiece.style.top = "85px";
    }
    transYvalue = trajectory / 2;
  }

  outPiece.classList.add("centered");
  bar.appendChild(outPiece);

  outPiece.style.setProperty("--translateX-value", `${transXvalue}px`);
  outPiece.style.setProperty("--translateY-value", `${transYvalue}px`);
};

// no of Pieces from one arrow
const numberPieces = (arrow) => {
  return arrow.children.length;
};

// apply animation and get numbers for dices
const rollTheDices = async () => {
  let url = `ws://${window.location.host}/ws/roll-dices/`;
  const dicesValueSocket = new WebSocket(url);

  dicesValueSocket.onopen = () => {
    sendMesssage(dicesValueSocket);
  };
};

const sendMesssage = (dicesValueSocket) => {
  /**
   *
   * cssClasses[0] - left_dice_roll
   * cssClasses[1] - right_dice_roll
   * cssClasses[2] - not_allowed
   */
  dicesValueSocket.onmessage = (e) => {
    let data = JSON.parse(e.data);
    setTimeout(() => {
      if (
        leftDice.classList.contains(data.cssClasses[0]) ||
        rightDice.classList.contains(data.cssClasses[1])
      ) {
        // this class is applied after one second
        leftDice.classList.add(data.cssClasses[2]);
        rightDice.classList.add(data.cssClasses[2]);

        leftDice.textContent = valueDiece[0];
        rightDice.textContent = valueDiece[1];
        return;
      }
    }, 1000);

    leftDice.classList.add(data.cssClasses[0]);
    rightDice.classList.add(data.cssClasses[1]);

    setTimeout(() => {
      leftDice.classList.remove(data.cssClasses[0]);
      rightDice.classList.remove(data.cssClasses[1]);
      leftDice.classList.remove(data.cssClasses[2]);
      rightDice.classList.remove(data.cssClasses[2]);
    }, 3000);
  };
};

// get value from backend for dices
const getValueDice = async () => {
  let url = `ws://${window.location.host}/ws/get-dice-value/`;

  const dicesValue = new WebSocket(url);
  dicesValue.onopen = () => {
    dicesValue.onmessage = (e) => {
      let data = JSON.parse(e.data);
      valueDiece[0] = data.number.valLeftDice;
      valueDiece[1] = data.number.valRightDice;
    };
  };
};

const getCSRFToken = () => {
  const csrfTokenInput = document.querySelector("[name=csrfmiddlewaretoken]");
  return csrfTokenInput ? csrfTokenInput.value : "";
};

const valuesDicesStored = () => {
  return valueDiece;
};

getValueDice();
rollTheDices();
movePieces(whitePieces);
movePieces(blackPieces);
dice.addEventListener("click", async () => {
  await rollTheDices();
  getValueDice().then(() => valuesDicesStored());

  canMovePieces = true;
  if (canMovePieces == true) {
    movePieces(whitePieces);
    movePieces(blackPieces);
  }
});
