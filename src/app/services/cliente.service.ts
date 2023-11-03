import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DireccionBack } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  baseUrl: string = 'https://withered-butterfly-3935.fly.dev/';
  cliente: any;

  constructor(private httpClient: HttpClient) { }

  login(formatoFuncion: any) {
    return this.httpClient.post(this.baseUrl + 'api/cliente/gestionar', formatoFuncion);
  }

  registro(formatoFuncion: any) {
    return this.httpClient.post(this.baseUrl + 'api/cliente/gestionar', formatoFuncion);
  }

  insertDirection(direccion: DireccionBack) {
    return this.httpClient.post(`${this.baseUrl}api/direccion/gestionar`, direccion);
  }

  getDirection(id: number) {
    const json = {
      id_cliente: id
    }
    return this.httpClient.post(`${this.baseUrl}api/direccion/obtener`, json);
  }

}
