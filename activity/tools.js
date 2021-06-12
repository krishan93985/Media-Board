
ctx.lineWidth = 5;
ctx.lineCap = "round";
ctx.lineJoin = 'round';
let activeTool = '';
let currentColor = "black";
let pencilLineWidth = 4;
let eraserLineWidth = 4;
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let pencilOptions = document.querySelector("#pencil-options");
let eraserOptions = document.querySelector("#eraser-options");
function handleTool(tool) {

    if (tool == "pencil") {
        if (activeTool == "pencil") {
            pencilOptions.classList.toggle("show");
        } else {
            ctx.strokeStyle = currentColor;
            activeTool = "pencil";
            ctx.globalCompositionOperation="source-over";
            eraserOptions.classList.remove("show");
            pencilOptions.classList.toggle("show");
        }
        if(canvasBoard.classList.contains("eraser-cursor"))
             canvasBoard.classList.remove("eraser-cursor")
        ctx.lineWidth = pencilLineWidth;
        console.log(pencilLineWidth)
    } else if (tool == "eraser") {
        eraserOptions.style.left = "44vw";
        if (activeTool == "eraser") {
            eraserOptions.classList.toggle("show");
        } else {
            activeTool = "eraser";
            ctx.globalCompositionOperation="destination-out";
            eraserOptions.classList.toggle("show");
            pencilOptions.classList.remove("show");
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = eraserLineWidth;
        if(!canvasBoard.classList.contains("eraser-cursor"))
            canvasBoard.classList.add("eraser-cursor");
    } else if (tool == "sticky") {
        createSticky("");
    } else if (tool == "upload") {
        uploadFile();
    } else if (tool == "undo") {
        undoLast();
    } else if (tool == "redo") {
        redoLast();
    } 
}
function changeColor(color) {
    currentColor = ctx.strokeStyle = color;
    // send
   // socket.emit("colorChange", color);
    pencilOptions.classList.toggle("show")
}
let sliders = document.querySelectorAll("input[type='range']");
for (let i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("change", function () {
        let width = sliders[i].value;
        console.log(i)
        ctx.lineWidth = width;
        if(i==0)
            pencilLineWidth = width;
        else
            eraserLineWidth = width;
    })
}

// let newArr = [...oldArr]; => values are copied
// let newArr = oldArr;=> address copy