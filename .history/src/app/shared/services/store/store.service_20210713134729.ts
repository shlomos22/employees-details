import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private storage: Storage) {
    this.init()
  }


  public async init() {
    await this.storage.create()
  }

  public async set(key: string, val: any): Promise<void> {
    await this.storage.set(key, val)
  }

  public async get(key: string): Promise<any> {
    let value = await this.storage.get(key)
    return value
  }

  public async remove(key: string): Promise<any> {
    let value = await this.storage.remove(key);
    return value
  }

  public clear(): void {
    this.storage.clear()
  }

  public async length(): Promise<number> {
    return await this.storage.length()
  }


}
