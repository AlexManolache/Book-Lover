const whitePieces = document.querySelectorAll(".white_pieces");
const blackPieces = document.querySelectorAll(".black_pieces");
const arrows = document.querySelectorAll(".arrow");

const movePieces = (pieces) => {
  pieces.forEach((piece) => {
    piece.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", piece.id);
      event.target.classList.add("active");
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

    arrow.addEventListener("dragleave", () => {
      arrow.classList.remove("cover");
    });

    arrow.addEventListener("drop", (event) => {
      const pieceId = event.dataTransfer.getData("text/plain");
      const draggedPiece = document.getElementById(pieceId);

      const targetArrow = event.target.closest(".arrow");

      // check if one seat is empty or at most one seat is occupied
      if (targetArrow.children.length <= 1) {

        const rect = targetArrow.getBoundingClientRect();

        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        draggedPiece.style.left = offsetX + targetArrow.offsetLeft + "px";
        draggedPiece.style.top = offsetY + targetArrow.offsetTop + "px";

        draggedPiece.classList.add("centered");

        targetArrow.appendChild(draggedPiece);

        draggedPiece.classList.remove("active");
      }
      targetArrow.classList.remove("cover");
    });
  });
};

movePieces(whitePieces);
movePieces(blackPieces);