const socket = io('https://hiep1810.github.io');

const videoElem = document.getElementById("video");
const videoGuest = document.getElementById("videoGuest");

const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

var displayMediaOptions = {
    video: {
        cursor: "never"
    },
    audio: false
};
  // Set event listeners for the start and stop buttons
  startElem.addEventListener("click", function (evt) {
    startCapture();
}, false);

stopElem.addEventListener("click", function (evt) {
    stopCapture();
}, false);
//openCamera();

console.log = msg => logElem.innerHTML += `${msg}<br>`;
console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`; 

async function startCapture() {
    logElem.innerHTML = "";
    try {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    } catch (err) {
        console.error("Error: " + err);
    }
} 

function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
} 

function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];

    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));


}

const peer = new Peer({key:'lwjd5qra8257b9'});

peer.on('open',id=>$("#id-peer").append(id));




function openStream(){
    const config = {audio: false, video: true};
    return navigator.mediaDevices.getDisplayMedia(config);
}
function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
//buttton ok:
$("#btn-ok").click(
    function(){
        const id = $("#guest-id").val();
        openStream()
        .then(stream =>{
            playStream('video',stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream =>playStream('videoGuest',remoteStream));
        })
    }
);

peer.on('call', call=>{
    openStream()
    .then(stream =>{
        call.answer(stream);
        call.on('stream', remoteStream => playStream('videoGuest',remoteStream));
        playStream('video',stream);
    })
});

$("#btn-register").click(()=>{
    const username = $("#register").val();
    socket.emit("NGUOI_DANG_KY",{ten: username, peerId : $("#id-peer").text()});
});


socket.on('DANH-SACH-ONLINE', userArray =>{
    
    $("#list").html( n =>{
        return "";
    }) ;
    
    userArray.forEach(element =>{
        var e = '<li id="'+element.peerId+'">'+element.ten+'</div>';
        $("#list").append(e);
    })

    socket.on('NGAT-KET-NOI', peerId =>{
        $('#'+peerId+'').remove();
    });
});

socket.on("CO-TK-MOI", value =>{
    var e = '<li id="'+value.peerId+'">'+value.ten+'</div>';
    $("#list").append(e);
});
socket.on("BI-TRUNG", value =>{
    alert("tk bi trung!!");
});

$("#list").on('click','li',function(){
    console.log($(this).attr('id'));
    $("#guest-id").val($(this).attr('id'));
});