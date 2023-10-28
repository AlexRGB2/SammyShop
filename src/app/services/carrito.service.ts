import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  baseUrl: string = 'https://productosbacktorres.fly.dev/';

  //lista carrito
  private myList: Producto[] = [];

  //carrito observable
  private myCart = new BehaviorSubject<Producto[]>([]);
  myCart$ = this.myCart.asObservable();

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<any> {
    const json = {
      "accion": 1
    }

    const response = this.httpClient.post(`${this.baseUrl}api/producto/obtener`, json);
    return response
  }

  getProductsbyCategory(id: number | string | null): Observable<any> {
    const json = {
      "accion": 2,
      "filtro": { id_categoria: id }
    }

    const response = this.httpClient.post(`${this.baseUrl}api/producto/obtener`, json);
    return response
  }

  getProductsByName(name: string): Observable<any> {
    const json = {
      "accion": 2,
      "filtro": { nombre: name }
    }

    const response = this.httpClient.post(`${this.baseUrl}api/producto/obtener`, json);
    return response
  }

  getCategories(): Observable<any> {
    const json = {
      "accion": 1
    }
    const response = this.httpClient.post(`${this.baseUrl}api/categoria/obtener`, json);
    return response
  }

  addProduct(product: Producto) {

    if (this.myList.length === 0) {
      product.cantidad = 1;
      this.myList.push(product);
      this.myCart.next(this.myList);
    } else {
      const productMod = this.myList.find((element) => {
        return element.id_producto === product.id_producto
      })
      if (productMod) {
        productMod.cantidad = productMod.cantidad + 1;
        this.myCart.next(this.myList);
      } else {
        product.cantidad = 1;
        this.myList.push(product);
        this.myCart.next(this.myList);
      }

    }
  }

  findProductById(id: number) {
    return this.myList.find((element) => {
      return element.id_producto === id
    })
  }

  deleteProduct(id: number) {
    this.myList = this.myList.filter((product) => {
      return product.id_producto != id
    })
    this.myCart.next(this.myList);
  }

  totalCart() {
    const total = this.myList.reduce(function (acc, product) { return acc + (product.cantidad * product.precio); }, 0)
    return total
  }
}
