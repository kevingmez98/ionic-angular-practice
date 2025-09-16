import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/users.service';
import { DepartmentService } from 'src/app/services/departments.service';
import { Department } from 'src/app/interfaces/Department.model';
import { Advisor } from 'src/app/interfaces/Advisor.model';
import { UserRole } from 'src/app/constants/roles';
import { Profile } from 'src/app/interfaces/Profile.model';
import { AdvisorService } from 'src/app/services/advisor.service';

@Component({
  selector: 'app-showdata',
  templateUrl: './showdata.component.html',
  styleUrls: ['./showdata.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ]
})
export class ShowdataComponent implements OnInit {
  @Input() profile!: Profile;
  public readonly UserRole = UserRole; // exponer el enum de roles al template
  advisor?: Advisor;
  department?: Department;
  constructor(private modalCtrl: ModalController,
    private departmentService: DepartmentService, private advisorService: AdvisorService) { }


  ngOnInit() {

    if (this.profile.role === UserRole.ADVISOR) {
      this.loadAdvisorData();
    }

  }

  private async loadAdvisorData() {
    const { data: advisorData, total: count } = await this.advisorService.getAdvisors(1, 10, { "profile_id": this.profile.id });

    if (advisorData) {
      this.advisor = advisorData[0];

      console.log(advisorData);
      // Ahora cargar el departamento
      const dataDepartment = await this.departmentService.getDepartments(0, 1,
        { "id": this.advisor.departmentId });

      this.department = dataDepartment[0];

    }

  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }

}
