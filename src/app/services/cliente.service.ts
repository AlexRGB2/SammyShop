import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente.model';

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
}
