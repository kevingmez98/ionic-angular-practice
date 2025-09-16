
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProviderService } from 'src/app/services/providers.service';
import { Department } from 'src/app/interfaces/Department.model';
import { Advisor } from 'src/app/interfaces/Advisor.model';
import { UserRole } from 'src/app/constants/roles';
import { Profile } from 'src/app/interfaces/Profile.model';
import { AdvisorService } from 'src/app/services/advisor.service';
import { Provider } from 'src/app/interfaces/Provider.model';
import { ProviderCategoryService } from 'src/app/services/providerCategory.service';
import { ProviderCategory } from 'src/app/interfaces/ProviderCategory.model';

@Component({
  selector: 'app-show-data-component',
  templateUrl: './showProviderData.component.html',
  styleUrls: ['./showProviderData.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ]
})
export class ShowProviderData implements OnInit {
  @Input() provider!: Provider;
  constructor(private modalCtrl: ModalController, private providerService: ProviderService,
    private providerCategoryService: ProviderCategoryService
  ) { }

  providerCategory?: ProviderCategory;


  ngOnInit() {
    this.loadData();
  }


  private async loadData() {
    const { data: providerData, total: count } = await this.providerService.getProviders(1, 1);

    if (providerData) {
      this.provider = providerData[0];

      // Ahora cargar el tipo de proveedor
      const dataProviderType = await this.providerCategoryService.getCategories(1, 1,
        { "id": this.provider.providerTypeId });

      this.providerCategory = dataProviderType[0];

    }

  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }


}