import { Component, OnInit} from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { WebcamUtil } from 'ngx-webcam';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '../../core/services/electron/electron.service';;
import { LoadingService } from '../../shared/services/loading/loading.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { NgForm } from '@angular/forms';
import { StoreService } from '../../shared/services/store/store.service';
import { Location } from '@angular/common';

export interface Device {
  camera: any
  printer: any
  reader: any
  sam: any
}


export interface SettingsReportRequest {
  data: DevicesPayload
  | ReportsDevicesPayload
  | OtherDevicesPayload
}

export interface ReportsDevicesPayload {
  active: string,
  status_id: string
  deviceType: string,
  deviceSerialNum: string
}


export interface DevicesPayload {
  deviceSerialNumber: string,
  vehicleNumber: string,
  samNumber: string,
  status_id: string,
  appName: string,
  appVersion: string,
  deviceAndroidVersion: string,
  deviceAndroidModel: string,
  simSerialNumber: string,
  spmSerialNum: string,
  deviceType: string,
  deviceDescr: string
}

export interface OtherDevicesPayload {
  otherDeviceId?: string,
  deviceSerNum?: string,
  deviceType?: string,
  deviceStatus?: string,
  deviceDescr?: string,
  belongDeviceId?: string,
  deviceId?: string
}

export const DEVICE_TYPE: string = '3'
export const DEFAULT: string = '-999'
export const ACTIVE: string = '1'

export enum Devices {
  camera,
  reader,
  sam,
  printer
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  cameraDevices: MediaDeviceInfo[]
  readerDevices: any[]
  samDevices: any[]
  printerDevices: any[]
  cameraId: any
  printerId: any
  readerId: any
  samId: any
  uuid: any
  pcsc: any
  selecteDevices: Device

  constructor(
    private location: Location,
    private config: NgSelectConfig,
    private translateService: TranslateService,
    private electronService: ElectronService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private storeService: StoreService
  ) {
    this.config.notFoundText = this.translateService.instant('Pages.Settings.deviceNotFound')
    this.selecteDevices = Object.create({})
  }


  ngOnInit() {
    const realoadVideoInputs = this.getAvailableVideoInputs()
    const realoadPrintersInputs = this.getAvailablePrintersInputs()
    const realoadReadersInputs =  this.getAvailableReadersInputs()
    Promise.all([realoadVideoInputs, realoadPrintersInputs, realoadReadersInputs]).then(async () => {
      this.cameraId = await this.storeService.get('cameraSettings') !== undefined ? JSON.parse(await this.storeService.get('cameraSettings')) : ''
      this.readerId = await this.storeService.get('readerSettings') !== undefined ? JSON.parse(await this.storeService.get('readerSettings')) : ''
      this.samId = await this.storeService.get('samSettings') !== undefined ? JSON.parse(await this.storeService.get('samSettings')) : ''
      this.printerId = await this.storeService.get('printerSettings') !== undefined ? JSON.parse(await this.storeService.get('printerSettings')) : ''
    })
  }

  public return(): void {
    this.location.back()
  }

  private getAvailableVideoInputs(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then(async (mediaDevices: MediaDeviceInfo[]) => {
        const isCameraExist = mediaDevices && mediaDevices.length > 0
        if (isCameraExist) {
          this.cameraDevices = mediaDevices
        } else {
          await this.storeService.remove('cameraSettings')
        }

      })
  }

  private getAvailableReadersInputs(): void {
    this.readerDevices = []
    this.samDevices = []

    const pcsc = this.electronService.pcsc()
    pcsc.on('reader', async (reader) => {
      if (!reader.name.includes('SAM')) {
        this.readerDevices = [...this.readerDevices, reader]
      } else {
        this.samDevices = [...this.samDevices, reader]
      }
      debugger
      if (this.readerDevices.length <= 0) {
        await this.storeService.remove('readerSettings')
      }

      if (this.samDevices.length <= 0) {
        await this.storeService.remove('samSettings')
      }
    })
  }


  private getAvailablePrintersInputs(): void {
    this.electronService.si.printer().then(async data => {
      this.printerDevices = data

      if (this.printerDevices.length <= 0) {
        await this.storeService.remove('printerSettings')
      }

    }).catch(error => console.error(error))
  }

  public onCameraIdSelected(e): void {
    this.selecteDevices.camera = e
  }

  public onPrinterIdSelected(e): void {
    this.selecteDevices.printer = e
  }

  public onReaderIdSelected(e): void {
    this.selecteDevices.reader = e
  }

  public onSamIdSelected(e): void {
    this.selecteDevices.sam = e
  }

  public async saveChanges(form: NgForm): Promise<void> {
    this.getOtherDevice()
  }


  public async getOtherDevice(): Promise<void> {

    if (Object.keys(this.selecteDevices).length <= 0) {
      this.toastService.displayToast(this.translateService.instant('Pages.Settings.noDefinitionHasBeenBhanged'), 3 * 1000, "danger")
      await this.loadingService.dismissLoading();
      return
    }

    await this.loadingService.presentLoading();
    Object.keys(this.selecteDevices).forEach(async device => {
      let deviceSerNum: string
      let deviceDescr: string

      if (device === 'camera') {
        deviceSerNum = this.selecteDevices[device].deviceId
        deviceDescr = this.selecteDevices[device].label
      } else {
        deviceSerNum = this.selecteDevices[device].name
        deviceDescr = this.selecteDevices[device].name
      }

      const deviceType: Devices = Devices[device] + 1
      this.storeSettings({ deviceSerNum: deviceSerNum, deviceType: deviceType.toString(), deviceDescr: deviceDescr })
      await this.loadingService.dismissLoading();
      this.toastService.displayToast(this.translateService.instant('Pages.Settings.changesSavedSuccessfully'), 3 * 1000, "success");
    })
  }

  private async storeSettings(device: any): Promise<void> {
    switch (device.deviceType) {
      case '1':
        await this.storeService.update('cameraSettings', JSON.stringify(device));
        break;
      case '2':
        await this.storeService.update('readerSettings', JSON.stringify(device));
        break;
      case '3':
        await this.storeService.update('samSettings', JSON.stringify(device));
        break;
      case '4':
        await this.storeService.update('printerSettings', JSON.stringify(device));
        break;
    }
  };

}

