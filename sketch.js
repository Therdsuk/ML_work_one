let bodyPose;
let poses = [];
let connections;
let img, bgImg, imgLeft, imgRight, basePoint;
let trash1, trash2, trash3, trash4, trash5, trash6;
let trashObjects = []; // Array to store trash objects
let lastTrashTime = 0;

function preload() {
  bodyPose = ml5.bodyPose();
  img = loadImage("image/crap_body.png");
  bgImg = loadImage("image/background3.png");
  imgLeft = loadImage("image/crap_left_hand.png");
  imgRight = loadImage("image/crap_right_hand.png");
  basePoint = loadImage("image/base_point.png");
  trash1 = loadImage("image/trash_1.png");
  trash2 = loadImage("image/trash_2.png");
  trash3 = loadImage("image/trash_3.png");
  trash4 = loadImage("image/trash_4.png");
  trash5 = loadImage("image/trash_5.png");
  trash6 = loadImage("image/trash_6.png");
}

function setup() {
  createCanvas(1028, 720);

  video = createCapture(VIDEO);
  video.size(1028, 720);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();

}

function draw() {
  background(0);
  image(bgImg, 0, 0, width, height);

  let basePointWidth = basePoint.width / 2.5;
  let basePointHeight = basePoint.height / 2.5;
  image(basePoint, (width - basePointWidth) / 2, height - basePointHeight + 100, basePointWidth, basePointHeight);

  updateAndDrawTrashObjects();

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }

    let leftEye = pose.keypoints[1];
    let rightEye = pose.keypoints[2];
    if (leftEye.confidence > 0.1 && rightEye.confidence > 0.1) {
      let midX = (leftEye.x + rightEye.x) / 2;
      let midY = (leftEye.y + rightEye.y) / 2;
      fill(255, 255, 0);
      noStroke();
      circle(midX, midY, 10);

      let newWidth = img.width / 10;
      let newHeight = img.height / 10;
      image(img, midX - newWidth / 2 + 20, midY - newHeight / 2 + 200, newWidth, newHeight);

      let leftWrist = pose.keypoints[9];
      let rightWrist = pose.keypoints[10];
      if (leftWrist.confidence > 0.1 && rightWrist.confidence > 0.1) {
        let newWidthLeft = imgLeft.width / 10;
        let newHeightLeft = imgLeft.height / 10;
        image(imgLeft, leftWrist.x - newWidthLeft / 2, leftWrist.y - newHeightLeft / 2, newWidthLeft, newHeightLeft);

        let newWidthRight = imgRight.width / 10;
        let newHeightRight = imgRight.height / 10;
        image(imgRight, rightWrist.x - newWidthRight / 2, rightWrist.y - newHeightRight / 2, newWidthRight, newHeightRight);
      }
    }
  }

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

function updateAndDrawTrashObjects() {
  let currentTime = millis();

  // Add new trash objects every 500ms (2 per second)
  if (currentTime - lastTrashTime > 3000) {
    addTrashObject();
    lastTrashTime = currentTime;
  }

  for (let i = trashObjects.length - 1; i >= 0; i--) {
    let trashObj = trashObjects[i];
    trashObj.y += trashObj.speed;

    image(trashObj.image, trashObj.x, trashObj.y, trashObj.size, trashObj.size);

    if (trashObj.y > height) {
      trashObjects.splice(i, 1);
    }
  }
}

function addTrashObject() {
  let size = 250;
  let images = [trash1, trash2, trash3, trash4, trash5, trash6];
  let randomImage = random(images);
  trashObjects.push({
    x: random(200, 800),
    y: random(-200, -50),
    size: size,
    speed: 2,
    image: randomImage,
  });
}

function gotPoses(results) {
  poses = results;
}
