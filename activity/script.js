let constraints = { video: true, audio: true };

let timmingElem=document.querySelector("#timming");
let canvasBoard = document.querySelector(".board");
let videoPlayer = document.querySelector("video");
let vidRecordBtn = document.querySelector("#record-video");
let opener = document.querySelector(".opener");
let addSlide=document.querySelector("#add-slide");
let onRemoveSlide = document.querySelector("#remove-slide");
let slideList=document.querySelectorAll(".slide");
let slidePane = document.querySelector(".slides");
let slidePaneContainer = document.querySelector(".slides-container");
let firstSlide=slideList[0];

let mediaRecorder;
let chunks = [];
let recordState = false;
let isSlidesOpen = false;
let currentSlideIndex = 0;

let slideArr=[];
let filter = "";

let maxZoom = 3;
let minZoom = 1;
let currZoom = 1;

const openSlides = () => {
  slidePane.classList.toggle("grid-show");
  isSlidesOpen = !isSlidesOpen;
  opener.src = isSlidesOpen?"./close.png":"./hamburger.png";
}

firstSlide.classList.add("active-slide");
firstSlide.addEventListener("click", handleActiveSheet);

opener.addEventListener('click',openSlides);

const drawCurrentSlide = (e) => {
  const currentNode = Array.prototype.slice.call(slidePane.children);
  const currIndex = currentNode.indexOf(e.currentTarget);
  const idx = Number(currIndex);
  currentSlideIndex = idx;
  const url = slideList[idx].src;
  canvasBoard.getContext('2d').drawImage(url,0,0);
}

const removeSlide = (e) => {
  if(slideArr.length <= 1 ) return;
  if(!isSlidesOpen) 
    opener.click();
  //remove current img src from array
  slideArr.splice(currentSlideIndex,1);
  const currentSlides = document.querySelectorAll(".slide");
  
  //remove current slide
  slidePane.removeChild(currentSlides[currentSlideIndex]);
  
  currentSlideIndex = currentSlideIndex === slideArr.length?currentSlideIndex-1:currentSlideIndex;
  
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
}

onRemoveSlide.addEventListener("click",removeSlide);

addSlide.addEventListener("click",function(){
  //simulate click event on slidePane
  if(!isSlidesOpen)  
    opener.click();
  
  //select all sheets and get currentSheetElement
  let sheetsArr = document.querySelectorAll(".slide");
  let currentSheetElem = sheetsArr[currentSlideIndex];
  
  addImageToLastSlide(currentSheetElem,currentSlideIndex);
  
  //create a new sheet
  let NewSheet = document.createElement("img");
  NewSheet.classList.add("slide");
  NewSheet.setAttribute("alt","icon");
  NewSheet.setAttribute("src","./NewIcons/new-sheet.jpeg");
  //insert new sheet after currentsheet
  if(currentSlideIndex !== slideArr.length-1)
    slidePane.insertBefore(NewSheet,currentSheetElem.nextSibling);
  else 
    slidePane.appendChild(NewSheet);
  //remove active class from last slide
  currentSheetElem.classList.remove("active-slide");
  currentSlideIndex++;
  
  //clear canvas and change active slide
  ctx.clearRect(0, 0, board.width, board.height);
  NewSheet.classList.add("active-slide");
  NewSheet.addEventListener("click",handleActiveSheet);
  slideArr.splice(currentSlideIndex,0,"./NewIcons/new-sheet.jpeg");

})
function handleActiveSheet(e) {
  let MySheet = e.currentTarget;
  let sheetsArr = document.querySelectorAll(".slide");
  sheetsArr.forEach(function (sheet) {
      sheet.classList.remove("active-slide");
  })
  if(!MySheet.classList[1])
      MySheet.classList.add("active-slide");
  //  index
  addImageToLastSlide(sheetsArr[currentSlideIndex],currentSlideIndex);
  
  const currentNode = Array.prototype.slice.call(slidePane.children);
  const currIndex = currentNode.indexOf(MySheet);
  const sheetIdx = Number(currIndex);
  currentSlideIndex = sheetIdx;
  
  ctx.clearRect(0, 0, board.width, board.height);
  if(slideArr.length >= 1){
    var image = new Image();
    image.src = slideArr[sheetIdx];
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    }
  }
}

const addImageToLastSlide = (element,index) => {
  let c = document.createElement("canvas");
  c.width = canvasBoard.scrollWidth;
  c.height = canvasBoard.scrollHeight;
  let ctxx = c.getContext("2d");
  
  ctxx.translate(c.width / 2, c.height / 2);
  ctxx.scale(currZoom, currZoom);
  ctxx.translate(-c.width / 2, -c.height / 2);
  ctxx.drawImage(canvasBoard, 0, 0);
  
  const url = c.toDataURL("image/png;base64");
  slideArr[index]= url; 
  element.src = url;
}

let captureBtn = document.querySelector("#click-picture");
captureBtn.addEventListener("click", function (e) {
  //let innerDiv = captureBtn.querySelector("#click-div");
  captureBtn.classList.add("capture-animation");
  capture(filter);
  setTimeout(function () {
    innerDiv.classList.remove("capture-animation");
  }, 1000);
});

vidRecordBtn.addEventListener("click", function () {
  removeFilter();
  if (!recordState) {
    recordState = true;
    vidRecordBtn.classList.add("recording-animation");
    currZoom = 1;
    videoPlayer.style.transform = `scale(${currZoom})`;
    startCounting();
    mediaRecorder.start();
  } else {
    recordState = false;
    vidRecordBtn.classList.remove("recording-animation");
    stopCounting();
    mediaRecorder.stop();
  }
});

navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
  videoPlayer.srcObject = mediaStream;
})
navigator.mediaDevices.getDisplayMedia(
  {video: { mediaSource: "screen" }
}).then(function (mediaStream) {
  
  mediaRecorder = new MediaRecorder(mediaStream);

mediaRecorder.ondataavailable = e => chunks.push(e.data);
mediaRecorder.onstop = e => {
  const completeBlob = new Blob(chunks, { type: "video/mp4" });
  let url = URL.createObjectURL(completeBlob);
  addMediaToGallery(completeBlob, "video");

};
}).catch(console.log);


function capture(filter) {
  let c = document.createElement("canvas");
  c.width = canvasBoard.scrollWidth;
  c.height = canvasBoard.scrollHeight;
  let ctx = c.getContext("2d");

  ctx.translate(c.width / 2, c.height / 2);
  ctx.scale(currZoom, currZoom);
  ctx.translate(-c.width / 2, -c.height / 2);
  ctx.drawImage(canvasBoard, 0, 0);
  if (filter !== "") {
    ctx.fillStyle = filter;
    ctx.fillRect(0, 0, c.width, c.height);
  }

  addMediaToGallery(c.toDataURL(), "img");
}

function addFilterToScreen(filterColor) {
  let filter = document.createElement("div");
  filter.classList.add("on-screen-filter");
  filter.style.height = "100vh";
  filter.style.width = "100vw";
  filter.style.position = "fixed";
  filter.style.top = "0px";
  filter.style.background = `${filterColor}`;
  document.querySelector("body").appendChild(filter);
}

function removeFilter() {
  let OnScreenfilter = document.querySelector(".on-screen-filter");
  if (OnScreenfilter) OnScreenfilter.remove();
}

function startCounting(){
  timmingElem.classList.add("timming-active");
  let timeCount=0;
  clearObj=setInterval(function(){
      let seconds=(timeCount%60)<10?`0${Number.parseInt(timeCount%60)}`:`${Number.parseInt(timeCount%60)}`;
      let minutes=(timeCount/60)<10?`0${Number.parseInt(timeCount/60)}`:`${Number.parseInt(timeCount/60)}`;
      let hours=(timeCount/3600)<10?`0${Number.parseInt(timeCount/3600)}`:`${Number.parseInt(timeCount/3600)}`;
      timmingElem.innerText=`${hours}:${minutes}:${seconds}`;
      timeCount++;

  },1000);
}
function stopCounting(){
  timmingElem.classList.remove("timming-active");
  timmingElem.innerText="00:00:00";
  clearInterval(clearObj);
}