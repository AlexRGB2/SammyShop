import { Component, OnInit } from '@angular/core';
import { Mensaje, ProductoResponse } from '../../models/producto.model';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products$ = this.carritoService.products$;

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.getProducts();
  };

  getProducts() {
    this.carritoService.getAllProducts().subscribe((data) => {
      const respuesta: Mensaje = JSON.parse(data[0].filtrar_producto);
      return this.carritoService.actualizarProductos(respuesta.info);
    })
  }
}
