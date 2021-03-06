import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { Discount } from 'src/app/shared/interfaces/discount.interface';

@Injectable()
export class ProductsService {
  error: any;
  constructor(private http: HttpClient) {}

  createAndStoreProduct(product: IProduct): void {
    const date = new Date().getTime();
    const productNumber = Math.round(date / 1000 - 1615160000);
    const productData: IProduct = {
      title: product.title,
      category: product.category,
      price: product.price,
      images: product.images,
      mainImg: product.mainImg,
      thumbnail: product.thumbnail,
      shortDescription: product.shortDescription,
      description: product.description,
      tags: product.tags,
      quantity: product.quantity,
      views: 0,
      minPrice: product.minPrice,
      salesWeekTarget: product.salesWeekTarget,
      initialQuantity: product.quantity,
      productNumber,
      brand: product.brand,
      productModels: product.productModels,
      sold: 0,
      rating: null,
      public: true, // TODO set it from add product interface
    };
    this.http
      .post<{ name: string }>(`${environment.api}/products`, productData, {
        observe: 'response',
      })
      .subscribe();
  }

  updateProduct(product: IProduct): void {
    product.views = +product.views + 1;
    this.http
      .put(`${environment.api}/products/${product._id}`, product)
      .subscribe();
  }

  updateSold(status, order): any {
    return this.http.put(`${environment.api}/products/sold/${status}`, order);
  }

  editProduct(product: IProduct, id): void {
    this.http.put(`${environment.api}/products/${id}`, product).subscribe();
  }

  getProductsByCategory(category: string): any {
    return this.http.get<IProduct[]>(
      `${environment.api}/products/category/${category}`
    );
  }

  getProduct(key: string): any {
    return this.http.get<IProduct>(`${environment.api}/products/id/${key}`);
  }

  getProducts(): any {
    return this.http.get<IProduct[]>(`${environment.api}/products`);
  }

  getPaginatedProducts(page: number, limit: number): any {
    return this.http.get<{
      next: { page: number; limit: number };
      results: IProduct[];
    }>(`${environment.api}/products/paginated?page=${page}&limit=${limit}`);
  }

  getPaginatedProductsByBrand(page: number, limit: number, brand: string): any {
    return this.http.get<IProduct[]>(
      `${environment.api}/products/paginated/brand?page=${page}&limit=${limit}&name=${brand}`
    );
  }

  getPaginatedProductsByCategory(
    page: number,
    limit: number,
    category: string
  ): any {
    return this.http.get<IProduct[]>(
      `${environment.api}/products/paginated/category?page=${page}&limit=${limit}&name=${category}`
    );
  }

  getLastProducts(limit: number, category: string): any {
    return this.http.get<IProduct[]>(
      `${environment.api}/products/last?limit=${limit}&category=${category}`
    );
  }

  getMainProducts(size: number): any {
    return this.http.get<{
      products: IProduct[];
      mainProduct: IProduct;
      mainAd: IProduct;
    }>(`${environment.api}/products/main-products?size=${size}`);
  }

  getYouMayLikeProducts(size: number): any {
    return this.http.get<IProduct[]>(
      `${environment.api}/products/you-may-like?size=${size}`
    );
  }

  getBestSellersProducts(): any {
    return this.http.get<{
      main: IProduct;
      middle: IProduct[];
      bottom: IProduct[];
      extra: IProduct[];
    }>(`${environment.api}/products/best-sellers`);
  }

  getTopRatedProducts(): any {
    return this.http.get<IProduct[]>(`${environment.api}/products/top-rated`);
  }

  getFeaturedProducts(size: number): any {
    return this.http.get<IProduct[]>(
      `${environment.api}/products/featured-products?size=${size}`
    );
  }

  getSpecialForYouProducts(): any {
    return this.http.get<Discount[]>(
      `${environment.api}/products/special-for-you`
    );
  }

  deleteProduct(id: string): any {
    return this.http.delete(`${environment.api}/products/${id}`);
  }
}
