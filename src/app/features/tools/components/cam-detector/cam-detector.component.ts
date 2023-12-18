import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HandDetector} from "@tensorflow-models/hand-pose-detection";
import {GraphModel, LayersModel, reshape} from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/hand-pose-detection";

@Component({
  selector: 'app-cam-detector',
  templateUrl: './cam-detector.component.html',
  styleUrls: ['./cam-detector.component.css']
})
export class CamDetectorComponent implements OnInit, OnDestroy {
  @Output() onCharDetected = new EventEmitter();
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() width: number = 640;
  @Input() height: number = 480;

  video!: HTMLVideoElement;
  handModel!: HandDetector;
  model!: LayersModel | GraphModel;
  currentHandFrame: any;
  private intervalId?: number;


  private intervalTime: number = 1000;


  constructor(private elementRef: ElementRef) {

  }


  ngOnInit(): void {
    this.webcam_init();
    this.loadModel();
  }

  async drawHand(ctx: CanvasRenderingContext2D, handLandmarks: handpose.Keypoint[]) {
/*    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 50, ctx.canvas.width, (ctx.canvas.height - 50));
    ctx.clearRect(50, 0, (ctx.canvas.width - 50), ctx.canvas.height );*/

    const minX = Math.min(...handLandmarks.map(point => point.x));
    const minY = Math.min(...handLandmarks.map(point => point.y));
    const maxX = Math.max(...handLandmarks.map(point => point.x));
    const maxY = Math.max(...handLandmarks.map(point => point.y));

    ctx.fillStyle = 'red';
    for (const point of handLandmarks) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Dibujar el rectángulo
    /*ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(minX - 10, minY - 10, (maxX + 16) - minX, (maxY + 16) - minY);*/
  }

  webcam_init() {
    this.video = document.getElementById('vid') as HTMLVideoElement;
    console.info('[INITIALIZING CAMERA]', this.video)
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
      .then((stream: any) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
          const canvas = this.canvasRef.nativeElement;
          const ctx = canvas.getContext('2d');
          canvas.width = this.video.width;
          canvas.height = this.video.height;
          console.log(canvas)
          this.intervalId = window.setInterval(() => {
            // @ts-ignore
            this.captureHandFrame(ctx);
            // @ts-ignore
            this.detectHandFrame(ctx);
            this.currentHandFrame = null;
            // @ts-ignore
          }, this.intervalTime);
        }
      })
  }

  async loadModel() {
    /*this.model = await tf.loadLayersModel('/assets/model/lsp_model/model.json');*/
    /*
        this.model = await tf.loadGraphModel('assets/lsp_saved/model.json')
    */
    this.model = await tf.loadLayersModel('assets/model/lsp_2_final/model.json');

    /*this.model = await tf.loadLayersModel('/assets/model/model.json');*/
    const model = handpose.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      modelType: 'full'
    }
    // @ts-ignore
    this.handModel = await handpose.createDetector(model, detectorConfig);
  }

  async captureHandFrame(ctx: CanvasRenderingContext2D) {
    if (this.handModel) {
      const predictions = await this.handModel.estimateHands(this.video);

      if (predictions && predictions.length > 0) {
        const handLandmarks = predictions[0].keypoints;

        const minX = Math.min(...handLandmarks.map(point => point.x));
        const minY = Math.min(...handLandmarks.map(point => point.y));
        const maxX = Math.max(...handLandmarks.map(point => point.x));
        const maxY = Math.max(...handLandmarks.map(point => point.y));


        const normalizedCoords = [
          ((minY) / this.video.height) - 0.04,
          ((minX) / this.video.width) - 0.04,
          ((maxY) / this.video.height) + 0.04,
          ((maxX) / this.video.width) + 0.04
        ];

        let minXImg = (((minX) / this.video.width) - 0.04) * this.video.width;
        let minYImg = (((minY) / this.video.height) - 0.04) * this.video.height;
        let maxXImg = (((maxX) / this.video.width) + 0.04) * this.video.width;
        let maxYImg = (((maxY) / this.video.height) + 0.04) * this.video.height;
        // get the pixels within the bounding box

        const inputData = tf.browser.fromPixels(this.video);
        const batchedInputData = tf.expandDims(inputData, 0);

        // get the pixels within the bounding box
        const boxes = tf.tensor2d([normalizedCoords]);
        const boxInd = tf.tensor1d([0]);
        const boxIndInt32 = tf.cast(boxInd, 'int32');


        const croppedImage = tf.image.cropAndResize(
          // @ts-ignore
          batchedInputData,
          boxes,
          boxIndInt32,
          [224, 224]
        );
        console.log(croppedImage)
        this.currentHandFrame = croppedImage;
        this.currentHandFrame = this.currentHandFrame.div(255);

        this.drawHand(ctx, handLandmarks)
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.strokeRect(minXImg, minYImg, (maxXImg - minXImg), (maxYImg - minYImg));



      } else {
        console.log('No se detectó la mano en el frame actual.');
      }
    } else {
      console.log('HandPose no está inicializado.');
    }
  }

  predictTestImage() {
    let img = new Image();
    img.src = 'assets/img/test/a_1.jpg';
    img.onload = () => {
      console.info('[PREDICTING TEST IMAGE]')
      console.log(img.width, img.height)
      let a = tf.browser.fromPixels(img);
      console.log(a.shape)
      a = tf.expandDims(a, 0);
      a = a.div(255);
      const prediction = this.model.predict(a);
      // @ts-ignore
      console.log(prediction.dataSync())
    }
  }

  detectHandFrame(ctx: CanvasRenderingContext2D) {
    if (this.currentHandFrame) {

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
/*
      this.predictTestImage()
*/

      console.log(this.currentHandFrame)
      const prediction = this.model.predict(this.currentHandFrame);


      let characters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '', '', ' '
      ];

      characters = [
        'A', 'B', 'C', 'E', 'H', 'I', 'L', 'O', 'S', 'V'
      ]
      // @ts-ignore
      const predictedClass = tf.argMax(prediction, 1).dataSync()[0];
      const predictedLabel = characters[predictedClass];

      console.log("Clase predicha:", predictedClass);
      console.log("Label predicho:", predictedLabel);

      console.log(prediction);

      // write the predicted label on the canvas
      ctx.font = '48px sans-serif';
      ctx.fillStyle = 'yellow';
      ctx.fillText(predictedLabel, 10, 50);


      this.onCharDetected.emit(predictedLabel);

      //log the probabilities of the predictions
      // @ts-ignore
      console.log(prediction.dataSync());

      //Imprime las probabilidades para cada clase
      /*for (let i = 0; i < probabilities.length; i++) {
         const label = characters[i] || `Clase ${i}`;
         console.log(`${label}: ${probabilities[i]}`);
       }*/
    } else {
      console.log('No hay frame de la mano para procesar.');
    }
  }


  ngOnDestroy() {

    this.elementRef.nativeElement.remove();
    console.log('[DESTROYING CAMERA]')

    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
    }
  }
}
