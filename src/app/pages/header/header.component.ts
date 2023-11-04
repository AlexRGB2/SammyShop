import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarritoService } from 'src/app/services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

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
  cliente = this.clienteService.cliente;

  constructor(
    private carritoService: CarritoService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private clienteService: ClienteService) {
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
    const arr = this.searchQuery.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return this.carritoService.getProductsByName(str2).subscribe((resp) => {

      const respuesta = JSON.parse(resp[0].filtrar_producto);

      if (respuesta.info === null) {
        this.toastr.info(`No se encontraron productos`);
        return this.carritoService.actualizarProductos(respuesta.info);
      }
      if (respuesta.info !== null) {
        return this.carritoService.actualizarProductos(respuesta.info);
      }
    })
  }
}
