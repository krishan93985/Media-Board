  const getBase64Url = (img,imgObj) => {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    console.log(img)
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
  }

function createBox() {
    let stickyPad = document.createElement("div");
    let navBar = document.createElement("div");
    let close = document.createElement("div");
    close.innerHTML = "&#10006";
    let minimize = document.createElement("div");
    minimize.innerHTML = "&#8722";
    let textbox = document.createElement("div");
    //    add classes
    stickyPad.setAttribute("class", "stickyPad");
    stickyPad.style.height = "14rem";
    stickyPad.style.minHeight = "10rem";
    navBar.setAttribute("class", "nav-bar");
    navBar.style.height = "20%";
    close.setAttribute("class", "close");
    minimize.setAttribute("class", "minimize");
    textbox.setAttribute("class", "textbox");
    // create subtree
    stickyPad.appendChild(navBar);
    stickyPad.appendChild(textbox);
    navBar.appendChild(minimize);
    navBar.appendChild(close);
    // add subtree to page
    document.body.appendChild(stickyPad);
    // close=> remove 
    close.addEventListener("click", () => {
        stickyPad.remove();
    });

    let isOpen = true
    // minimize=> 
    minimize.addEventListener("click", function () {
        if (isOpen) {
            let currHeight = "";
            for(alpha of stickyPad.style.height){
                if(alpha == "r" || alpha == "p") break;
                currHeight += alpha;
            }
            currHeight = Number(currHeight);
            let unit = stickyPad.style.height[stickyPad.style.height.length-1] === "x"?"px":"rem";
            stickyPad.style.minHeight = currHeight*0.2 + unit;
            stickyPad.style.height = currHeight*0.2 + unit;
            console.log(stickyPad.style.height)
            textbox.style.display = "none";
            navBar.style.height = "98%";
        } else {
            let currHeight = "";
            for(alpha of stickyPad.style.height){
                if(alpha == "r" || alpha == "p") break;
                currHeight += alpha;
            }
            currHeight = Number(currHeight);
            let unit = stickyPad.style.height[stickyPad.style.height.length-1] === "x"?"px":"rem";
            console.log(currHeight)
            stickyPad.style.minHeight = "10rem";
            stickyPad.style.height = currHeight*5 + unit;
            textbox.style.display = "flex";
            navBar.style.height = "20%";
        }
        isOpen = !isOpen;
    })
    //  move => draw
    let initialX = null;
    let initialY = null;
    let isStickyDown = false;
    navBar.addEventListener("mousedown", function (e) {
        initialX = e.clientX;
        initialY = e.clientY;
        isStickyDown = true
        navBar.style.cursor = "grabbing";
    })
    navBar.addEventListener("mousemove", function (e) {
        if (isStickyDown == true) {
            let finalX = e.clientX;
            let finalY = e.clientY;
            let dX = finalX - initialX;
            let dY = finalY - initialY;
            //  
            let { top, left } = stickyPad.getBoundingClientRect();
            let topVH = (( top + dY )*100) / window.innerHeight;
            let leftVW = (( left + dX )*100) / window.innerWidth;
            stickyPad.style.top = topVH + "vh";
            stickyPad.style.left = leftVW + "vw";
            initialX = finalX;
            initialY = finalY;
        }
    })
    //  navBar => mouse pointer up 
    navBar.addEventListener("mouseup", function (e) {
        isStickyDown = false
        navBar.style.cursor = "grab";
    })
    //  
    navBar.addEventListener("mouseleave", function (e) {
        isStickyDown = false
    })
    return textbox;
}