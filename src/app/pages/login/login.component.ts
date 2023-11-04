import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers: [HeaderComponent]
})
export class LoginComponent {
  formularioLogin: FormGroup;
  cliente: Cliente = {
    contrasena: "",
    correoelectronico: "",
    idcliente: 0,
    nombre: "",
    numerotelefono: 415
  };

  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    // private header: HeaderComponent,
    private router: Router) {
    this.formularioLogin = this.formBuilder.group({
      correoElectronico: ['', Validators.required], // Definir validadores según tus necesidades
      contrasena: ['', Validators.required] // Definir validadores según tus necesidades
    });
  }

  login() {
    let formatoFuncion = {
      "accion": 2,
      "cliente": {}
    };

    if (this.formularioLogin.valid) {
      // Aquí puedes acceder a los valores del formulario
      const correoElectronico = this.formularioLogin.get('correoElectronico')?.value;
      const contrasena = this.formularioLogin.get('contrasena')?.value;

      this.cliente.correoelectronico = correoElectronico;
      this.cliente.contrasena = contrasena;
      formatoFuncion.cliente = this.cliente;
    }

    this.clienteService.login(formatoFuncion).subscribe((res: any) => {
      if (res != null) {
        let jsonRes = JSON.parse(res[0].gestionar_cliente);

        if (jsonRes.codigo == 200) {
          this.clienteService.cliente = jsonRes.cliente[0]
          // console.log(this.header.cliente);
          localStorage.setItem('cliente', JSON.stringify(jsonRes.cliente[0]));
          // this.header.cliente = JSON.parse(localStorage.getItem('cliente') || '{}');
          // console.log(this.header.cliente);
          this.router.navigate(['home'])
          this.showToast(jsonRes.codigo, jsonRes.mensaje);
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
