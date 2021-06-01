let constraints = { video: true, audio: true };

let timmingElem=document.querySelector("#timming");
let addSlide=document.querySelector(".add-slide");
let removeSlide=document.querySelector(".remove-slide");

let canvasBoard = document.querySelector(".board");
let videoPlayer = document.querySelector("video");
let vidRecordBtn = document.querySelector("#record-video");
let hamburger = document.querySelector(".hamburger");

let mediaRecorder;
let chunks = [];
let recordState = false;

let filter = "";

let maxZoom = 3;
let minZoom = 1;
let currZoom = 1;

let allFilters = document.querySelectorAll(".filter");

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    filter = e.currentTarget.style.backgroundColor;
    removeFilter();
    addFilterToScreen(filter);
  });
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
  // let a=document.createElement("a");
  // a.download="vid.mp4";
  // a.href=url;
  // a.click();
  // a.remove();
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
addSlide.addEventListener("click",function(){
  
})