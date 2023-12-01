import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compra } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  // baseUrl = 'https://comprabacktorres.fly.dev'
  baseUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) {
  }

  addBuy(compra: Compra) {
    return this.http.post(`${this.baseUrl}/addBuy`, compra);
  }
}
