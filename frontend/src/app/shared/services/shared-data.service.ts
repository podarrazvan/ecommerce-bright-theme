import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Layout } from './../interfaces/website-details';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { User } from '../interfaces/user.interface';
import { BestSellers } from '../interfaces/best-sellers.interface';
import { Statistics } from '../interfaces/statistics.interface';

interface Brand {
  name: string;
  img: string;
}

@Injectable()
export class SharedDataService implements OnDestroy {
  private brandSubject$ = new BehaviorSubject<Brand>(null);
  public brand$ = this.brandSubject$.asObservable();

  private layoutSubject$ = new BehaviorSubject<Layout>(null);
  public layout$: Observable<Layout> = this.layoutSubject$.asObservable();

  private statisticsSubject$ = new BehaviorSubject<Statistics>(null);
  public statistics$: Observable<Statistics> = this.statisticsSubject$.asObservable();
  
  private bestSellersSubject$ = new BehaviorSubject<BestSellers>(null);
  public bestSellers$: Observable<BestSellers> = this.bestSellersSubject$.asObservable();

  private userDetailsSubject$ = new BehaviorSubject<User>(null);
  public userDetails$: Observable<User> = this.userDetailsSubject$.asObservable();

  // !! fa-le si pe astea cum e mai sus
  productEdit: boolean;
  product: Product;
  unreadMessages: number;
  totalCart: number;
  mobile: boolean;

  constructor(private http: HttpClient) {}

  getLayout() {
    return this.http.get<Layout>(`${environment.api}/website`);
  }

  setLayout(layout: Layout) {
    this.layoutSubject$.next(layout);
  }

  setStatistics(statistics: Statistics) {
    this.statisticsSubject$.next(statistics);
  }

  setBestSellers(bestSellers) {
    this.bestSellersSubject$.next(bestSellers);
  }

  setUserDetails(details: User) {
    this.userDetailsSubject$.next(details);
    localStorage.setItem('userData', JSON.stringify(details));
  }

  updateUserDetails(details: User) {
    localStorage.setItem('userData', JSON.stringify(details));
    this.userDetailsSubject$.next(details);
  }

  ngOnDestroy() {
    this.productEdit = null;
    this.product = null;
    this.unreadMessages = null;
    this.totalCart = null;
  }
}
