import { Injectable, isDevMode } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { PRINTER_PATH, JAVA_PATH, PRINTER_JAR, PRINTER_XML, READER_JAR, READER_PATH, READER_SETTINGS, JAVA_PATH_PROD } from '../../constants/files';



@Injectable({
  providedIn: 'root'
})
export class MyElectronService {


  fs: any;
  rootPath: string;
  to: string;
  dir: string;


  options: any[] = [];
  remote: any;
  isrPath: string;

  javaPath: string

  constructor(
    private electronService: ElectronService
  ) {

    this.javaPath = JAVA_PATH
    if (!isDevMode()) {
      this.javaPath = JAVA_PATH_PROD
    }

    this.remote = this.electronService.remote
    this.rootPath = this.remote.app.getAppPath() + this.javaPath
  }

  public async installFiles() {
    debugger
    await this.createReaderFolder().catch(error => console.log(error))
    await this.createPrinterFolder().catch(error => console.log(error))
    await this.installReaderFile().catch(error => console.log(error))
    await this.installReaderSettingsFile().catch(error => console.log(error))
    await this.installPrinterFile().catch(error => console.log(error))
    await this.installPrinterSettingsFile().catch(error => console.log(error))
  }

  private async createReaderFolder() {
    const command = `mkdir ${READER_PATH}`
    return this.runScript(command)
  }

  private async createPrinterFolder() {
    const command = `mkdir ${PRINTER_PATH}`
    return this.runScript(command)
  }

  private async installReaderFile() {
    const command = `xcopy /d ${this.rootPath}\\${READER_JAR} ${READER_PATH}`
    console.log(command);
    return this.runScript(command);
  }

  private async installReaderSettingsFile() {
    const command = `xcopy /d ${this.rootPath}\\${READER_SETTINGS} ${READER_PATH}`
    console.log(command);
    return this.runScript(command);
  }

  private async installPrinterFile() {
    const command = `xcopy /d ${this.rootPath}\\${PRINTER_JAR} ${PRINTER_PATH}`
    console.log(command);
    return this.runScript(command);
  }

  private async installPrinterSettingsFile() {
    const command = `xcopy /d ${this.rootPath}\\${PRINTER_XML} ${PRINTER_PATH}`
    console.log(command);
    return this.runScript(command);
  }

  public async runReaderJar() {
    const command = `javaw.exe -jar ${READER_PATH}${READER_JAR} false false false`
    return this.runScript(command);
  }

  public async runPrinterJar() {
    const command = `javaw.exe -jar ${PRINTER_PATH}${PRINTER_JAR}`
    return this.runScript(command);
  }

  runScript(scriptStr) {
    return new Promise((resolve, error) => {
      const result = this.electronService.childProcess.exec(scriptStr);
      result.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      result.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
      });

      result.on("error", (error) => {
        console.log(error);
      });

      result.on("close", (code) => {
        if (code !== 0) {
          error(code);
        } else {
          resolve(code);
        }
      });
    });
  }
}