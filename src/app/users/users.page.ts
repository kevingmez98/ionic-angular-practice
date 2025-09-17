import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from './forms/user/user-form/user-form.component';
import { ShowdataComponent } from './forms/user/showdata/showdata.component';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { Profile } from '../interfaces/Profile.model';
import { UserService } from '../services/users.service';
import { UserRoles } from '../constants/roles';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class UsersPage implements OnInit {

  constructor(private modalCtr: ModalController, private userService: UserService,
    private toastCtr: ToastController
  ) { }

  profiles: Profile[] = [];
  page = 1;
  pageSize = 4;
  count = 0;
  totalPages = 0;

  selectedRole: string | null = null;

  async ngOnInit() {
    await this.loadProfiles();
  }



  // Cargar información de profiles
  async loadProfiles() {
    try {
      const result = await this.userService.getExtendedUserInfo(this.page, this.pageSize);
      this.profiles = result.data;
      this.count = result.total;
      this.totalPages = Math.ceil(this.count / this.pageSize);
    } catch (error) {
      console.error('Error al cargar perfiles:', error);
    }
  }

  /*Controles de navegación de paginación */
  nextPage() {
    this.page++;
    this.loadProfiles();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProfiles();
    }
  }

  get isLastPage(): boolean {
    return this.page * this.pageSize >= this.count;
  }

  async openUserModal(isEditMode: boolean, profile?: Profile) {
    const modal = await this.modalCtr.create({
      component: UserFormComponent,
      componentProps: {
        isEditMode: isEditMode,
        existingUser: profile || null
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    // Si se creó un nuevo usuario, recargar los perfiles
    if (data?.refresh) {
      const toast = await this.toastCtr.create({
        message: 'Usuario creado correctamente',
        duration: 2500,
        position: "top",
      });

      await toast.present();
      this.loadProfiles();
    }
  }

  async openInfoModal(profile: Profile) {
    const modal = await this.modalCtr.create({
      component: ShowdataComponent,
      componentProps: {
        profile // Pasar el dato al modal
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
  }

  // Traer nombre del rol
  getRoleName(code: string): string {
    // Busca entre los valores de UserRoles el que tenga ese código
    const role = Object.values(UserRoles).find(r => r.code === code);
    return role ? role.name : code; // Si no lo encuentra, muestra el code
  }
}
