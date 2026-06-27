import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumePrint } from './resume-print';

describe('ResumePrint', () => {
  let component: ResumePrint;
  let fixture: ComponentFixture<ResumePrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumePrint],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumePrint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
