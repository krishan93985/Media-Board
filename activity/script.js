let constraints = { video: true, audio: { echoCancellation:true } };

let videoContainer = document.querySelector(".video-container")
let timmingElem = document.querySelector("#timming");
let canvasBoard = document.querySelector(".board");
let videoPlayer = document.querySelector("video");
let opener = document.querySelector(".opener");
let addSlide = document.querySelector("#add-slide");
let onRemoveSlide = document.querySelector("#remove-slide");
let slideList = document.querySelectorAll(".slide");
let slidePane = document.querySelector(".slides");
let slidePaneContainer = document.querySelector(".slides-container");
let upArrow = document.querySelector("#up-slide");
let downArrow = document.querySelector("#down-slide");
let currentSlideIndexContainer = document.querySelector(".curr-slide-number");
let slideNumber = document.querySelector(".number");
let navOptionsContainer = document.querySelector(".nav-options-container");
let navOptions = document.querySelectorAll(".nav-options");
let toolPanel = document.querySelector(".tool-panel");
let slideContols = document.querySelectorAll(".slide-control");
let canvasTools = document.querySelectorAll(".canvas-tool");
let MediaControls = document.querySelectorAll(".media-control");
let allToolNodes = document.querySelectorAll(".only-tool");
const warningEl = document.getElementById('warning');
let saveSlide=document.querySelector("#save-slide");
let camera = document.querySelector(".camera");
// console.log(toolPanel.clientHeight);

let firstSlide = slideList[0];
let cameraOn = false;

let mediaRecorder=[];
let chunks = [];
let isSlidesOpen = false;
let currentSlideIndex = 0;
let lastToolboxIndex = -1;
let allNavTools = [slideContols,canvasTools,MediaControls];
const newSlideInfo = {
  imageUrl:"./NewIcons/new-sheet.jpeg",
  zoomedUrl:"./NewIcons/new-sheet.jpeg",
  stickyPads:[],
  padsContent:[]
};

let slideArr = [newSlideInfo];
// local storage configuration
// 1.add slide
// 2.remove slide
// 3.slide up
// 4.slide down
// 5.onclick slide
// 6.window onload

window.addEventListener("load",() => {
  const storedSlideArr = window.localStorage.getItem("slideArr");
  
  if(storedSlideArr){
  //update slideArr
  slideArr = JSON.parse(storedSlideArr);
  
  //update currentSlideIndex
  currentSlideIndex = JSON.parse(window.localStorage.getItem("currentSlideIndex"));

  //append slides to slidepane
  slideArr.forEach((slide,index) => {
    
    const slideElement = document.createElement("img");
    slideElement.setAttribute("src",`${slide.zoomedUrl}`);
    console.log(slide.zoomedUrl)
    slideElement.setAttribute("alt","slide");
    slideElement.setAttribute("class","slide");
    slideElement.addEventListener("click",handleActiveSheet);

    if(index === currentSlideIndex)
      slideElement.classList.add("active-slide");
    
      slidePane.appendChild(slideElement);
      //console.log(slideElement);
  })

  //draw current slide image to canvas
    var image = new Image();
    //console.log(slideArr[currentSlideIndex].imageUrl)
    image.src = slideArr[currentSlideIndex].imageUrl;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    }

  displayCurrentStickyPads(currentSlideIndex);
} else{
    currentSlideIndex = 0;
    slideArr = [newSlideInfo];

    //append first image element
    const slideElement = document.createElement("img");
    slideElement.setAttribute("src",`${slideArr[0].imageUrl}`);
    slideElement.setAttribute("alt","slide");
    slideElement.setAttribute("class","slide");
    slideElement.classList.add("active-slide");
    slideElement.addEventListener("click", handleActiveSheet);
    slidePane.appendChild(slideElement);
    //console.log(slidePane);
}


})

window.addEventListener("keydown",(event) => {
  const allSlides = document.querySelectorAll(".slide");
  if(event.code === "ArrowUp"){
    if(currentSlideIndex === 0) return;
    
    allSlides[currentSlideIndex-1].click();
  }
  if(event.code === "ArrowDown"){
    if(currentSlideIndex === allSlides.length-1) return;
    
    allSlides[currentSlideIndex+1].click();
  }
})

for(var index=0;index < navOptions.length;index++){
  navOptions[index].addEventListener("click",(event) => {
    //remove active tool marker
    const toolIdx = Array.prototype.slice.call(navOptionsContainer.children).indexOf(event.currentTarget);
    for(element of navOptions){
        element.classList.remove("active-nav-option");
    }

    //add active tool marker
    event.currentTarget.classList.add("active-nav-option");
    
    //hide last nav tools
    if(lastToolboxIndex != -1){
      for(navTool of allNavTools[lastToolboxIndex]){
          navTool.classList.remove("show-flex");
      }
    }

    //show current nav tools
    for(navTool of allNavTools[toolIdx]){
      navTool.classList.add("show-flex");
    }

    lastToolboxIndex = toolIdx;
  })
}

const fillCurrentSlideIndexContainer = () => {
  slideNumber.innerText = (`Slide : ${currentSlideIndex+1}`);
}

const removeCurretStickyPads = () => {
  const currentStickyPads = document.querySelectorAll(".stickyPad");
  for(stickyPad of currentStickyPads){
    document.body.removeChild(stickyPad);
  }
}

const addStickyPadFunctionality = (stickyNode) => {
  let stickyPad = stickyNode;
  let navBar = stickyPad.childNodes[0];
  let minimize = navBar.childNodes[0];
  let close = navBar.childNodes[1];
  let textbox = stickyPad.childNodes[1];

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
    
    textbox.style.display = "none";
    navBar.style.height = "97%";
} else {
    let currHeight = "";
    for(alpha of stickyPad.style.height){
        if(alpha == "r" || alpha == "p") break;
        currHeight += alpha;
    }
    currHeight = Number(currHeight);
    let unit = stickyPad.style.height[stickyPad.style.height.length-1] === "x"?"px":"rem";
    
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

const displayCurrentStickyPads = (index) => {
  slideArr[index].stickyPads.forEach((stickyPad,i) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(stickyPad, 'text/html');
    let stickyNode = doc.body.childNodes[0];
    let node = doc.body.childNodes[0].childNodes[1].childNodes[0];
    
    let textbox = addStickyPadFunctionality(stickyNode);
    if(node.nodeName === "TEXTAREA"){
        if(slideArr[index].padsContent[i] !== "" && slideArr[index].padsContent[i])
          textbox.childNodes[0].value =  slideArr[index].padsContent[i];
    } 
    else{
       node.src = slideArr[index].padsContent[i];
    }
    document.body.appendChild(doc.body.childNodes[0]);
  })
}

const moveSlideUp = () => {
  //only one slide present
  if(!isSlidesOpen || currentSlideIndex === 0) return;
  
  const allSlides = document.querySelectorAll(".slide");
  const currentSlide = allSlides[currentSlideIndex];
  const prevSlide = allSlides[currentSlideIndex-1];
  
  //swap slide properties
  const swapElement1 = slideArr[currentSlideIndex-1];
  slideArr.splice(currentSlideIndex-1,1);
  slideArr.splice(currentSlideIndex,0,swapElement1);

  //update slideArr in localstorage
  window.localStorage.setItem("slideArr",JSON.stringify(slideArr));

  //swap previous slide with current slide
  slidePane.removeChild(currentSlide);
  slidePane.insertBefore(currentSlide,prevSlide);
  
  currentSlideIndex--;
  //update current slide index in localstorage
  window.localStorage.setItem("currentSlideIndex",JSON.stringify(currentSlideIndex));
  
  fillCurrentSlideIndexContainer();
}

const moveSlideDown = () => {
  //do nothing when current slide is last slide
  if(!isSlidesOpen || currentSlideIndex === slideArr.length-1) return;

  const allSlides = document.querySelectorAll(".slide");
  const currentSlide = allSlides[currentSlideIndex];
  const nextSlide = allSlides[currentSlideIndex+1];

  //swap slide properties
  const swapElement1 = slideArr[currentSlideIndex];
  slideArr.splice(currentSlideIndex,1);
  slideArr.splice(currentSlideIndex+1,0,swapElement1);

  //update slideArr in localstorage
  window.localStorage.setItem("slideArr",JSON.stringify(slideArr));

  //swap next slide with current slide
  slidePane.removeChild(nextSlide);
  slidePane.insertBefore(nextSlide,currentSlide);
  
  currentSlideIndex++;
  
  //update current slide index in localstorage
  window.localStorage.setItem("currentSlideIndex",JSON.stringify(currentSlideIndex));

  fillCurrentSlideIndexContainer();
}

upArrow.addEventListener("click",moveSlideUp);
downArrow.addEventListener("click",moveSlideDown);

const openSlides = () => {
  slidePane.classList.toggle("grid-show");
  currentSlideIndexContainer.classList.toggle("show-block");
  isSlidesOpen = !isSlidesOpen;
  opener.src = isSlidesOpen ? "./close.png" : "./hamburger.png";
  fillCurrentSlideIndexContainer();
}

opener.addEventListener('click', openSlides);

// const drawCurrentSlide = (e) => {
//   const currentNode = Array.prototype.slice.call(slidePane.children);
//   const currIndex = currentNode.indexOf(e.currentTarget);
//   const idx = Number(currIndex);
//   currentSlideIndex = idx;
//   const url = slideList[idx].src;
//   canvasBoard.getContext('2d').drawImage(url, 0, 0);
// }

const removeSlide = (e) => {
  if (slideArr.length <= 1) return;
  if (!isSlidesOpen)
    opener.click();

  //remove current slide info from array
  slideArr.splice(currentSlideIndex, 1);
  
  //update slideArr in localstorage
  window.localStorage.setItem("slideArr",JSON.stringify(slideArr));

  const currentSlides = document.querySelectorAll(".slide");

  //remove current slide
  slidePane.removeChild(currentSlides[currentSlideIndex]);

  currentSlideIndex = currentSlideIndex === slideArr.length ? currentSlideIndex - 1 : currentSlideIndex;

  //update current slide index in localstorage
  window.localStorage.setItem("currentSlideIndex",JSON.stringify(currentSlideIndex));
  
  //clear canvas
  ctx.clearRect(0, 0, board.width, board.height);

  //remove current sticky pads from body
  removeCurretStickyPads();

  //draw image to canvas
  var image = new Image();
  image.src = slideArr[currentSlideIndex].imageUrl;
  image.onload = () => {
    canvasBoard.getContext('2d').drawImage(image, 0, 0);
  }

  displayCurrentStickyPads(currentSlideIndex);

  //set active slide color  
  const slides = document.querySelectorAll(".slide");
  slides[currentSlideIndex].classList.add("active-slide");
  
  fillCurrentSlideIndexContainer();
}

onRemoveSlide.addEventListener("click", removeSlide);

addSlide.addEventListener("click", function () {
  //simulate click event on slidePane
  if (!isSlidesOpen)
    opener.click();

  //select all sheets and get currentSheetElement
  let sheetsArr = document.querySelectorAll(".slide");
  let currentSheetElem = sheetsArr[currentSlideIndex];

  addImageToLastSlide(currentSheetElem, currentSlideIndex);

  //create a new sheet
  let NewSheet = document.createElement("img");
  NewSheet.classList.add("slide");
  NewSheet.setAttribute("alt", "icon");
  NewSheet.setAttribute("src", "./NewIcons/new-sheet.jpeg");

  //insert new sheet after currentsheet
  if (currentSlideIndex !== slideArr.length - 1)
    slidePane.insertBefore(NewSheet, currentSheetElem.nextSibling);
  else
    slidePane.appendChild(NewSheet);
  
  //remove active class from last slide
  currentSheetElem.classList.remove("active-slide");
  currentSlideIndex++;

  //clear canvas and change active slide
  ctx.clearRect(0, 0, board.width, board.height);
  NewSheet.classList.add("active-slide");
  NewSheet.addEventListener("click", handleActiveSheet);
  slideArr.splice(currentSlideIndex, 0, newSlideInfo);
  
  //add slideArr to localstorage
  window.localStorage.setItem("slideArr",JSON.stringify(slideArr));

  //add current slide index to localstorage
  window.localStorage.setItem("currentSlideIndex",JSON.stringify(currentSlideIndex));

  fillCurrentSlideIndexContainer();
})

function handleActiveSheet(e) {
  let MySheet = e.currentTarget;
  let sheetsArr = document.querySelectorAll(".slide");
  sheetsArr.forEach(function (sheet) {
    sheet.classList.remove("active-slide");
  })
  if (!MySheet.classList[1])
    MySheet.classList.add("active-slide");
  //  index
  addImageToLastSlide(sheetsArr[currentSlideIndex], currentSlideIndex);

  const currentNode = Array.prototype.slice.call(slidePane.children);
  const currIndex = currentNode.indexOf(MySheet);
  const sheetIdx = Number(currIndex);
  currentSlideIndex = sheetIdx;
  
  //update current slide index in localstorage
  window.localStorage.setItem("currentSlideIndex",JSON.stringify(currentSlideIndex));

  //clear canvas
  ctx.clearRect(0, 0, board.width, board.height);

  //draw current slide image on canvas
  if (slideArr.length >= 1) {
    var image = new Image();
    image.src = slideArr[sheetIdx].imageUrl;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    }
  }

  //display sticky pads on canvas
  displayCurrentStickyPads(sheetIdx);

  fillCurrentSlideIndexContainer();
}

const addImageToLastSlide = (element, index) => {
  let c = document.createElement("canvas");
  c.width = canvasBoard.scrollWidth;
  c.height = canvasBoard.scrollHeight;
  let ctxx = c.getContext("2d");

  ctxx.translate(c.width / 2, c.height / 2);
  ctxx.translate(-c.width / 2, -c.height / 2);
  ctxx.drawImage(canvasBoard, 0, 0);

  const url = c.toDataURL("image/png;base64");
  //console.log(slideArr)
  slideArr[index] = Object.assign({},slideArr[index],{imageUrl:url});
  
  //zoomedUrl to be added
  let canvas=document.createElement("canvas");
    html2canvas(document.body).then(
      function (canvas) {
        let spareCanvas=document.createElement("canvas");
        spareCanvas.width=document.body.clientWidth;
        spareCanvas.height=document.body.clientHeight;
        let tool=spareCanvas.getContext("2d");
        tool.fillStyle = "white";
        tool.fill();
        tool.drawImage(canvas,0, 
          toolPanel.clientHeight, canvasBoard.scrollWidth,canvasBoard.scrollHeight ,0,toolPanel.clientHeight,canvasBoard.scrollWidth, canvasBoard.scrollHeight);
    let link=spareCanvas.toDataURL();
    slideArr[index] = Object.assign({},slideArr[index],{zoomedUrl:link});
    element.src = link;
  })


  let currentStickyPads = document.querySelectorAll(".stickyPad");
  
  //store current sticky pads in slideArr
  let stickyPadsArray = Array.prototype.slice.call(currentStickyPads);
  stickyPadsArray = stickyPadsArray.map(element => element.outerHTML)
  slideArr[index].stickyPads = stickyPadsArray;
  //console.log(stickyPadsArray)
  
  //store sticky pads content in slideArr
  let tempPadsContent = [];
  currentStickyPads.forEach((element,i) => {
    let node = element.childNodes[1].childNodes[0];
    if(node.nodeName === "TEXTAREA")
      tempPadsContent[i] = (node.value); //stickypad is a textarea
    else {
      tempPadsContent[i] = (node.src); //stickypad is an image
    }
  })
  slideArr[index].padsContent = tempPadsContent;

  //console.log(slideArr[index].padsContent)
  
  //update slideArr in localstorage
  window.localStorage.setItem("slideArr",JSON.stringify(slideArr));
  
  //remove all sticky pads from body
  for(stickyPad of currentStickyPads){
    document.body.removeChild(stickyPad);
  }

  //change last slide image src
  element.src = url; //src to be changed to zoomedUrl
}

const saveCurrentSlide = () => {
  let sheetsArr = document.querySelectorAll(".slide");
  let currentSheetElem = sheetsArr[currentSlideIndex];
  addImageToLastSlide(currentSheetElem, currentSlideIndex);
  window.localStorage.setItem("slideArr",JSON.stringify(slideArr));
  window.localStorage.setItem("currentSlideIndex",JSON.stringify(currentSlideIndex));
  
  displayCurrentStickyPads(currentSlideIndex);
}

saveSlide.addEventListener("click",saveCurrentSlide)

let captureBtn = document.querySelector("#click-picture");
captureBtn.addEventListener("click", function (e) {
  captureBtn.classList.add("capture-animation");
  capture();
  setTimeout(function () {
    captureBtn.classList.remove("capture-animation");
  }, 1000);
});

camera.addEventListener("click", function () {
  if (!cameraOn) {
    navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
      //console.log(mediaStream)
      if('srcObject' in videoPlayer){
        videoPlayer.srcObject = mediaStream;
      } else{
        videoPlayer.src = URL.createObjectURL(mediaStream);
      }
      mediaRecorder.push(mediaStream);
    })
    camera.src = "./NewIcons/camera-on.png";
    videoContainer.classList.add("video-on");
    cameraOn = !cameraOn;
  } else {
    const mediaStream2 = videoPlayer.srcObject;
    const tracks = mediaStream2.getTracks();
    //console.log(tracks)

    tracks[0].stop();
    tracks[1].stop();

    camera.src = "./NewIcons/camera-off.png";
    videoContainer.classList.remove("video-on");
    cameraOn = !cameraOn;
  }
})

  //capture slide
function capture() {
  html2canvas(document.body).then(
    function (canvas) {
        let spareCanvas=document.createElement("canvas");
        spareCanvas.width=document.body.clientWidth;
        spareCanvas.height=document.body.clientHeight;
        let tool=spareCanvas.getContext("2d");
        tool.fillStyle = "white";
        tool.fill();
        tool.drawImage(canvas,0, 
          toolPanel.clientHeight, canvasBoard.scrollWidth,canvasBoard.scrollHeight ,0,toolPanel.clientHeight,canvasBoard.scrollWidth, canvasBoard.scrollHeight);
        let link=spareCanvas.toDataURL();
        addMediaToGallery(link,"img");
      })
}


function startCounting() {
  timmingElem.classList.add("timming-active");
  let timeCount = 0;
  clearObj = setInterval(function () {
    let seconds = (timeCount % 60) < 10 ? `0${Number.parseInt(timeCount % 60)}` : `${Number.parseInt(timeCount % 60)}`;
    let minutes = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount / 60)}` : `${Number.parseInt(timeCount / 60)}`;
    let hours = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount / 3600)}` : `${Number.parseInt(timeCount / 3600)}`;
    timmingElem.innerText = `${hours}:${minutes}:${seconds}`;
    timeCount++;

  }, 1000);
}
function stopCounting() {
  timmingElem.classList.remove("timming-active");
  timmingElem.innerText = "00:00:00";
  clearInterval(clearObj);
}

//drag and drop video element
let initialX = null;
let initialY = null;
let isVidCtnDown = false;
videoPlayer.addEventListener("mousedown", function (e) {
  initialX = e.clientX;
  initialY = e.clientY;
  isVidCtnDown = true
})
videoPlayer.addEventListener("mousemove", function (e) {
  if (isVidCtnDown == true) {
    let body = document.querySelector("body");
    //if video element is going out of canvas
    let { top, left, right, bottom } = videoContainer.getBoundingClientRect();
    
    let finalX = e.clientX;
    let finalY = e.clientY;
    let dX = finalX - initialX;
    let dY = finalY - initialY;
    if((right+dX) >= body.clientWidth || (bottom+dY) >= body.clientHeight) 
      return;
    
    videoContainer.style.top = top + dY + "px";
    videoContainer.style.left = left + dX + "px";
    initialX = finalX;
    initialY = finalY;
  }
})
videoPlayer.addEventListener("mouseup", function (e) {
  isVidCtnDown = false
})
//  
videoPlayer.addEventListener("mouseleave", function (e) {
  isVidCtnDown = false
})