import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import * as firebase from 'firebase';


@Injectable()
export class DbDeleteService {
  error: any;

  constructor(
    private http: HttpClient
  ) { }

  deleteProduct(id: string) {
    // const user = JSON.parse(localStorage.getItem('userData'));
    return this.http.delete(
      `${environment.api}/products/${id}`
    );
  }

  deleteCategory(key: string) {
    const user = JSON.parse(localStorage.getItem('userData'));
    return this.http.delete(
      `https://shop-436e8.firebaseio.com/categories/${key}/.json?auth=${user._token}`
    );
  }

  deleteMessage(id: string) {
    const user = JSON.parse(localStorage.getItem('userData'));
    return this.http.delete(
      `${environment.api}/contact/${id}`
    );
  }

  deleteOrder(key: string) {
    const user = JSON.parse(localStorage.getItem('userData'));
    return this.http.delete(
      `https://shop-436e8.firebaseio.com/orders/${key}/.json?auth=${user._token}`
    );
  }

  deletePhoto(img: string) {
    // TODO
  }
}