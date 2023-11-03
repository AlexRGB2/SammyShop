import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioBanco } from '../models/usuarioBanco.model';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  baseUrl = 'https://bancosammyshop.fly.dev';

  constructor(private http: HttpClient) { }

  validarTarjeta(usuario: UsuarioBanco) {
    return this.http.post(`${this.baseUrl}/validate`, usuario);
  }
}
