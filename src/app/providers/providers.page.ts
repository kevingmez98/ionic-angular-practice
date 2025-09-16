import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { ProviderService } from '../services/providers.service';
import { Provider } from '../interfaces/Provider.model';
import { ShowProviderData } from './forms/provider/show-provider-data/showProviderData.component';

@Component({
  selector: 'app-providers',
  standalone: true,
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule]
})
export class ProvidersPage implements OnInit {

  constructor(private modalCtr: ModalController, private providerService: ProviderService,
    private toastCtr: ToastController) { }

  providers: Provider[] = [];

  page = 1;
  pageSize = 4;
  count = 0;
  totalPages = 0;

  selectedType: string | null = null;

  async ngOnInit() {
    await this.loadProviders();
  }


  // Cargar información de profiles
  async loadProviders() {
    try {
      const result = await this.providerService.getExtendedProviderInfo(this.page, this.pageSize);
      this.providers = result.data;
      this.count = result.total;
      this.totalPages = Math.ceil(this.count / this.pageSize);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  }

  /*Controles de navegación de paginación */
  nextPage() {
    this.page++;
    this.loadProviders();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProviders();
    }
  }

  get isLastPage(): boolean {
    return this.page * this.pageSize >= this.count;
  }

  async openProviderModal(isEditMode: boolean, provider?: Provider) {
    const modal = await this.modalCtr.create({
      component:ShowProviderData,
      componentProps: {
        isEditMode: isEditMode,
        existingUser: provider || null
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    // Si se creó un nuevo provider, recargar la lista
    if (data?.refresh) {
      const toast = await this.toastCtr.create({
        message: 'Proveedor creado correctamente',
        duration: 2500,
        position: "top",
      });

      await toast.present();
      this.loadProviders();
    }
  }

  async openInfoModal(provider: Provider) {
    const modal = await this.modalCtr.create({
      component: ShowProviderData,
      componentProps: {
        provider // Pasar el dato al modal
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
  }
}


