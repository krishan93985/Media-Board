function createSticky(value) {
    // <div class="stickyPad">
    //     <div class="nav-bar">
    //         <div class="close"></div>
    //         <div class="minimize"></div>
    //     </div>
    //     <div class="textbox">
    //         <textarea name="" id="" cols="30" rows="10"></textarea></div>
    // </div>
    // create 
    let textBox = createBox();
    let textarea = document.createElement("textarea");
    if(value !== "")
        textarea.value = value;
    textBox.appendChild(textarea);
}