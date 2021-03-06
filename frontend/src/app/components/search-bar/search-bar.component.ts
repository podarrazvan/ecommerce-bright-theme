import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Categories } from 'src/app/shared/interfaces/categories.interface';
import { SharedDataService } from '../../shared/services/shared-data.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchBar: FormGroup;
  selectedCategory: Categories;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public sharedDataService: SharedDataService
  ) {
    this.buildFormGroup();
  }

  onSearch(): void {
    const search = this.searchBar.value.search;
    this.router.navigate([
      '../search',
      this.searchBar.value.category,
      search.replace(/\s/g, '-'),
    ]);
  }

  searchInCategories(category): void {
    this.searchBar.patchValue({
      category,
    });
    this.selectedCategory = category.name;
  }

  private buildFormGroup(): void {
    this.searchBar = this.fb.group({
      search: ['', Validators.required],
      category: ['all'],
    });
  }
}
