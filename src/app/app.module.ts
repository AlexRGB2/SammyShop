import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { HomeComponent } from './pages/home/home.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';

import { HeaderComponent } from './pages/header/header.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { CompraComponent } from './pages/compra/compra.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro..component';

@NgModule({
  declarations: [
    AppComponent,
    CarritoComponent,
    HomeComponent,
    HeaderComponent,
    ProductoComponent,
    CategoriaComponent,
    CompraComponent,
    FooterComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ToastrModule.forRoot({
      countDuplicates: true,
      preventDuplicates: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: "rgba(0,0,0,0.1)",
      backdropBorderRadius: "4px",
      primaryColour: "#0B3954",
      secondaryColour: "#0B3954",
      tertiaryColour: "#0B3954",
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
