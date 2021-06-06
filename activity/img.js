let imgInput = document.querySelector("#acceptImg");
imgInput.addEventListener("change", function () {
    let imgObj = imgInput.files[0];
    // console.log(imgObj);
    // img => link 
    let imgLink = URL.createObjectURL(imgObj);
    let textBox = createBox("");
    let img = document.createElement("img");
    let tempImg = document.createElement("img");
    img.setAttribute("class", "upload-img");
    tempImg.src = imgLink;
    tempImg.addEventListener("load",() => {
        img.src = getBase64Url(tempImg);
        textBox.appendChild(img);
    })
    imgInput.value="";
})

function uploadFile() {
    // dialog box
    imgInput.click();
}
// function downloadBoard() {
//     //  create an anchor
//     // e.preventDefault();
//     let a = document.createElement("a");
//     //  set filename to it's download attribute
//     a.download = "file.png";
//     //  convert board to url 
//     let url = board.toDataURL("image/png;base64");
//     //  set as href of anchor
//     a.href = url;
//     // click the anchor
//     a.click();
//     //  reload behaviour does not get triggerd
//     a.remove();

// }