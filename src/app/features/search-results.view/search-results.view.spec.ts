import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsView } from './search-results.view';

describe('SearchResultsView', () => {
  let component: SearchResultsView;
  let fixture: ComponentFixture<SearchResultsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
