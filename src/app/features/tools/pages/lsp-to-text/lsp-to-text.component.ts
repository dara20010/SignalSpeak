import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {LayersModel} from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/hand-pose-detection";
import {HandDetector} from "@tensorflow-models/hand-pose-detection";


@Component({
  selector: 'app-lsp-to-text',
  templateUrl: './lsp-to-text.component.html',
  styleUrls: ['./lsp-to-text.component.css']
})
export class LspToTextComponent implements OnInit, AfterViewInit {
  @Output() onCharDetected = new EventEmitter();
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  video!: HTMLVideoElement;
  handModel!: HandDetector;
  model!: LayersModel;
  output: string = '';
  currentHandFrame: tf.Tensor3D | null = null;

  constructor() {

  }

  ngOnInit(): void {
    this.webcam_init();
    this.loadModel();
  }

  ngAfterViewInit() {
  }

  async drawHand(ctx: CanvasRenderingContext2D, handLandmarks: handpose.Keypoint[]) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const minX = Math.min(...handLandmarks.map(point => point.x));
    const minY = Math.min(...handLandmarks.map(point => point.y));
    const maxX = Math.max(...handLandmarks.map(point => point.x));
    const maxY = Math.max(...handLandmarks.map(point => point.y));

    ctx.fillStyle = 'red';
    for (const point of handLandmarks) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Dibujar el rectángulo
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(minX - 40, minY - 40, (maxX + 80) - minX, (maxY + 80) - minY);
  }

  webcam_init() {
    this.video = document.getElementById('vid') as HTMLVideoElement;
    console.log(this.video)
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
          console.log(this.video.width)
          setInterval(() => {
            // @ts-ignore
            this.captureHandFrame(ctx);
            this.detectHandFrame();
            this.currentHandFrame = null;
            // @ts-ignore
          }, 1000);
        }
      })
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('/assets/model/model.json');
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
        this.drawHand(ctx, handLandmarks)

        const minX = Math.min(...handLandmarks.map(point => point.x));
        const minY = Math.min(...handLandmarks.map(point => point.y));
        const maxX = Math.max(...handLandmarks.map(point => point.x));
        const maxY = Math.max(...handLandmarks.map(point => point.y));

        const inputData = tf.browser.fromPixels(this.video);

        const normalizedCoords = [
          (minY - 40) / this.video.height,
          (minX - 40) / this.video.width,
          (maxY + 80) / this.video.height,
          (maxX + 80) / this.video.width
        ];
        // @ts-ignore
        this.currentHandFrame = tf.image.cropAndResize(
          // @ts-ignore
          inputData.expandDims(),
          [normalizedCoords],
          [0],
          [64, 64]
        ).reshape([1, 64, 64, 3]);
      } else {
        console.log('No se detectó la mano en el frame actual.');
      }
    } else {
      console.log('HandPose no está inicializado.');
    }
  }

  detectHandFrame() {
    if (this.currentHandFrame) {
      const prediction = this.model.predict(this.currentHandFrame);

      const characters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '', '', ' '
      ];
      // @ts-ignore
      const predictedClass = tf.argMax(prediction, 1).dataSync()[0];
      const predictedLabel = characters[predictedClass];

      console.log("Clase predicha:", predictedClass);
      console.log("Label predicho:", predictedLabel);

      console.log(prediction);
      this.onCharDetected.emit(predictedLabel);
      this.output += predictedLabel;
      // Imprime las probabilidades para cada clase
      // for (let i = 0; i < probabilities.length; i++) {
      //   const label = characters[i] || `Clase ${i}`;
      //   console.log(`${label}: ${probabilities[i]}`);
      // }
    } else {
      console.log('No hay frame de la mano para procesar.');
    }
  }

  clear() {
    this.output = '';
  }

}
