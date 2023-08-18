/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { ReaderService } from './reader.service'

describe('Service: Card', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReaderService]
    })
  })

  it('should ...', inject([ReaderService], (service: ReaderService) => {
    expect(service).toBeTruthy()
  }))
})
