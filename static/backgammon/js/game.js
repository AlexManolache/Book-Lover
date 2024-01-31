const whitePieces = document.querySelectorAll(".white_pieces");
const blackPieces = document.querySelectorAll(".black_pieces");
const arrows = document.querySelectorAll(".arrow");

let numb;

// no of Pieces from one arrow
const numberPieces = (arrow) => {
  return arrow.children.length;
};

const movePieces = (pieces) => {
  pieces.forEach((piece) => {
    piece.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", piece.id);
    });
  });

  arrows.forEach((arrow) => {
    arrow.addEventListener("dragover", (event) => {
      arrow.classList.add("cover");

      // check collision between pieces and board margin
      if (event.clientY > 295 && event.clientY < 716) {
        event.preventDefault();
      }

      // change cursor mode to not allowed
      if (arrow.children.length > 1) {
        event.dataTransfer.dropEffect = "none";
      }
    });

    
    numb = numberPieces(arrow);

    arrow.addEventListener("dragleave", () => {
      // -1 is subtracted from numberPieces to update the length of the previous arrow when the "dragleave" event occurs
      numb -= 1;
      if(numb === 0) {
        arrow.classList.remove("has_white_pieces");
        arrow.classList.remove("has_black_pieces");
      }
      arrow.classList.remove("cover");
    });

    arrow.addEventListener("drop", (event) => {
      const pieceId = event.dataTransfer.getData("text/plain");
      const draggedPiece = document.getElementById(pieceId);

      const targetArrow = event.target.closest(".arrow");

      const rect = targetArrow.getBoundingClientRect();

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      draggedPiece.style.left = offsetX + targetArrow.offsetLeft + "px";
      draggedPiece.style.top = offsetY + targetArrow.offsetTop + "px";

      draggedPiece.classList.add("centered");

      // check if targetArraw is empty, has white or black pieces to be appended corresponding pieces
      const nameClass = checkTypePieces(targetArrow);

      if (
        nameClass == "" ||
        nameClass == "has_white_pieces" ||
        nameClass == "has_black_pieces"
      ) {
        targetArrow.appendChild(draggedPiece);
        numb = numberPieces(targetArrow);
      }

      targetArrow.classList.remove("cover");
    });
  });
};

// check for empty arrows and based on color of the pieces, a class will be  added / removed for arrow
// return name of the class which was added
const checkTypePieces = (arrow) => {
  const nPieces = numberPieces(arrow);
  let nameClass = "";
  if (nPieces == 0) {
    arrow.classList.remove("has_white_pieces");
    arrow.classList.remove("has_black_pieces");
    nameClass = "";
  } else if (
    nPieces >= 2 &&
    arrow.children[0].classList.contains("white_pieces") &&
    arrow.children[1].classList.contains("black_pieces")
  ) {
    arrow.classList.remove("has_white_pieces");
    arrow.classList.add("has_black_pieces");
    nameClass = "has_black_pieces";
  } else if (
    nPieces >= 2 &&
    arrow.children[0].classList.contains("black_pieces") &&
    arrow.children[1].classList.contains("white_pieces")
  ) {
    arrow.classList.remove("has_black_pieces");
    arrow.classList.add("has_white_pieces");
    nameClass = "has_white_pieces";
  } else if (
    nPieces == 1 &&
    arrow.children[0].classList.contains("white_pieces")
  ) {
    arrow.classList.add("has_white_pieces");
    nameClass = "has_white_pieces";
  } else if (
    nPieces == 1 &&
    arrow.children[0].classList.contains("black_pieces")
  ) {
    arrow.classList.add("has_black_pieces");
    nameClass = "has_black_pieces";
  }

  // Additional check to remove the class when there are no children
  if (
    (arrow.children.length == 0 &&
      arrow.classList.contains("has_white_pieces")) ||
    arrow.classList.contains("has_black_pieces")
  ) {
    arrow.classList.remove("has_white_pieces");
    arrow.classList.remove("has_black_pieces");
  }
  return nameClass;
};

movePieces(whitePieces);
movePieces(blackPieces);
