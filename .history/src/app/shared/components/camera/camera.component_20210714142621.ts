import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper'
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam'
import { Observable, Subject } from 'rxjs'
import { OtherDevicesPayload } from '../../../pages/settings/settings.page';
import { StoreService } from '../../services/store/store.service';


export interface ToolbarButton {
  src: string
  callback?: () => void
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @Output() picture = new EventEmitter<ImageCroppedEvent>()

  showWebcam: boolean = false
  isCameraExist: boolean = false
  allowCameraSwitch: boolean = true
  webcamImage: WebcamImage

  errors: WebcamInitError[] = []

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>()
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>()
  private options: MediaTrackConstraints
  croppedImage: ImageCroppedEvent

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  toolbar: ToolbarButton[] = []
  editImage: boolean = false
  cameraId: string


  constructor(private storeService: StoreService) {
    this.createToolbar()
  }


  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0
        this.showNextWebcam()
      })
  }

  createToolbar(): void {
    this.toolbar = [
      { src: 'assets/reset-image.png', callback: () => this.resetImage() },
      { src: 'assets/zoom-in.png', callback: () => this.zoomIn() },
      { src: 'assets/zoom-out.png', callback: () => this.zoomOut() },
      { src: 'assets/flip-vertical.png', callback: () => this.flipVertical() },
      { src: 'assets/flip-horizontal.png', callback: () => this.flipHorizontal() },
      { src: 'assets/rotate-right.png', callback: () => this.rotateRight() },
      { src: 'assets/rotate-left.png', callback: () => this.rotateLeft() }
    ]
  }

  takeSnapshot(): void {
    this.trigger.next()
  }

  handleInitError(error: WebcamInitError) {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  public async showNextWebcam(): Promise<void> {
    const cameraSettings = await this.storeService.get('cameraSettings')
    debugger
    if (cameraSettings) {
      this.cameraId = (JSON.parse(cameraSettings) as OtherDevicesPayload).deviceSerNum
    }
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage
    this.showWebcam = !this.showWebcam
    this.editImage = false
    this.resetImage()
  }

  public editSnapshot(): void {
    this.editImage = !this.editImage
    this.showWebcam = false
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.showWebcam = false
    this.croppedImage = event
    this.picture.emit(this.croppedImage)
  }

  public fileChangeEvent(event) {
    this.showWebcam = false
    this.webcamImage = event
  }

  public cameraWasSwitched(cameraId: string): void {
    console.log('active device: ' + cameraId);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable()
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable()
  }

  public get videoOptions(): MediaTrackConstraints {
    return this.options = {
      deviceId: this.cameraId,
      width: 318,
      height: 225
    }
  }


  /////////////////////

  public rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  public rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }



  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  public flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  public flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  public resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  public zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  public zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  public updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }


}
