import { Component, Input } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { ToastrService } from 'ngx-toastr';
import { Image, ImageResponse } from 'src/app/models/imageResponse.model';
import { Producto, ProductoResponse } from 'src/app/models/producto.model';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent {
  products$ = this.carritoService.products$;
  imagenes: Image[] = [];
  loading: boolean = false;

  constructor(private carritoService: CarritoService, private toastr: ToastrService) {
    this.loading = true;
    this.carritoService.getImagesProducts().subscribe((resp: ImageResponse) => {
      this.loading = false;
      this.imagenes = resp.object;
    })
  }

  addToCart(product: Producto) {
    this.carritoService.addProduct(product)
  }

  showToast(name: string) {
    this.toastr.success(`${name} agregado al carrito.`, 'Agregado');
  }

  getProductImage(clave: string): string {
    const image = this.imagenes.find(img => img.claveProducto === clave);
    if (image) {
      return `data:image/png;base64,${image.imgB64[0]}`
    }
    return ''
  }

}
