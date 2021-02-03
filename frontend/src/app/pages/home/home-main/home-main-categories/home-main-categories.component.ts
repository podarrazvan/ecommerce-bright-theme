import { Component } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-home-main-categories',
  templateUrl: './home-main-categories.component.html',
  styleUrls: ['./home-main-categories.component.scss'],
})
export class HomeMainCategoriesComponent {
  categories;
  constructor(private sharedDataService: SharedDataService) {
    const data = this.sharedDataService.getWebsiteConfigs();
    this.categories = data.categories;
  }
}