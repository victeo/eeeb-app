import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRegisterComponent } from './group-register.component';

describe('GroupRegisterComponent', () => {
  let component: GroupRegisterComponent;
  let fixture: ComponentFixture<GroupRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
