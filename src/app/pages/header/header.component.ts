import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarritoService } from 'src/app/services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { ToastrService } from 'ngx-toastr';
import { ProductoResponse } from '../../models/producto.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent {
  modalRef?: BsModalRef;
  searchQuery: string = '';

  viewCart: boolean = false;
  myCart$ = this.carritoService.myCart$;
  products$ = this.carritoService.products$;
  categorias: Categoria[] = [];

  constructor(private carritoService: CarritoService, private modalService: BsModalService, private router: Router, private toastr: ToastrService) {
    this.getCategories();
  }

  openModal() {
    this.modalRef = this.modalService.show(CarritoComponent, { animated: true });
  }

  enviarId(id: number) {
    this.router.navigate(['/categoria', id]);
  }

  getCategories() {
    return this.carritoService.getCategories().subscribe((data) => {
      const respuesta = JSON.parse(data[0].filtrar_categoria);
      return this.categorias = respuesta.info;
    });
  }

  buscarProducto() {
    return this.carritoService.getProductsByName(this.searchQuery).subscribe((resp) => {

      const respuesta = JSON.parse(resp[0].filtrar_producto);

      if (respuesta.info === null) {
        this.toastr.info(`No se encontraron productos`);
        console.log(this.products$);
        return this.carritoService.actualizarProductos(respuesta.info);
      }
      if (respuesta.info !== null) {
        return this.carritoService.actualizarProductos(respuesta.info);
      }
    })
  }
}
