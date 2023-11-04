import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VentaComponent } from '../venta.component';
import { Producto } from 'src/app/models/producto.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-formularioProducto',
  templateUrl: './formularioProducto.component.html',
  styleUrls: ['./formularioProducto.component.scss']
})
export class FormularioProductoComponent implements OnInit {

  productoForm: FormGroup;
  imagesBase64: string[] = [];
  producto!: Producto;
  categorias: any[] = [];
  seleccionados: boolean[] = new Array(this.categorias.length).fill(false);
  productoUpdate: any;

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private ventaService: VentaService) {
    this.productoForm = this.fb.group({
      clave: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      stock: [1, Validators.min(1)],
      marca: ['', Validators.required],
      precio: [1.00, Validators.min(1.00)],
      categorias: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategorias();

    this.ventaService.productoUpdate$.subscribe((valor) => {
      this.productoUpdate = valor;
    });

    console.log(this.productoUpdate);

    if (this.productoUpdate != null) {
      this.productoForm.setValue({
        clave: this.productoUpdate.producto.clave,
        nombre: this.productoUpdate.producto.nombre,
        descripcion: this.productoUpdate.producto.descripcion,
        stock: this.productoUpdate.producto.stock,
        marca: this.productoUpdate.producto.marca,
        precio: this.productoUpdate.producto.precio,
        categorias: this.productoUpdate.categorias.split(',').map(str => Number(str.trim()))
      });

      let json = {
        "claveProducto": ""
      }

      json.claveProducto = this.productoUpdate.producto.clave;

      this.ventaService.getImagesProduct(json).subscribe((res) => {
        console.log(res.object[0]);
        this.imagesBase64 = res.object[0].imgB64;
      });
    }
  }

  onSubmit() {
    this.producto = {
      baja_logica: false,
      cantidad: 0,
      clave: this.productoForm.value.clave,
      descripcion: this.productoForm.value.descripcion,
      fecha_alta: new Date().toString(),
      fecha_modificacion: null,
      id_categoria: this.productoForm.value.categorias,
      id_cliente: this.clienteService.cliente.idcliente,
      id_producto: 0,
      marca: this.productoForm.value.marca,
      nombre: this.productoForm.value.nombre,
      precio: this.productoForm.value.precio,
      stock: this.productoForm.value.stock,
    };

    // Agregar imagesBase64 al objeto que se va a enviar
    const productoData = {
      producto: this.producto,
      imagesBase64: this.imagesBase64
    };
    return productoData;
  }

  handleFileSelect(event: any) {
    const files = event.target.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const dataURL = e.target.result.split(',');
          this.imagesBase64.push(dataURL[1]);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(image: string) {
    const index = this.imagesBase64.indexOf(image);
    if (index !== -1) {
      this.imagesBase64.splice(index, 1);
    }
  }

  getCategorias() {
    let formatoFuncion = {
      "accion": 1
    }

    this.ventaService.getCategorias(formatoFuncion).subscribe((res) => {
      let resJSON = JSON.parse(res[0].filtrar_categoria);
      console.log(resJSON);
      this.categorias = resJSON.info;
      console.log(this.categorias);
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.productoForm.get(controlName)?.hasError(errorName) || false;
  }

  onFormChange(evento: Event) {
    this.ventaService.setVariable(this.productoForm.valid);
    this.ventaService.setProductoData(this.getProductData());
    console.log(this.productoForm.valid);
    console.log(this.ventaService.formularioValido$);
    console.log(this.getProductData());
    console.log(this.ventaService.productoData$);
  }

  getProductData() {
    this.producto = {
      baja_logica: false,
      cantidad: 0,
      clave: this.productoForm.value.clave,
      descripcion: this.productoForm.value.descripcion,
      fecha_alta: this.getFormattedDate(),
      fecha_modificacion: null,
      id_categoria: this.productoForm.value.categorias,
      id_cliente: this.clienteService.cliente.idcliente,
      id_producto: 0,
      marca: this.productoForm.value.marca,
      nombre: this.productoForm.value.nombre,
      precio: this.productoForm.value.precio,
      stock: this.productoForm.value.stock,
    };

    // Agregar imagesBase64 al objeto que se va a enviar
    const productoData = {
      producto: this.producto,
      imagesBase64: this.imagesBase64
    };
    return productoData;
  }

  getFormattedDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan en 0
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
}
