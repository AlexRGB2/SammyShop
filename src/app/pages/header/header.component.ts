import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarritoService } from 'src/app/services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }, HomeComponent]
})
export class HeaderComponent {
  modalRef?: BsModalRef;
  searchQuery: string = '';

  viewCart: boolean = false;
  myCart$ = this.carritoService.myCart$;
  categorias: Categoria[] = [];

  constructor(private carritoService: CarritoService, private modalService: BsModalService, private router: Router, private homeComponent: HomeComponent) {
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
      console.log(respuesta.info);
      return this.homeComponent.productos = respuesta.info;
    })
  }
}
