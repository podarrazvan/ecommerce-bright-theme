import { SharedDataService } from './../../../services/shared-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-address',
  templateUrl: './footer-address.component.html',
  styleUrls: ['./footer-address.component.scss'],
})
export class FooterAddressComponent implements OnInit {
  footer: Footer;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.sharedDataService.websiteDetails.subscribe((data) => {
      try {
        const { adress, phone, email } = data.footer;
        this.footer = { adress, phone, email };
      } catch {
       //
      }
    });
  }
}

interface Footer {
  adress: string;
  phone: string;
  email: string;
}