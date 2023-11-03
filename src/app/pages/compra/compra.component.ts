import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Cliente, Direccion, DireccionBack } from 'src/app/models/cliente.model';
import { Compra } from 'src/app/models/compra.model';
import { Image, ImageResponse } from 'src/app/models/imageResponse.model';
import { Producto } from 'src/app/models/producto.model';
import { UsuarioBanco } from 'src/app/models/usuarioBanco.model';
import { CarritoService } from 'src/app/services/carrito.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CompraService } from 'src/app/services/compra.service';
import { TarjetaService } from 'src/app/services/tarjeta.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss'],
})
export class CompraComponent implements OnDestroy {
  productos: Producto[] = [];
  imagenes: Image[] = [];
  direcciones: Direccion[] = [];
  cliente: Cliente = JSON.parse(localStorage.getItem('cliente') || '{}');
  private nuevaDireccion = new BehaviorSubject<boolean>(false);
  nuevaDireccion$ = this.nuevaDireccion.asObservable();
  thereIsAddress: boolean = false;
  direccionCliente: any;

  direccion = this._formBuilder.group({
    cp: ['', Validators.required],
    estado: ['', Validators.required],
    municipio: ['', Validators.required],
    colonia: ['', Validators.required],
    calle: ['', Validators.required],
    numeroExterior: [''],
    numeroInterior: [''],
    referencia: [''],
  });

  tarjeta = this._formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    numeroTarjeta: ['', [Validators.required, Validators.maxLength(16)]],
    fechaVencimiento: [moment(), Validators.required],
    cvv: ['', [Validators.required, Validators.maxLength(3)]],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private carritoService: CarritoService,
    private clienteService: ClienteService,
    private compraService: CompraService,
    private tarjetaService: TarjetaService,
    private router: Router,
    private toastr: ToastrService) {
    this.carritoService.myCart$.subscribe((p) => {
      this.productos = p
    })
    this.carritoService.getImagesProducts().subscribe((resp: ImageResponse) => {
      this.imagenes = resp.object;
    })
    this.getDirection(this.cliente.idcliente).subscribe((resp: any) => {
      this.direcciones = resp;
    })
  }

  setNuevaDireccion() {
    this.nuevaDireccion.next(true)
  }

  ngOnDestroy(): void {
    localStorage.removeItem('cliente');
  }

  /**
   * Método que se encarga de manipular el datepicker.
   * @returns - void
   */
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.tarjeta.controls['fechaVencimiento'].value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.tarjeta.controls['fechaVencimiento'].setValue(ctrlValue);
    datepicker.close();
  }

  /**
   * Método que realiza el proceso de compra.
   * @returns - void
   */
  async compra() {
    let tarjetaValida;

    if (!this.thereIsAddress) {
      const direccionInsertada = await this.inserAddress();

      if (!direccionInsertada) {
        this.toastr.warning("Verifica tu dirección bancarios");

      } else {
        tarjetaValida = await this.validarTarjeta();

        if (!tarjetaValida) {
          this.toastr.warning("Hubo un error al guardar tu dirección");

        } else {
          this.insertBuy();

        }
      }
    } else {
      tarjetaValida = await this.validarTarjeta();

      if (!tarjetaValida) {
        this.toastr.warning("Hubo un error al guardar tu dirección");

      } else {
        this.insertBuy();

      }
    }

  }

  insertBuy() {
    let compra: Compra;
    if (this.thereIsAddress) {
      compra = {
        idcliente: this.cliente.idcliente,
        fechapedido: moment().format('YYYY-MM-DD'),
        id_direccion: this.direccionCliente.id_direccion,
        monto: this.carritoService.totalCart(),
        productos: []
      }
    } else {
      compra = {
        idcliente: this.cliente.idcliente,
        fechapedido: moment().format('YYYY-MM-DD'),
        id_direccion: null,
        monto: this.carritoService.totalCart(),
        productos: []
      }
    }

    this.carritoService.myCart$.subscribe((p) => {
      compra.productos = p;
    })

    this.compraService.addBuy(compra).subscribe((resp: any) => {
      if (resp.codigo !== 0) {
        this.toastr.error("Error al realizar la compra");
      } else {
        this.toastr.success("Compra realizada con exito");
        this.carritoService.deleteAllCart();
        location.assign('/home')
      }
    });
  }

  /**
   * Método que verifica con el banco los datos bancarios.
   * @returns - Promesa que determina si es valida o no la tarjeta.
   */
  validarTarjeta(): Promise<boolean> {
    let promesa: Promise<boolean> = new Promise((resolve) => { });

    if (this.tarjeta.valid) {
      const nombre = this.tarjeta.controls['nombre'].value?.toLocaleUpperCase();
      const apellido = this.tarjeta.controls['apellido'].value?.toLocaleUpperCase();

      if (nombre && apellido) {
        const usuario: UsuarioBanco = {
          nombre: nombre,
          apellido: apellido,
          numerotarjeta: this.tarjeta.controls['numeroTarjeta'].value,
          fechavencimiento: this.tarjeta.controls['fechaVencimiento'].value?.format('MM/YY'),
          cvv: Number(this.tarjeta.controls['cvv'].value),
          monto: this.carritoService.totalCart()
        }

        promesa = new Promise((resolve) => {
          this.tarjetaService.validarTarjeta(usuario).subscribe((resp: any) => {
            if (resp.codigo !== 0) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        })
      }

    }
    return promesa;
  }

  /**
   * Método que inserta la direccion del cliente.
   * @returns - void
   */
  inserAddress(): Promise<boolean> {
    let promesa: Promise<boolean> = new Promise((resolve) => { });

    const direccion: DireccionBack = {
      direccion: {
        codigo_postal: Number(this.direccion.controls['cp'].value),
        estado: this.direccion.controls['estado'].value,
        municipio: this.direccion.controls['municipio'].value,
        colonia: this.direccion.controls['colonia'].value,
        calle: this.direccion.controls['calle'].value,
        numero_exterior: Number(this.direccion.controls['numeroExterior'].value),
        numero_interior: Number(this.direccion.controls['numeroInterior'].value),
        referencia: this.direccion.controls['referencia'].value,
        id_cliente: this.cliente.idcliente
      }
    }
    console.log(direccion)

    promesa = new Promise((resolve) => {
      this.clienteService.insertDirection(direccion).subscribe((resp: any) => {
        if (resp.estatus !== 'Exitó') {
          resolve(false)
        } else {
          resolve(true);
        }
      });

    })
    return promesa
  }

  selectAddress(direccion: Direccion) {
    this.thereIsAddress = true;
    this.direccionCliente = direccion
  }

  getProductImage(clave: string): string {
    const image = this.imagenes.find(img => img.claveProducto === clave);
    if (image) {
      return `data:image/png;base64,${image.imgB64[0]}`
    }
    return ''
  }

  getDirection(id: number) {
    return this.clienteService.getDirection(id);
  }

}
