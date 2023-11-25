import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamDetectorComponent } from './cam-detector.component';

describe('CamDetectorComponent', () => {
  let component: CamDetectorComponent;
  let fixture: ComponentFixture<CamDetectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CamDetectorComponent]
    });
    fixture = TestBed.createComponent(CamDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
