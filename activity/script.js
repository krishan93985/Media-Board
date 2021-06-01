let constraints = { video: true, audio: true };

let timmingElem=document.querySelector("#timming");
let canvasBoard = document.querySelector(".board");
let videoPlayer = document.querySelector("video");
let vidRecordBtn = document.querySelector("#record-video");
let opener = document.querySelector(".opener");
let addSlide=document.querySelector("#add-slide");
let slideList=document.querySelectorAll(".slide");
let slidePane = document.querySelector(".slides");
let firstSlide=document.querySelector("img[slideIdx='0']")

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
  const currIndex = e.currentTarget.getAttribute("slideIdx");
  const idx = Number(currIndex);
  currentSlideIndex = idx;
  const url = slideList[idx].src;
  canvasBoard.getContext('2d').drawImage(url,0,0);
}

addSlide.addEventListener("click",function(){
  if(!isSlidesOpen)  
    opener.click();
  let sheetsArr = document.querySelectorAll(".slide");
  let lastSheetElem = sheetsArr[sheetsArr.length - 1];
  let idx = lastSheetElem.getAttribute("slideIdx");
  idx = Number(idx);

  if(idx !== currentSlideIndex)
    addImageToLastSlide(lastSheetElem,idx);
  let NewSheet = document.createElement("img");
  NewSheet.classList.add("slide");
  NewSheet.setAttribute("slideIdx", idx + 1);
  NewSheet.setAttribute("alt","icon");
  currentSlideIndex = idx+1;
    NewSheet.setAttribute("src","./NewIcons/new-sheet.jpeg");
    // page add
    console.log(slidePane)
    slidePane.appendChild(NewSheet);

    sheetsArr.forEach(function (sheet) {
    sheet.classList.remove("active-slide");
    })
  
  ctx.clearRect(0, 0, board.width, board.height);
  NewSheet.classList.add("active-slide")
  NewSheet.addEventListener("click",handleActiveSheet);
  //lastSheetElem.addEventListener("click", handleActiveSheet);
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
  let sheetIdx = MySheet.getAttribute("slideIdx")

    addImageToLastSlide(sheetsArr[currentSlideIndex],currentSlideIndex);

  sheetIdx = Number(sheetIdx);
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
captureBtn.addEventListener("click", function () {
  let innerDiv = captureBtn.querySelector("#click-div");
  innerDiv.classList.add("capture-animation");
  capture(filter);
  setTimeout(function () {
    innerDiv.classList.remove("capture-animation");
  }, 1000);
});

vidRecordBtn.addEventListener("click", function () {
  removeFilter();
  let innerDiv = vidRecordBtn.querySelector("#record-div");
  if (!recordState) {
    recordState = true;
    innerDiv.classList.add("recording-animation");
    currZoom = 1;
    videoPlayer.style.transform = `scale(${currZoom})`;
    startCounting();
    mediaRecorder.start();
  } else {
    recordState = false;
    innerDiv.classList.remove("recording-animation");
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