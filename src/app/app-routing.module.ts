import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { CompraComponent } from './pages/compra/compra.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VentaComponent } from './pages/venta/venta.component';
import { FormularioProductoComponent } from './pages/venta/formularioProducto/formularioProducto.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CarritoComponent },
  { path: 'categoria/:id', component: CategoriaComponent, runGuardsAndResolvers: 'always', },
  { path: 'compra', component: CompraComponent },
  { path: 'vender', component: VentaComponent },
  { path: 'form', component: FormularioProductoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
