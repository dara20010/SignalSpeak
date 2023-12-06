import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HandDetector} from "@tensorflow-models/hand-pose-detection";
import {GraphModel, LayersModel} from "@tensorflow/tfjs";
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
  currentHandFrame: tf.Tensor3D | null = null;
  private intervalId?: number;

  constructor(private elementRef: ElementRef) {

  }


  ngOnInit(): void {
    this.webcam_init();
    this.loadModel();
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
            this.detectHandFrame();
            this.currentHandFrame = null;
            // @ts-ignore
          }, 500);
        }
      })
  }

  async loadModel() {
    /*this.model = await tf.loadLayersModel('/assets/model/lsp_model/model.json');*/
    this.model = await tf.loadGraphModel('assets/lsp_saved/model.json')

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
        //check if model is of type tf.LayersModel
        if (this.model instanceof tf.LayersModel) {
          // @ts-ignore
          this.currentHandFrame = tf.image.cropAndResize(
            // @ts-ignore
            inputData.expandDims(),
            [normalizedCoords],
            [0],
            [64, 64]
          ).reshape([1, 64, 64, 3]);
        } else {
          //For the GraphModel only
          // @ts-ignore
          this.currentHandFrame = tf.image.cropAndResize(
            // @ts-ignore
            inputData.expandDims(),
            [normalizedCoords],
            [0],
            [224, 224] // Change this line
          ).reshape([1, 224, 224, 3]); // And this line
        }
      } else {
        console.log('No se detectó la mano en el frame actual.');
      }
    } else {
      console.log('HandPose no está inicializado.');
    }
  }

  async showTensorAsImage(tensor: tf.Tensor4D) {
    // Normalize the tensor values to be within the range [0, 1]
    const normalizedTensor = tensor.div(tf.scalar(255.0));

    // Create a canvas element
    const canvas = document.createElement('canvas');
    // @ts-ignore
    canvas.width = normalizedTensor.shape[1];
    // @ts-ignore
    canvas.height = normalizedTensor.shape[2];

    // Draw the normalized tensor values as pixel colors onto the canvas
    // @ts-ignore
    await tf.browser.toPixels(normalizedTensor.squeeze(), canvas);

    // Append the canvas to the body of the document
    document.body.appendChild(canvas);
  }



  detectHandFrame() {
    if (this.currentHandFrame) {
      // show current frame
      console.log(this.currentHandFrame)
/*
      this.currentHandFrame.print()
*/
      // Call the function with your tensor
      const tensor = tf.tensor4d([
        [
          [
            [92.3592453, 84.3592453, 93.3822556],
            [93.3175278, 85.3175278, 94.6350632],
            // ... rest of your tensor values
          ]
        ]
      ]);
      //this.showTensorAsImage(tensor);

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
