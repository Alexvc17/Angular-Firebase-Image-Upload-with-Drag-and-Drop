import { Component } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { CargaImagenesService } from 'src/app/services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [
  ]
})
export class CargaComponent {


  //aqui activamos la directiva
  estaSobreElemento: boolean = false;

  //arreglo de imagenes que quiero subir, lo inicializo como arreglo
  archivos: FileItem[]=[];

  constructor(public _cargaImagenes: CargaImagenesService){}

  cargarImagenes(){
    //le enviamos el this.archivos
    this._cargaImagenes.cargarImagenesFirebase(this.archivos);
  }

  limpiarArchivo(){
    this.archivos = []
  }
}
