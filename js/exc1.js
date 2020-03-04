//function to allow to drop a picture
function allowDrop(ev) {
    ev.preventDefault();
}

//function to drag a picture
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

//function to drop a picture
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
