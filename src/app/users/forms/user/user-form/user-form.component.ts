import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/users.service';
import { DepartmentService } from 'src/app/services/departments.service';
import { AdvisorService } from 'src/app/services/advisor.service';
import { Department } from 'src/app/interfaces/Department.model';
import { NewProfile, Profile } from 'src/app/interfaces/Profile.model';
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

  @Input() existingUser: Profile | null = null; // tipo Profile
  @Input() isEditMode: boolean = false;


  departments: Department[] = [];
  selectedRole: string = '';
  selectedDepartmentId: string = '';
  errorMessage: string = '';

  password: string = '';
  private profileId: string = ''; // ID del perfil en caso de que sea actualización
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

      // Verificar si se está editando
      if (this.isEditMode && this.existingUser !== null) {
        const { id, fullName, role, isActive, phone, email } = this.existingUser;
        this.profileId = id;
        this.user = { fullName, role, isActive, phone, email };
        this.selectedRole = role;

        // Si rol es ADVISOR, guardar en advisors
        if (role === 'ADVISOR') {
          const {data, total }= await this.advisorService.getAdvisors(1,1,{"profile_id": id});
          const {departmentId, specialty } = data[0];
          this.advisor.departmentId = departmentId;
          this.selectedDepartmentId = departmentId;
          this.advisor.specialty = specialty;
        }
      }

    } catch (error) {
      console.error('Error al cargar departamentos:', error);
    }
  }

  // Acción para guardar un usuario nuevo o existente
  async save() {
    try {
      this.user.role = this.selectedRole;

      if (this.isEditMode && this.existingUser) {
        // actualizar usuario existente
        this.update();
      } else {
        // Crear un usuario nuevo
        this.register();
      }

      this.modalCtrl.dismiss({ refresh: true });

    } catch (e: any) {
      console.error('Error al guardar usuario:', e.message);
      this.errorMessage = e.message;
    }
  }

  // Metodo de registro
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
  // Metodo de actualización
  async update() {
    if (this.isEditMode && this.existingUser) {
      const updatedProfile = await this.userService.updateUserData(this.existingUser.id, this.user);

      if (this.selectedRole === 'ADVISOR') {
        this.advisor.departmentId = this.selectedDepartmentId;
        this.advisor.profileId = this.existingUser.id;
        await this.advisorService.updateAdvisorData(this.profileId, this.advisor);
      }
    }
  }

}
