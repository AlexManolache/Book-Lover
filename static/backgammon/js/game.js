const whitePieces = document.querySelectorAll(".white_pieces");
const blackPieces = document.querySelectorAll(".black_pieces");
const arrows = document.querySelectorAll(".arrow");

const bar = document.querySelector(".middle-bar");

const leftDice = document.querySelector(".left_dice");
const rightDice = document.querySelector(".right_dice");
const dice = leftDice.parentElement;
let draggedPiece;

const outPieces = [];
let isOut = false;

const movePieces = (pieces) => {
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
      arrow.classList.remove("cover");
    });
    arrow.addEventListener("drop", (event) => {
      const pieceId = event.dataTransfer.getData("text/plain");
      draggedPiece = document.getElementById(pieceId);
      const targetArrow = event.target.closest(".arrow");

      const rect = targetArrow.getBoundingClientRect();

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      draggedPiece.style.left = offsetX + targetArrow.offsetLeft + "px";
      draggedPiece.style.top = offsetY + targetArrow.offsetTop + "px";
      draggedPiece.classList.add("centered");

      targetArrow.appendChild(draggedPiece);

      // Adding pieces to array and adding to the bar, which have been out from arrows by the opposition
      if (isOut == true) {
        barPiece = targetArrow.children[0];
        outPieces.push(barPiece);
        barPiece.classList.add("move");

        movePieceToBar(barPiece, event);
      }
      draggedPiece.classList.remove("active");
      targetArrow.classList.remove("cover");
      isOut = false;
    });
  });
};
// set position and transition on X and add outPieces on bar from left areas of the table
const movePieceToBar = (outPiece, event) => {
  const rectBar = bar.getBoundingClientRect();

  const offsetX = event.clientX;

  const distance = offsetX - rectBar.left;

  outPiece.style.left = distance + "px";

  const transXvalue = Math.abs(distance);

  outPiece.classList.add("centered");
  bar.appendChild(outPiece);

  outPiece.style.setProperty("--translateX-value", `${transXvalue}px`);
};

// no of Pieces from one arrow
const numberPieces = (arrow) => {
  return arrow.children.length;
};

// apply animation and get numbers for dices
const rollTheDices = () => {
  // in case of true, stop click events for dices
  if (
    leftDice.classList.contains("left_dice_roll") ||
    rightDice.classList.contains("right_dice_roll")
  ) {
    return;
  }

  const leftOne = leftDice.classList.add("left_dice_roll");
  const rightOne = rightDice.classList.add("right_dice_roll");

  const fst = getNumber();

  console.log(fst[0]);
  console.log(fst[1]);
  setTimeout(() => {
    leftDice.classList.remove("left_dice_roll");
    rightDice.classList.remove("right_dice_roll");
    leftDice.classList.remove("not_allowed");
    rightDice.classList.remove("not_allowed");
  }, 3000);
  leftDice.classList.add("not_allowed");
  rightDice.classList.add("not_allowed");
};

// get number for each dice
// return an array with two values
const getNumber = () => {
  const valLeftDice = Math.floor(Math.random() * 6) + 1;
  const valRightDice = Math.floor(Math.random() * 6) + 1;
  return [valLeftDice, valRightDice];
};

dice.addEventListener("click", (event) => {
  rollTheDices();
});

movePieces(whitePieces);
movePieces(blackPieces);
