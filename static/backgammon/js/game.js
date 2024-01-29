const pct_w_5 = document.getElementById("piece_white_5");
const arrows = document.querySelectorAll(".arrow");

pct_w_5.addEventListener("dragstart", (event) => {
  event.dataTransfer.setData("text/plain", pct_w_5.id);
  event.target.classList.add('active')
});

arrows.forEach((arrow) => {
  arrow.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  arrow.addEventListener("drop", (event) => {
    const pieceId = event.dataTransfer.getData("text/plain");
    const draggedPiece = document.getElementById(pieceId);
  
    const targetArrow = event.target.closest('.arrow');
    if (targetArrow) {
      const rect = targetArrow.getBoundingClientRect();
  
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
  
      draggedPiece.style.left = offsetX + targetArrow.offsetLeft  + "px";
      draggedPiece.style.top = offsetY + targetArrow.offsetTop + "px";
        
      draggedPiece.classList.add('centered')

      targetArrow.appendChild(draggedPiece);
      draggedPiece.classList.remove('active');
    }
  });
  
});
