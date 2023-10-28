import { Component, Input } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { ToastrService } from 'ngx-toastr';
import { Producto, ProductoResponse } from 'src/app/models/producto.model';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent {
  @Input() productos: ProductoResponse[] = [];
  alerts: any[] = [];

  constructor(private carritoService: CarritoService, private toastr: ToastrService) { }

  addToCart(product: Producto) {
    this.carritoService.addProduct(product)
  }

  showToast(name: string) {
    this.toastr.success(`${name} agregado al carrito.`, 'Agregado');
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

}
