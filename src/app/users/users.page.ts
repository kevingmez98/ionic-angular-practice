import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from './forms/user/user-form/user-form.component';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { Profile } from '../interfaces/Profile.model';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class UsersPage implements OnInit {

  constructor(private modalCtr: ModalController, private userService: UserService) { }

  profiles: Profile[] = [];
  page = 1;
  pageSize = 4;
  count = 0;

  searchTerm: string = '';
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

  async openUserModal() {
    const modal = await this.modalCtr.create({
      component: UserFormComponent
    });

    await modal.present();
  }
}
