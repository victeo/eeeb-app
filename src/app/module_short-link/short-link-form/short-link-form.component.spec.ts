import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortLinkFormComponent } from './short-link-form.component';

describe('ShortLinkFormComponent', () => {
  let component: ShortLinkFormComponent;
  let fixture: ComponentFixture<ShortLinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortLinkFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
