import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//import firebase from 'firebase/app';

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import { FileItem } from '../models/file-item';




@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  //Esta sera el nombre de la carpeta donde colocaremos la imagenes
  private CARPETA_IMAGENES = 'img';


  constructor(private db: AngularFirestore) { }



  //recibe un arreglo de imagenes
  cargarImagenesFirebase(imagenes: FileItem[]){


  //**el primer paso es hacer referencia al storage de firebase**


  const storageRef = firebase.storage().ref();


  //hay que hacer un barrido de todas las imagenes que vienen en el parametro
  for(const item of imagenes){

    item.estaSubiendo = true;

    if(item.progreso >= 100){
      //pasa con la siguiente iteracion si la condicion se cumple
      continue;
    }

    //si no se ha subido del todo, aqui se sube a firebase  | child para poder almacenar algo en una ubicacion
    //carpeta de imagenes donde lo quiero colocar y el nombre del archivo
    const uploadTask: firebase.storage.UploadTask = storageRef.child(`${this.CARPETA_IMAGENES} / ${item.nombreArchivo}`)
                                                              .put(item.archivo);



    //quiero que se dispare esto cuando el estado cambie
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      //me indica el progreso del item
            (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            //por si sale error
            (error) => console.log("Error al subir", error),
            //si todo sale correcto
            () => {
                console.log("Imagen carada correctamente");
                // Obtiene la URL de descarga del archivo cargado desde Firebase Storage
                // y la asigna a la propiedad 'url' del item

                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {


                  item.url = downloadURL;
                  console.log(item.url);
                  item.estaSubiendo = false;

                                 // Guarda el archivo en Firebase solo si la URL de descarga es válida

                  // Guarda el archivo en Firebase
                  this.guardarImagen({
                    nombre: item.nombreArchivo,
                    url: item.url
                  });



              }).catch((error) => {
                  // Manejo de errores si la obtención de la URL de descarga falla
                  console.error("Error al obtener la URL de descarga", error);
              });


            });

  }
  }

  //aqui guardaria la referencia a la base de datos
  private guardarImagen(imagen: {nombre:string, url:string}){
    //grabarlo a Firebase     .collection para hacer una coleccion
    //especificamos el objeto donde lo voy a grabar y .add y el objeto que yo quiero grabar
    this.db.collection(`${this.CARPETA_IMAGENES}`)
            .add(imagen)
  }

}
