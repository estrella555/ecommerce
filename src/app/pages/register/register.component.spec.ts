import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  loginForm: FormGroup;
  selectedFile: File | null = null; // Archivo seleccionado
  photoURL: string = ''; // URL de la foto subida

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private storage: AngularFireStorage
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['+591', []],
      password: ['', Validators.required],
    });
  }

  // Maneja la selección del archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Método para subir la foto al Storage
  uploadPhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve('/posts/default-profile.jpg'); // Foto predeterminada si no se selecciona ninguna
        return;
      }

      const filePath = `posts/${this.loginForm.get('email')?.value}_${Date.now()}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe({
              next: (url) => resolve(url),
              error: (err) => reject(err),
            });
          })
        )
        .subscribe();
    });
  }

  // Maneja el registro del usuario
  async onRegister(): Promise<void> {
    if (this.loginForm.valid) {
      console.log('Formulario válido:', this.loginForm.value);

      try {
        // Subir foto y obtener URL
        this.photoURL = await this.uploadPhoto();

        // Agregar URL de la foto al payload
        const userData = {
          ...this.loginForm.value,
          photoURL: this.photoURL,
        };

        // Registrar usuario en Firebase
        const { email, password } = this.loginForm.value;
        await this.auth.registerUser(email, password, userData);

        console.log('Registro exitoso:', userData);
        alert('Usuario registrado con éxito');
      } catch (error) {
        console.error('Error durante el registro:', error);
        alert('Ocurrió un error al registrarte.');
      }
    } else {
      console.log('Formulario inválido:', this.loginForm.value);
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
