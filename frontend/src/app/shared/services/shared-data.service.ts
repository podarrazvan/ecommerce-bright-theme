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

  private emptyCartSubject$ = new BehaviorSubject<boolean>(true);
  private emptyCart$ = this.emptyCartSubject$.asObservable();

  private layoutSubject$ = new BehaviorSubject<Layout>(null);
  public layout$: Observable<Layout> = this.layoutSubject$.asObservable();

  private statisticsSubject$ = new BehaviorSubject<Statistics>(null);
  public statistics$: Observable<Statistics> = this.statisticsSubject$.asObservable();
  
  private bestSellersSubject$ = new BehaviorSubject<BestSellers>(null);
  public bestSellers$: Observable<BestSellers> = this.bestSellersSubject$.asObservable();

  userDetails = new BehaviorSubject<User>(null); // !! maybe UserDetails interface if is different than User

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
    this.userDetails.next(details);
  }

  updateUserDetails(details: User) {
    localStorage.setItem('userData', JSON.stringify(details));
    this.userDetails.next(details);
  }

  ngOnDestroy() {
    this.productEdit = null;
    this.product = null;
    this.unreadMessages = null;
    this.totalCart = null;
  }

  updateCart(newStatus: boolean) {
    this.emptyCartSubject$.next(newStatus);
  }
}
