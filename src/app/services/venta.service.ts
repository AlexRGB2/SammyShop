import { Injectable } from '@angular/core';;
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageResponse } from '../models/imageResponse.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  baseUrl: string = 'https://productosbacktorres.fly.dev/';
  // baseUrl = 'http://localhost:3000/'
  private formularioValido = new BehaviorSubject<boolean>(false);
  private productoData = new BehaviorSubject<any>(null);
  private productoUpdate = new BehaviorSubject<any>(null);

  formularioValido$ = this.formularioValido.asObservable();
  productoData$ = this.productoData.asObservable();
  productoUpdate$ = this.productoUpdate.asObservable();

  setVariable(valor: boolean) {
    this.formularioValido.next(valor);
  }

  setProductoData(valor: any) {
    this.productoData.next(valor);
  }

  setProductoUpdate(valor: any) {
    this.productoUpdate.next(valor);
  }

  constructor(private httpClient: HttpClient) { }

  getAllProductosUsuario(formatoFuncion: any) {
    return this.httpClient.post(this.baseUrl + 'api/producto/obtener', formatoFuncion);
  }

  getImagesProduct(json: any): Observable<any> {
    return this.httpClient.post<ImageResponse>(`${this.baseUrl}api/image/producto`, json);
  }

  gestionarProductos(formatoFuncion: any) {
    return this.httpClient.post(this.baseUrl + 'api/producto/gestionar', formatoFuncion);
  }

  getCategorias(formatoFuncion: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}api/categoria/obtener`, formatoFuncion);
  }

  saveImagesProduct(formatoPeticion: any): Observable<any> {
    return this.httpClient.post<ImageResponse>(`${this.baseUrl}api/image`, formatoPeticion);
  }
}
