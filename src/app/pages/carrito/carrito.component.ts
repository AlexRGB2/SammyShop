import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarritoService } from 'src/app/services/carrito.service';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent {
  modalRef?: BsModalRef;
  myCart$ = this.carritoService.myCart$;

  constructor
    (private carritoService: CarritoService,
      private modalService: BsModalService,
      private clienteService: ClienteService,
      private router: Router) { }

  updateUnits(operation: string, id: number) {

    const product = this.carritoService.findProductById(id)
    if (product) {
      if (operation === 'minus' && product.cantidad > 0) {
        product.cantidad = product.cantidad - 1;
      }
      if (operation === 'add') {
        product.cantidad = product.cantidad + 1;

      }
      if (product.cantidad === 0) {
        this.deleteProduct(id)
      }
    }

  }

  totalProduct(price: number, units: number) {
    return price * units
  }

  deleteProduct(id: number) {
    this.carritoService.deleteProduct(id);
  }

  totalCart() {
    const result = this.carritoService.totalCart();
    return result;
  }

  closeModal() {
    this.modalService.hide();
  }

  checkIsLogin() {
    const cliente: Cliente = JSON.parse(localStorage.getItem('cliente') || '{}');
    if (cliente.idcliente !== undefined) {
      this.router.navigate(['compra']);
      this.closeModal();
    } else {
      this.router.navigate(['login']);
      this.closeModal();
    }
  }
}
