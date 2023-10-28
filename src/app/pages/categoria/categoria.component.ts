import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoResponse, Mensaje } from 'src/app/models/producto.model';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
  id: number | string | null = 0;
  productos: ProductoResponse[] = [];

  constructor(private carritoService: CarritoService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getProductsbyCategory(this.id);
    });
  }

  ngOnInit(): void {
    this.getProductsbyCategory(this.id);
  }

  getProductsbyCategory(id: number | string | null) {
    this.carritoService.getProductsbyCategory(id).subscribe((data) => {
      const respuesta: Mensaje = JSON.parse(data[0].filtrar_producto);
      return this.productos = respuesta.info;
    })
  }



}
