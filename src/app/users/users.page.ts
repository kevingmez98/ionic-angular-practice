import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from './forms/user/user-form/user-form.component';
import { HeaderComponent } from '../shared/components/header/header/header.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class UsersPage implements OnInit {

  constructor(private modalCtr: ModalController) { }


  ngOnInit() {
  }


  async openUserModal() {
    const modal = await this.modalCtr.create({
      component: UserFormComponent
    });

    await modal.present();
  }
}
