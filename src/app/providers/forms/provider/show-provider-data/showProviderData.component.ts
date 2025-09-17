
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProviderService } from 'src/app/services/providers.service';
import { Provider } from 'src/app/interfaces/Provider.model';
import { ProviderCategoryService } from 'src/app/services/providerCategory.service';
import { ProviderCategory } from 'src/app/interfaces/ProviderCategory.model';
import { ProviderContactService } from 'src/app/services/providerContact.service';
import { ProviderContact } from 'src/app/interfaces/providerContact.model';

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
    private providerCategoryService: ProviderCategoryService, private contactService: ProviderContactService
  ) { }

  contacts: ProviderContact[] = [];
  totalContacts: number = 0;

  providerCategory?: ProviderCategory;


  ngOnInit() {
    this.loadData();
  }


  private async loadData() {
    this.loadContacts();

  }

  private async loadContacts() {
    // Traer datos de contactos usando el ID del proveedor
    const { data: provContactData, total: count } = await this.contactService.getContacts(1, 1, { "provider_id": this.provider.id });

    this.contacts = provContactData;
    this.totalContacts = count;
    if (this.provider) {
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