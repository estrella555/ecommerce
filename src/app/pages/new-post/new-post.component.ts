import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-new-post',
    imports: [ReactiveFormsModule, NgIf],
    templateUrl: './new-post.component.html',
    styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  id: string | null = null;
  link: string | null = null;
  formulario!: FormGroup;
  post: any;

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute
  ) {
    // Extraer parámetros de la URL
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.link = this.activatedRoute.snapshot.queryParamMap.get('link');
    console.log('ID:', this.id, 'Link:', this.link);

    // Inicializar formulario
    this.formulario = this.fb.group({
      image: ['/posts/', []],
      content: ['', [Validators.required]],
    });

    // Cargar datos si hay un ID
    if (this.id) {
      this.loadPostData(this.id);
    }
  }

  /**
   * Cargar datos del post para edición.
   * @param id - ID del post a editar
   */
  loadPostData(id: string) {
    this.db.getDocumentById('posts', id).subscribe(
      (res: any) => {
        this.post = res;
        console.log('Post recuperado:', res);

        // Actualizar valores del formulario
        this.formulario.patchValue({
          image: res.image,
          content: res.content,
        });
      },
      (error: any) => {
        console.error('Error al recuperar el post:', error);
        alert('Error al cargar los datos del post.');
      }
    );
  }

  /**
   * Guardar o actualizar el post en Firestore.
   */
  async storePost() {
    if (this.formulario.valid) {
      const { image, content } = this.formulario.value;

      try {
        if (this.id) {
          // Actualizar post existente
          await this.db.updateFirestoreDocument('posts', this.id, { image, content });
          alert('Post actualizado exitosamente.');
        } else {
          // Crear nuevo post
          await this.db.addFirestoreDocument('posts', {
            userId: this.auth.profile?.id,
            image: image,
            content: content,
            userTags: [],
            share: [],
            likes: [],
            comentarios: [],
            createdAt: new Date().toISOString(),
          });
          alert('Nuevo post creado exitosamente.');
        }
      } catch (error) {
        console.error('Error al guardar el post:', error);
        alert('Ocurrió un error al guardar el post.');
      }
    } else {
      alert('Por favor, complete los campos requeridos.');
    }
  }
}
