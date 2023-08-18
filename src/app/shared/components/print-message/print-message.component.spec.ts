import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMessageComponent } from './print-message.component';

describe('PrintMessageComponent', () => {
  let component: PrintMessageComponent;
  let fixture: ComponentFixture<PrintMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
