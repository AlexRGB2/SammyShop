import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent {
  modalRef?: BsModalRef;
  myCart$ = this.carritoService.myCart$;

  viewCart: boolean = false;

  constructor(private carritoService: CarritoService, private modalService: BsModalService) { }

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
}
