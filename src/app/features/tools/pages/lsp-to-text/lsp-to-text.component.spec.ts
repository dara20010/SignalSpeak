import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LspToTextComponent } from './lsp-to-text.component';

describe('LspToTextComponent', () => {
  let component: LspToTextComponent;
  let fixture: ComponentFixture<LspToTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LspToTextComponent]
    });
    fixture = TestBed.createComponent(LspToTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
