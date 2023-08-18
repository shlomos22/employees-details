/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { MyElectronService } from './my-electron.service'

describe('Service: MyElectron', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyElectronService]
    })
  })

  it('should ...', inject([MyElectronService], (service: MyElectronService) => {
    expect(service).toBeTruthy()
  }))
})
