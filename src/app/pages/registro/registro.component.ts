import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  formularioRegistro: FormGroup;
  cliente: Cliente = {
    contrasena: "",
    correoelectronico: "",
    direccion: "",
    idcliente: 0,
    nombre: "",
    numerotelefono: 0
  };

  constructor(private clienteService: ClienteService, private formBuilder: FormBuilder, private toastr: ToastrService, public router: Router) {
    this.formularioRegistro = this.formBuilder.group({
      correoElectronico: ['', Validators.required],
      contrasena: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: [0, Validators.required]
    });
  }

  registrar() {
    let formatoFuncion = {
      "accion": 1,
      "cliente": {}
    };

    if (this.formularioRegistro.valid) {
      // Aquí puedes acceder a los valores del formulario
      const correoElectronico = this.formularioRegistro.get('correoElectronico')?.value;
      const contrasena = this.formularioRegistro.get('contrasena')?.value;
      const nombre = this.formularioRegistro.get('nombre')?.value;
      const telefono = this.formularioRegistro.get('telefono')?.value;

      // Realizar acciones con los datos obtenidos
      console.log(correoElectronico, contrasena, nombre, telefono);

      this.cliente.correoelectronico = correoElectronico;
      this.cliente.contrasena = contrasena;
      this.cliente.nombre = nombre;
      this.cliente.numerotelefono = telefono;
      formatoFuncion.cliente = this.cliente;
      console.log(this.cliente);
      console.log(formatoFuncion);
    }

    this.clienteService.registro(formatoFuncion).subscribe((res: any) => {
      if (res != null) {
        let jsonRes = JSON.parse(res[0].gestionar_cliente);
        console.log(jsonRes);

        if (jsonRes.codigo == 200) {
          this.clienteService.cliente = jsonRes.cliente[0];
          console.log(this.clienteService.cliente);
          this.showToast(jsonRes.codigo, jsonRes.mensaje);
          this.router.navigate(['/login']);
        } else if (jsonRes.codigo == -1) {
          this.showToast(jsonRes.codigo, jsonRes.mensaje);
        } else {
          this.showToast(-1, 'Error desconocido');
        }
      }
    });
  }

  showToast(codigo: number, mensaje: string) {
    if (codigo == 200) {
      this.toastr.success(`${mensaje}`, 'Bienvenido ' + this.clienteService.cliente.nombre);
    } else if (codigo == -1) {
      this.toastr.error(`${mensaje}`);
    }
  }
}
