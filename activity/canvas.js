
// press mouse
let isPenDown = false;
// [  [ {} ] ]
 let undoArr = [];
//              slide  allMousePointsOfLastAction
// redoArr = [ [        [ {},{},..              ],[],...  ],[],... ]
 let redoArr = [];
// for(let i=0;i<100;i++){
//     undoArr[i]=[];
//     redoArr[i]=[];
// }
board.addEventListener("mousedown", function (e) {
    //nothing to redo
    redoArr[currentSlideIndex] = [];
    
    // begin path
    ctx.beginPath();
    // move to mouse pointers location
    let x = e.clientX;
    let y = e.clientY;
    let top = getLocation();
    y = Number(y) - top
    let widthOld = board.clientWidth;
    ctx.moveTo(x, y);
    console.log("Mouse down")
    isPenDown = true;
    
    // mouse down
    let mdp = {
        widthOld,
        x,
        y,
        id: "md",
        color: ctx.strokeStyle,
        width: ctx.lineWidth
    }
    if(undoArr[currentSlideIndex] && undoArr[currentSlideIndex].length)
            undoArr[currentSlideIndex].push(mdp);
        else
            undoArr[currentSlideIndex] = [mdp];
    //  point => realtime draw
    //socket.emit("md", mdp);
})
// on move
board.addEventListener("mousemove", function (e) {
    if (isPenDown) {
        console.log("Mouse move")
        // lineTo
        let x = e.clientX;
        let y = e.clientY;
        let top = getLocation();
        y = Number(y) - top;
        let widthOld = board.clientWidth;
        // draw a line to x,y from last coordinates
        ctx.lineTo(x, y);
        // stroke renders the path
        ctx.stroke();
        // mouse move
        let mmp = {
            widthOld,
            x,
            y,
            id: "mm",
            color: ctx.strokeStyle,
            width: ctx.lineWidth
        }
        if(undoArr[currentSlideIndex] && undoArr[currentSlideIndex].length)
            undoArr[currentSlideIndex].push(mmp);
        else
            undoArr[currentSlideIndex] = [mmp];
        // let el = document.createElement("img")
        // el.src = slideArr[currentSlideIndex].imageUrl;
        // el.addEventListener("load",() => ctx);
        slideArr[currentSlideIndex].imageUrl = board.toDataURL();
      //  socket.emit("mm", mmp);
    }
})
window.addEventListener("mouseup", function () {
    // close Path
    console.log("Mouse up")
    // ctx.closePath();
    isPenDown = false;
})
function getLocation() {
    let { top } = board.getBoundingClientRect();
    return top;
}
function undoLast() {
    //  pop the last point

    if (undoArr[currentSlideIndex].length >= 2) {
        //  lines 
        console.log(undoArr[currentSlideIndex]);
        console.log(currentSlideIndex)
        let tempArr = []
        for (let i = undoArr[currentSlideIndex].length - 1; i >= 0; i--) {
            console.log(undoArr[i]);
            let id = undoArr[currentSlideIndex][i].id;
            if (id == "md") {
                tempArr.unshift(undoArr[currentSlideIndex].pop());
                break;
            } else {
                // undoArr.pop();
                tempArr.unshift(undoArr[currentSlideIndex].pop());
            }
        }
        redoArr[currentSlideIndex].push(tempArr);
        //  clear canvas=> 
        ctx.clearRect(0, 0, board.width, board.height);
        // redraw
        redraw();
    }
}
function redoLast() {
    if (redoArr[currentSlideIndex].length > 0) {
        //  lines 
        let undoPath = redoArr[currentSlideIndex].pop();
        for (let i = 0; i < undoPath.length; i++) {
            undoArr[currentSlideIndex].push(undoPath[i]);
        }
        //  clear canvas=> 
        ctx.clearRect(0, 0, board.width, board.height);
        // redraw
        redraw();
    }
}
function redraw() {
    if(!undoArr[currentSlideIndex]) return;
    for (let i = 0; i < undoArr[currentSlideIndex].length; i++) {
        let {widthOld, x, y, id, color, width } = undoArr[currentSlideIndex][i];
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        x = (x*board.clientWidth)/widthOld;
        if (id == "md") {
            ctx.beginPath();
            ctx.moveTo(x, y)
        } else if (id == "mm") {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}