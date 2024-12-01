import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  collectionData,
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  DocumentData,
  getDoc,
  docData,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root', // Asegúrate de que DatabaseService se provee en la raíz
})
export class DatabaseService {
  constructor(private firestore: Firestore, private http: HttpClient) {} // Inyección correcta de Firestore y HttpClient

  // Recuperar datos de una colección local (archivo JSON)
  fetchLocalCollection(collection: string): Observable<any> {
    return this.http.get(`db/${collection}.json`);
  }

  // Recuperar un documento por su ID, incluyendo el UID como parte de los datos
  getDocumentById(collectionName: string, documentId: string): Observable<any> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return docData(docRef, { idField: 'id' }); // Incluye el UID como parte de los datos
  }

  // Función para recuperar varios documentos según un campo específico
  getDocumentsByField(
    collectionName: string,
    field: string,
    value: any
  ): Observable<DocumentData[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const queryRef = query(collectionRef, where(field, '==', value));
    return collectionData(queryRef, { idField: 'id' });
  }

  // Recuperar todos los documentos de una colección en Firestore
  fetchFirestoreCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef, { idField: 'id' }); // Retorna los datos incluyendo el ID
  }

  // Método para agregar un documento a una colección en Firestore
  addFirestoreDocument(collectionName: string, data: any): Promise<any> {
    const collectionRef = collection(this.firestore, collectionName);
    return addDoc(collectionRef, data); // Añade un nuevo documento con los datos proporcionados
  }

  // Método para actualizar un documento existente en Firestore
  updateDocument(collectionName: string, documentId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return updateDoc(docRef, data); // Actualiza el documento con los datos proporcionados
  }

  // Método para sobrescribir un documento existente o crearlo si no existe
  setFirestoreDocument(collectionName: string, documentId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return setDoc(docRef, data); // Sobrescribe el documento con los datos proporcionados
  }

  // Método para eliminar un documento de una colección en Firestore
  deleteFirestoreDocument(collectionName: string, documentId: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return deleteDoc(docRef); // Elimina el documento con el ID proporcionado
  }

  // Alias para actualizar un documento (soluciona el error con updateFirestoreDocument)
  updateFirestoreDocument(collectionName: string, documentId: string, data: any): Promise<void> {
    return this.updateDocument(collectionName, documentId, data);
  }
}
