import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderDetailPage } from './provider-detail.page';

describe('ProviderDetailPage', () => {
  let component: ProviderDetailPage;
  let fixture: ComponentFixture<ProviderDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
