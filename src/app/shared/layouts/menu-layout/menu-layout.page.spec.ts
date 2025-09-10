import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuLayoutPage } from './menu-layout.page';

describe('MenuLayoutPage', () => {
  let component: MenuLayoutPage;
  let fixture: ComponentFixture<MenuLayoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuLayoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
