import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/shared/components/header/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider } from 'src/app/interfaces/Provider.model';
import { ProviderService } from 'src/app/services/providers.service';
import { ProviderCategoryService } from 'src/app/services/providerCategory.service';
import { ProviderCategory } from 'src/app/interfaces/ProviderCategory.model';


@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.page.html',
  styleUrls: ['./provider-detail.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule]
})
export class ProviderDetailPage implements OnInit {



  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private providerService: ProviderService, private categoryService: ProviderCategoryService
  ) { }

  providerId: number = 0;

  provider?: Provider;

  providerType?: ProviderCategory;

  cont: number = 0;

  async ngOnInit() {
    // Obtener el ID del proveedor desde la URL
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    // Traer info de proveedor
    const result = await this.providerService.getProviders(1, 1, { "id": idParam });
    this.provider = result.data[0];
    // Traer info de la categoria del proveedor
    const categoryResult = await this.categoryService.getCategories(1, 1, { "id":1 })
    this.provider.providerType = categoryResult[0].name;


    if (idParam == null && this.provider == null) {
      // Maneja el caso cuando no hay ID
      // Redirige a la página de edición pasando el ID del proveedor
      this.router.navigate(['/providers']);
    }
  }

}
