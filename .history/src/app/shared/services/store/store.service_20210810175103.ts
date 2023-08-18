import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storage: any

  constructor() {
    this.storage = localStorage
  }

  public async set(key: string, val: any): Promise<void> {
    await this.storage.setItem(key, val)
  }

  public async get(key: string): Promise<any> {
    return await this.storage.getItem(key)
  }

  public async remove(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }


  public async update(key: string, val: any): Promise<void> {

    let value = await this.storage.getItem(key)

    if (!value) {
      await this.storage.setItem(key, val)
      return
    }

    await this.storage.removeItem(key)
    setTimeout(async () => {
      await this.storage.setItem(key, val)
    }, 1000);

  }

  public async clear(): Promise<void> {
    await this.remove('session');
    await this.remove('uid');
    await this.remove('operatorId');
    await this.remove('firstName');
    await this.remove('lastName');
    await this.remove('typeRoleId');
  }

  public async length(): Promise<number> {
    return await this.storage.length()
  }


}
