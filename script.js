console.clear();
console.log("HI!!!");

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filterBtn = [...document.querySelectorAll('.filter')];
let interval;

// let dict = JSON.parse("data.json")
// console.log(dict)
// original -150, 500, -550
// let RED_PARAM = -1000; // RED PARAM IS HOW SOCIAL AM I
// let GREEN_PARAM = 500; // GREEN PARAM IS HOW EMPATH/DREAMER AM I
// let BLUE_PARAM = -550; // BLUE PARAM IS HOW INTELIGENT/CREATIVE AM I
let labels_dict;

let RED_PARAM;
let GREEN_PARAM;
let BLUE_PARAM;
let data;
readTextFile("mostly_dreamy_filter.json", function(text){
    data = JSON.parse(text);
    RED_PARAM = parseInt(map_values(data["social"], 0, 100, -1000, -300));
    GREEN_PARAM = parseInt(map_values(data["dreamer"], 0, 100, 400, 800));
    BLUE_PARAM = parseInt(map_values(data["achiever"], 0,100, -1000, -500));
    console.log(RED_PARAM)
    console.log(GREEN_PARAM)
    console.log(BLUE_PARAM)
});


function getVedio(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.srcObject = localMediaStream;
            // video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err =>
            console.error('Oops')
        )
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function map_values(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function set_params(){
    let data;
    readTextFile("data.json", function(text){
        data = JSON.parse(text);
        RED_PARAM = data["social"];
        GREEN_PARAM = data["dreamer"];
        BLUE_PARAM = data["intelligent"];
    });
}

    function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    let filterType = this.dataset.filter || 0;
    console.log(this.dataset, 'hi', filterType);

    canvas.width = innerWidth - 120;
    canvas.height = innerHeight - 80;

    // let text = JSON.stringify("data.json")
    // console.log(text)
    // let text = new json("data,json")
    // const reader = new FileReader()
    // reader.readAsText()
    // let text = JSON.parse()



    clearInterval(interval);

    return interval = setInterval(() => {
        ctx.drawImage(video, 0, 0, innerWidth - 120, innerHeight - 80);
        // take the pixels out

        let pixels = ctx.getImageData(0, 0, innerWidth - 120, innerHeight - 80);
        // pixels 內最底部的陣列每四個為一組，分別代表 RGBA 的數值，一組結束後會接著排下一組

        pixels = rgbSplit(pixels);

        // put them back
        ctx.putImageData(pixels, 0, 0);
    },16);
}

// function takePhoto(){
//     // 播放快門聲
//     snap.currentTime = 0;
//     snap.play();
//
//     // 獲得 canvas 內的 data
//     const data = canvas.toDataURL('image/jpeg');
//     const link = document.createElement('a');
//     link.setAttribute('download', 'hello');
//     link.innerHTML = `<image src="${data}" alt="Hi">`;
//     strip.insertBefore(link, strip.firstChild);
//
// }

// function redEffect(pixels) {
//     for (let i = 0; i < pixels.data.length; i+=4) {
//         pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
//         pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
//         pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
//     }
//     return pixels;
// }

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + RED_PARAM] = pixels.data[i + 0]; // RED
        pixels.data[i + GREEN_PARAM] = pixels.data[i + 1]; // GREEN
        pixels.data[i + BLUE_PARAM] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

getVedio();
// set_params();
video.addEventListener('canplay', paintToCanvas);
filterBtn.map(node => node.addEventListener('click', paintToCanvas));