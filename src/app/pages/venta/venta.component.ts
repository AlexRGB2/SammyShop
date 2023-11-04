import { FormularioProductoComponent } from './formularioProducto/formularioProducto.component';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Image } from 'src/app/models/imageResponse.model';
import { Producto } from 'src/app/models/producto.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
import { takeUntil } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
})
export class VentaComponent implements AfterViewInit, OnInit {
  formularioValido: boolean = false;
  identificador?: number;
  displayedColumns: string[] = [
    'position',
    'Clave',
    'Nombre',
    'Marca',
    'Precio',
    'Stock',
    'Acciones',
  ];
  ELEMENT_DATA: Producto[] = [];
  dataSource = new MatTableDataSource<Producto>(this.ELEMENT_DATA);
  producto: Producto = {
    id_producto: 0,
    nombre: '',
    descripcion: '',
    stock: 0,
    fecha_alta: '',
    fecha_modificacion: '',
    baja_logica: false,
    marca: '',
    id_categoria: 0,
    cantidad: 0,
    id_cliente: 0,
    clave: '',
    precio: 0.0,
  };
  productImages: Image = {
    _id: '',
    claveProducto: '',
    imgB64: [],
  };
  closeResult: string = '';
  formatoFuncion: any = {
    accion: 0,
    producto: this.producto,
  };
  productoData: any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  modalRef?: BsModalRef;

  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getAllProductosUsuario();
  }

  ngOnInit(): void {
    this.ventaService.formularioValido$.subscribe((valor) => {
      this.formularioValido = valor;
    });
    this.ventaService.productoData$.subscribe((valor) => {
      this.productoData = valor;
    });
  }

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  getAllProductosUsuario() {
    let formatoFuncion = {
      accion: 2,
      filtro: {
        id_cliente: 0,
      },
    };

    if (this.clienteService.cliente != null) {
      console.log(this.clienteService.cliente);

      formatoFuncion.filtro.id_cliente = this.clienteService.cliente.idcliente;
      console.log(formatoFuncion);
    } else {
      console.log(this.clienteService.cliente);
      this.showToast(-1, 'Inicia sesión');
      this.router.navigate(['/login']);
    }

    this.ventaService
      .getAllProductosUsuario(formatoFuncion)
      .subscribe((res: any) => {
        let resJSON = JSON.parse(res[0].filtrar_producto);
        console.log(resJSON);
        this.ELEMENT_DATA = resJSON.info;
        this.dataSource = new MatTableDataSource<Producto>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        console.log(this.ELEMENT_DATA);
      });
  }

  eliminar(producto: Producto) {
    console.log(producto);
    console.log(this.formatoFuncion);
    this.formatoFuncion.accion = 4;
    this.formatoFuncion.producto = producto;
  }

  agregar() {
    this.formatoFuncion.accion = 1;
    console.log(this.formatoFuncion);
  }

  actualizar(producto: Producto) {
    console.log(producto);

    this.ventaService.setProductoUpdate(producto);
  }

  info(producto: Producto) {
    console.log(producto);
    this.producto = producto;
    let claveProducto = producto.clave

    let json = {
      "claveProducto": ""
    }

    json.claveProducto = claveProducto;

    this.ventaService.getImagesProduct(json).subscribe((res) => {
      console.log(res.object[0]);
      this.productImages = res.object[0];
    });
  }

  showImage(image: string) {
    // Logic to display a larger version of the clicked image
  }

  confirmar() {
    console.log(this.productoData);
    if (this.formatoFuncion.accion == 1 || this.formatoFuncion.accion == 2) {
      this.producto = this.productoData.producto;
      this.productImages.imgB64 = this.productoData.imagesBase64;
      this.productImages.claveProducto = this.producto.clave;

      this.formatoFuncion.producto = this.producto;

      let jsonImagenes = {
        "claveProducto": "",
        "imgB64": [""]
      }

      jsonImagenes.claveProducto = this.productImages.claveProducto;
      jsonImagenes.imgB64 = this.productImages.imgB64;

      this.ventaService.saveImagesProduct(jsonImagenes).subscribe((res: any) => {
        console.log(res);
      });
    }

    this.modalService.hide();

    this.ventaService
      .gestionarProductos(this.formatoFuncion)
      .subscribe((res: any) => {
        if (res) {
          this.showToast(res.codigo, res.mensaje);
        }
      });

    this.getAllProductosUsuario();
  }

  showToast(codigo: number, mensaje: string) {
    if (codigo == 200 || codigo == 0) {
      this.toastr.success(`${mensaje}`, 'Exitó');
    } else if (codigo == -1) {
      this.toastr.error(`${mensaje}`, 'Error');
    }
  }

  openModal(template: TemplateRef<any>, identificador?: number) {
    this.identificador = identificador;
    console.log(this.identificador);

    this.modalRef = this.modalService.show(template, this.config);
  }


  closeModal() {
    this.ventaService.setProductoUpdate(null);
    this.modalService.hide();
    this.getAllProductosUsuario();
  }
}
