export class FileItem{

  public archivo!: File;
  public nombreArchivo!: string;
  public url!: string
  public estaSubiendo!: boolean;
  public progreso!: number;


  //este coonctructor debera de recibir un archivo
  constructor(archivo:File){
    //inicializacion de las propiedades
    this.archivo = archivo;
    this.nombreArchivo = archivo.name;

    this.estaSubiendo = false;
    this.progreso = 0;

  }

}
