import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { UserIdentificationPage } from './user-identification.page'

describe('UserIdentificationPage', () => {
  let component: UserIdentificationPage
  let fixture: ComponentFixture<UserIdentificationPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIdentificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(UserIdentificationPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
