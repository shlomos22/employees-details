/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { DriverCardWriteService } from './driver-card-write.service'

describe('Service: DriverCardWrite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DriverCardWriteService]
    })
  })

  it('should ...', inject([DriverCardWriteService], (service: DriverCardWriteService) => {
    expect(service).toBeTruthy()
  }))
})
