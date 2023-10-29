import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formularioLogin: FormGroup;
  cliente: Cliente = {
    contrasena: "",
    correoelectronico: "",
    direccion: "",
    idcliente: 0,
    nombre: "",
    numerotelefono: 415
  };

  constructor(private clienteService: ClienteService, private formBuilder: FormBuilder, private toastr: ToastrService) {
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

      // Realizar acciones con los datos obtenidos
      console.log(correoElectronico, contrasena);

      this.cliente.correoelectronico = correoElectronico;
      this.cliente.contrasena = contrasena;
      formatoFuncion.cliente = this.cliente;
      console.log(this.cliente);
      console.log(formatoFuncion);
    }

    this.clienteService.login(formatoFuncion).subscribe((res: any) => {
      if (res != null) {
        let jsonRes = JSON.parse(res[0].gestionar_cliente);
        console.log(jsonRes);

        if (jsonRes.codigo == 200) {
          this.clienteService.cliente = jsonRes.cliente[0];
          console.log(this.clienteService.cliente);
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
