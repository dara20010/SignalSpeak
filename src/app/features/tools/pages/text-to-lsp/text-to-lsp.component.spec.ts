import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToLspComponent } from './text-to-lsp.component';

describe('TextToLspComponent', () => {
  let component: TextToLspComponent;
  let fixture: ComponentFixture<TextToLspComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextToLspComponent]
    });
    fixture = TestBed.createComponent(TextToLspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
