import { Injectable } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { PRINTER_PATH, JAVA_PATH, PRINTER_JAR, PRINTER_XML, READER_JAR, READER_PATH, READER_SETTINGS } from '../../constants/files';



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

  constructor(
    private electronService: ElectronService
  ) {
    this.remote = this.electronService.remote
    this.rootPath = this.remote.app.getAppPath() + JAVA_PATH
  }

  public async installFiles() {
    await this.createReaderFolder()
    await this.createPrinterFolder()
    await this.installReaderFile()
    await this.installReaderSettingsFile()
    await this.installPrinterFile()
    await this.installPrinterSettingsFile()
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
    const command = `Echo n|COPY /-y  ${this.rootPath}\\${READER_JAR} ${READER_PATH}\\${READER_JAR}`
    return this.runScript(command);
  }

  private async installReaderSettingsFile() {
    const command = `Echo n|COPY /-y  ${this.rootPath}\\${READER_SETTINGS} ${READER_PATH}\\${READER_SETTINGS}`
    return this.runScript(command);
  }

  private async installPrinterFile() {
    const command = `Echo n|COPY /-y  ${this.rootPath}\\${PRINTER_JAR} ${PRINTER_PATH}\\${PRINTER_JAR}`
    return this.runScript(command);
  }

  private async installPrinterSettingsFile() {
    const command = `Echo n|COPY /-y  ${this.rootPath}\\${PRINTER_XML} ${PRINTER_PATH}\\${PRINTER_XML}`
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
