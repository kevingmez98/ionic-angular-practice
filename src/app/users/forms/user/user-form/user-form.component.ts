import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/users.service';
import { DepartmentService } from 'src/app/services/departments.service';
import {AdvisorService} from 'src/app/services/advisor.service';
import { Department } from 'src/app/interfaces/department.model';
import { NewProfile } from 'src/app/interfaces/Profile.model';
import { NewAdvisor } from 'src/app/interfaces/Advisor.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ]
})
export class UserFormComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private userService: UserService, 
    private departmentService: DepartmentService, private advisorService: AdvisorService) { }

  departments: Department[] = [];
  selectedRole: string = '';
  selectedDepartmentId: string = '';
  errorMessage: string = '';

  password: string = '';

  user: NewProfile = {
    fullName: '',
    role: '',
    isActive: true,
    phone: "",
    email: "",
  };

  advisor: NewAdvisor = {
    departmentId: '',
    specialty: '',
    profileId: ''
  };


  // AL inicializar el componente
  async ngOnInit() {
    try {
      this.departments = await this.departmentService.getDepartments();
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
    }
  }

  async register() {
    try {
      // 1. Registro en Auth de supabase
      /*const { data, error } = await this.authService.signUp(this.user.email, this.password);
      if (error) {
        console.error('Error en registro auth:', error.message);
        this.errorMessage = error.message;
        return;
      }
*/
      // const userId = data.user?.id;
      const userId = "";
      // 2. Guardar datos en tabla profiles
      this.user.role = this.selectedRole;
      const profile = await this.userService.saveUserData(userId, this.user);

      // 3. Si rol es ADVISOR, guardar en advisors
      if (this.selectedRole === 'ADVISOR') {

        this.advisor.departmentId = this.selectedDepartmentId;
        this.advisor.profileId = profile[0].id;
        const advisor = await this.advisorService.saveAdvisorData(this.advisor);
      }

      // Cerrar el modal y devolver un flag para indicar que se debe recargar
      this.modalCtrl.dismiss({ refresh: true });

    } catch (e: any) {
      console.error('Error guardando datos usuario:', e.message);
    }
  }
  cancel() {
    this.modalCtrl.dismiss(null);
  }



}
