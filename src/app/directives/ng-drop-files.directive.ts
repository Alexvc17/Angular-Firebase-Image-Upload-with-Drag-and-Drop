import { Directive, EventEmitter, ElementRef, HostListener, Input, Output, NgModule } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  //para crear una relacion de los archivos que se recibe desde el servicio con nuestra directiva
  //recibire archivos de tipo FileItem
  @Input() archivos: FileItem[] = [];
  //creare el nombre del evento de tipo EventEmitter.. emitire un booleano
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }


  //le especificamos un callback cuando se arrestre algo sobre el dragover, disparare un evento ['$event']
  @HostListener('dragover',['$event  '])
  public onDragEnter(event:any){
    //una notificacion para q el padre sepa que el mouse esta encima
    this.mouseSobre.emit(true);
    //el evento se dispara se detiene
    this._prevenirDetener(event);
  }
  //creamos un evento para cuando se retire el mouse del drop-zone
  @HostListener('dragleave',['$event'])
  public onDragLeave(event:any){
    this.mouseSobre.emit(false);
  }

//para cuando se haga el drop
  @HostListener('drop',['$event'])
  public onDrop(event:any){

    //los archivos se encuentran ahora en la constante transferencia
    const transferencia = this._getTransferencia(event)

    if(!transferencia){
      //si no hay nada que transferir hago un return
      return;


    }else{
      console.log("Transfiere algo. Continuando con el código...");
      this._extraerArchivos(transferencia.files);
      this._prevenirDetener(event);
      //recuadro deja de ser azul
      this.mouseSobre.emit(false);

    }
  }
  //para extender la compabilidad a otros navegadores
  private _getTransferencia(event: any){
    //del evento quiero la dataTransfer
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer
  }
  //ahora para extraer los archivos   | FileList es un objeto de todos los archivos que hice drag and drop
  private _extraerArchivos(archivosLista: FileList){
    //la informacion que se imprime es un objeto.. hay que pasarlo a aun arreglo
    //asi que uso un ciclo for para barrer cada una de las propiedades del objeto
    for(const propiedad in Object.getOwnPropertyNames(archivosLista)){
      //aqui tendriamos el archivo que queremos cargar
      //que vendria siendo igual al valor del archivo asociado con el nombre de la propiedad
      const archivoTemporal = archivosLista[propiedad];
      console.log(archivoTemporal);

      //condicion si el archivo puede cargarse entonces
      if(this._archivoPuedeCargarse(archivoTemporal)){

        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);

      }
    }
    console.log("ARCHIVOS CARGADOS",this.archivos)
  }

  //Validaciones, privadas, no saldran de la directiva
  private _archivoPuedeCargarse(archivo: File): boolean{


    //si el archivo no esta y es imagen entonces retornar verdadero
    //aqui esta enviando el nombre del archivo y el tipo de archivo al metodo
    if(!this._archivoDroppeado(archivo.name) && this._esImagen(archivo.type)){
      return true;
    }else{
      return false;
    }

  }


  private _prevenirDetener(event:any)  {
    event.preventDefault();
    event.stopPropagation();
  }

  //recibe el nombre del archivo ... archivo.name
  private _archivoDroppeado(nombreArchivo: string):boolean{

    for(const archivo of this.archivos){
      //si el nombre del archivo es igual al que se dropeo
      if(archivo.nombreArchivo === nombreArchivo){

        console.log("El archivo "+nombreArchivo+" ya existe");
        return true;
      }
    }
    //si nombreArchivo no esta retorna false
    return false;

  }

  //validador que sean solo imagenes... recibe el archivo.type de tipo string
  private _esImagen(tipoArchivo: string): boolean{
  //SI ENTONCES falso SINO si archivo empieza con image entonces true;
    return(tipoArchivo === "" || tipoArchivo === undefined) ? false: tipoArchivo.startsWith("image");
  }



  }


