/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { CardReaderService } from './card-driver.service'

describe('Service: DriverCardWrite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardReaderService]
    })
  })

  it('should ...', inject([CardReaderService], (service: CardReaderService) => {
    expect(service).toBeTruthy()
  }))
})
