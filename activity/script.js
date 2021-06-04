let constraints = { video: true, audio: true };

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
const warningEl = document.getElementById('warning');


let firstSlide = slideList[0];
let camera = document.querySelector(".camera");
let cameraOn = false;

let mediaRecorder=[];
let chunks = [];
let isSlidesOpen = false;
let currentSlideIndex = 0;

let slideArr = [];



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

const fillCurrentSlideIndexContainer = () => {
  const textNode = document.createTextNode(`${currentSlideIndex}`);
  currentSlideIndexContainer.innerText = (`${currentSlideIndex+1}`);
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

  //swap previous slide with current slide
  slidePane.removeChild(currentSlide);
  slidePane.insertBefore(currentSlide,prevSlide);
  
  currentSlideIndex--;

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

  //swap next slide with current slide
  slidePane.removeChild(nextSlide);
  slidePane.insertBefore(nextSlide,currentSlide);
  
  currentSlideIndex++;
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

firstSlide.classList.add("active-slide");
firstSlide.addEventListener("click", handleActiveSheet);

opener.addEventListener('click', openSlides);

const drawCurrentSlide = (e) => {
  const currentNode = Array.prototype.slice.call(slidePane.children);
  const currIndex = currentNode.indexOf(e.currentTarget);
  const idx = Number(currIndex);
  currentSlideIndex = idx;
  const url = slideList[idx].src;
  canvasBoard.getContext('2d').drawImage(url, 0, 0);
}

const removeSlide = (e) => {
  if (slideArr.length <= 1) return;
  if (!isSlidesOpen)
    opener.click();
  //remove current img src from array
  slideArr.splice(currentSlideIndex, 1);
  const currentSlides = document.querySelectorAll(".slide");

  //remove current slide
  slidePane.removeChild(currentSlides[currentSlideIndex]);

  currentSlideIndex = currentSlideIndex === slideArr.length ? currentSlideIndex - 1 : currentSlideIndex;

  //clear canvas
  ctx.clearRect(0, 0, board.width, board.height);

  //draw image to canvas
  var image = new Image();
  image.src = slideArr[currentSlideIndex];
  image.onload = () => {
    canvasBoard.getContext('2d').drawImage(image, 0, 0);
  }
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
  slideArr.splice(currentSlideIndex, 0, "./NewIcons/new-sheet.jpeg");
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

  ctx.clearRect(0, 0, board.width, board.height);
  if (slideArr.length >= 1) {
    var image = new Image();
    image.src = slideArr[sheetIdx];
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    }
  }
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
  slideArr[index] = url;
  element.src = url;
}

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
      videoPlayer.srcObject = mediaStream;
      mediaRecorder.push(mediaStream);
    })
    camera.src = "./NewIcons/camera-on.png";
    videoContainer.classList.add("video-on");
    cameraOn = !cameraOn;
  } else {
    const mediaStream2 = videoPlayer.srcObject;

    const tracks = mediaStream2.getTracks();

    tracks[1].stop();
    tracks[2].stop();

    camera.src = "./NewIcons/camera-off.png";
    videoContainer.classList.remove("video-on");
    cameraOn = !cameraOn;

  }
})

function capture() {
  // let c = document.createElement("canvas");
  // c.width = canvasBoard.scrollWidth;
  // c.height = canvasBoard.scrollHeight;
  // let ctx = c.getContext("2d");

  // ctx.translate(c.width / 2, c.height / 2);
  // ctx.scale(currZoom, currZoom);
  // ctx.translate(-c.width / 2, -c.height / 2);
  // ctx.drawImage(canvasBoard, 0, 0);

  // addMediaToGallery(c.toDataURL(), "img");
  html2canvas(completeBoard).then(
    function (canvas) {
      addMediaToGallery(canvas.toDataURL(), "img");
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
    let finalX = e.clientX;
    let finalY = e.clientY;
    let dX = finalX - initialX;
    let dY = finalY - initialY;
    //  
    let { top, left } = videoContainer.getBoundingClientRect();
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
