import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToLspHistoryComponent } from './text-to-lsp-history.component';

describe('TextToLspHistoryComponent', () => {
  let component: TextToLspHistoryComponent;
  let fixture: ComponentFixture<TextToLspHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextToLspHistoryComponent]
    });
    fixture = TestBed.createComponent(TextToLspHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
