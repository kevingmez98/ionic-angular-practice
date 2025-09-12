import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/authservice.service';
import { DepartmentService } from 'src/app/services/departments.service';
import { Department } from 'src/app/interfaces/department.model';

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
    private authService: AuthService, private departmentService: DepartmentService) { }

  departments: Department[] = [];

  selectedRole: string = '';
  selectedDepartmentId: string = '';
  errorMessage: string = '';

  user = {
    profile: {
      firstName: '',
      lastName: '',
      role: '',
      status: true,
      idDepartment: ''  // Solo se usará si rol === 'ADVISOR'
    },
    email: '',
    password: '',

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
      const { data, error } = await this.authService.signUp(this.user.email, this.user.password);
      if (error) {
        console.error('Error en registro auth:', error.message);
        this.errorMessage = error.message;
        return;
      }

      // Iniciar sesión inmediatamente después del registro
      const { data: signInData, error: signInError } = await this.authService.signIn(this.user.email, this.user.password);

      const userId = signInData.user?.id;
      if (!userId) {
        console.error('No se obtuvo userId después de registro');
        return;
      }


      // 2. Guardar datos en tabla users
      const profile = await this.userService.saveUserData(userId, {
        first_name: this.user.profile.firstName,
        last_name: this.user.profile.lastName,
        status: this.user.profile.status,
        display_name: `${this.user.profile.firstName} ${this.user.profile.lastName}`,
        role: this.selectedRole,
        user_id: userId
      });

      console.log('Perfil guardado:', profile);

      // 3. Si rol es ADVISOR, guardar en advisors
      /* if (this.selectedRole === 'ADVISOR') {
         const { error: advisorError } = await supabase.from('advisors').insert([{
           profile_id: profileData.id,
           departamento: this.user.departamento
         }]);
       }*/

      // Registro completado
      console.log('Usuario registrado con éxito!');

    } catch (e: any) {
      console.error('Error guardando datos usuario:', e.message);
    }
  }
  cancel() {
    this.modalCtrl.dismiss(null);
  }



}
