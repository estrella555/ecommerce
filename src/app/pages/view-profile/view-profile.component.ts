import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
})
export class ViewProfileComponent implements OnInit {
  id: string | null = null; 
  data: any = {}; 
  selectedFile: File | null = null; 
  defaultPhotoURL = '/posts/example.jpg'; 

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id) {
      this.db.getDocumentById('users', this.id).subscribe({
        next: (res: any) => {
          console.log('Datos del usuario:', res);
          this.data = res;

          if (!this.data?.photoURL) {
            this.updatePhotoURL(this.defaultPhotoURL);
          }
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
        },
      });
    } else {
      console.error('No se proporcionó un ID de usuario en la URL.');
    }
  }

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
      this.uploadPhoto(); 
    }
  }

  
  uploadPhoto(): void {
    if (!this.selectedFile || !this.id) {
      console.error('No se seleccionó ningún archivo o no se tiene un ID válido.');
      return;
    }

    const filePath = `posts/${this.id}`; 
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, this.selectedFile);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe({
            next: (url) => {
              console.log('Nueva foto URL:', url);
              this.updatePhotoURL(url); 
            },
            error: (err) => {
              console.error('Error al obtener la URL de la foto:', err);
            },
          });
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error durante la carga de la foto:', err);
        },
      });
  }

  updatePhotoURL(url: string): void {
    if (!this.id) {
      console.error('No se puede actualizar la foto porque no se tiene un ID de usuario.');
      return;
    }

    this.db.updateDocument('users', this.id, { photoURL: url }).then(() => {
      console.log('Foto actualizada en Firestore');
      this.data.photoURL = url; 
    }).catch((err) => {
      console.error('Error al actualizar la foto en Firestore:', err);
    });
  }
}
