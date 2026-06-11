import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quoter } from './quoter';

describe('Quoter', () => {
  let component: Quoter;
  let fixture: ComponentFixture<Quoter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quoter],
    }).compileComponents();

    fixture = TestBed.createComponent(Quoter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
