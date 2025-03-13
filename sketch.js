let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: true };
let triangles;
let cnv;

// Scrolling Text Variables
let sentences = [
  { en: "Art Workers Social Credit Score", zh: "艺术工人社会信用评分" },
  { en: "Status", zh: "状态" },
  { en: "Health", zh: "健康" },
];
let scrollingTexts = [];
let canvasWidth = 640;
let canvasHeight = 480;

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  cnv = createCanvas(canvasWidth, canvasHeight);
  pixelDensity(1);
  let cx = (windowWidth - cnv.width) / 2;
  let cy = (windowHeight - cnv.height) / 2;
  cnv.position(cx, cy);

  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(canvasWidth, canvasHeight);
  video.hide();

  // Load the triangle indices for drawing the mesh
  triangles = faceMesh.getTriangles();

  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);

  // Create initial scrolling texts
  for (let i = 0; i < 5; i++) {
    addNewText();
  }
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the triangles
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < triangles.length; j++) {
      let indices = triangles[j];
      let pointA = face.keypoints[indices[0]];
      let pointB = face.keypoints[indices[1]];
      let pointC = face.keypoints[indices[2]];

      noFill();
      stroke(0, 255, 0);
      strokeWeight(1);
      triangle(pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y);
    }
  }

  // Draw scrolling text at the top
  drawScrollingText();
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  faces = results;
}

// Draw scrolling text at the top of the canvas
function drawScrollingText() {
  fill(255, 0, 0);
  noStroke();
  textSize(28);
  textAlign(LEFT);

  for (let i = scrollingTexts.length - 1; i >= 0; i--) {
    let txt = scrollingTexts[i];
    txt.x -= txt.speed; // Move text from right to left

    text(`${txt.content.en} ${txt.randomNumber}`, txt.x, txt.y);
    text(`${txt.content.zh} ${txt.randomNumber}`, txt.x, txt.y + 50);

    if (txt.x < -textWidth(`${txt.content.en} ${txt.randomNumber}`)) {
      scrollingTexts.splice(i, 1);
      addNewText();
    }
  }
}

function addNewText() {
  let sentence = random(sentences);
  scrollingTexts.push({
    content: sentence,
    x: canvasWidth + random(50, 150), // Starts off the right edge of the canvas
    y: random(20, height - 50),
    speed: random(1, 5),
    randomNumber: floor(random(1, 101)), // Random number from 1 to 100
  });
}
