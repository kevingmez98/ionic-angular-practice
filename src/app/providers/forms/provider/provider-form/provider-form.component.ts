import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProviderService } from 'src/app/services/providers.service';
import { ProviderCategoryService } from 'src/app/services/providerCategory.service';
import { NewProvider, Provider } from 'src/app/interfaces/Provider.model';
import { ProviderCategory } from 'src/app/interfaces/ProviderCategory.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-form',
  standalone: true,
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
  ]
})
export class ProviderFormComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private providerService: ProviderService,
    private providerCategoryService: ProviderCategoryService, private router: Router
  ) { }

  @Input() existingProvider: Provider | null = null; // tipo Provider
  @Input() isEditMode: boolean = false;

  private providerId: string = ''; // ID del provider en caso de que sea actualización
  selectedCategory: string = '';
  providerCategories: ProviderCategory[] = [];

  errorMessage: string = '';


  provider: NewProvider = {
    bussinesName: '',
    logoUrl: '',
    providerTypeId: '',
    notes: '',
    providerType: undefined,
    isActive: true
  };

  async ngOnInit() {
    try {
      this.providerCategories = await this.providerCategoryService.getCategories();

      // Verificar si se está editando
      if (this.isEditMode && this.existingProvider !== null) {
        const { id, bussinesName, logoUrl, isActive, notes, providerTypeId } = this.existingProvider;
        this.providerId = id;
        this.selectedCategory = providerTypeId;
        this.provider = { bussinesName, logoUrl, isActive, notes, providerTypeId };
      }

    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }


  // Acción para guardar un provider nuevo o existente
  async save() {
    try {
      this.provider.providerTypeId = this.selectedCategory;

      if (this.isEditMode && this.existingProvider) {
        // actualizar provider existente
        this.update();
      } else {
        // Crear un provider nuevo
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
      // Guardar datos en tabla de providers
      this.provider.providerTypeId = this.selectedCategory;
      const provider = await this.providerService.saveProviderData(this.provider);

      // Cerrar el modal y devolver un flag para indicar que se debe recargar
      this.modalCtrl.dismiss({ refresh: true });

    } catch (e: any) {
      console.error('Error guardando datos proveedor:', e.message);
      this.errorMessage = e.message;
    }
  }
  cancel() {
    this.modalCtrl.dismiss(null);
  }

  // Metodo de actualización
  async update() {
    if (this.isEditMode && this.existingProvider) {
      await this.providerService.updateProviderData(this.providerId, this.provider);
    }
  }
  // Redirección a la pagina de edicion
  goToEditPage() {
    // Redirige a la página de edición pasando el ID del proveedor
    this.router.navigate(['/provider',this.providerId]);
    // Cerrar modal
    this.cancel();
  }

}
