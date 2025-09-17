import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/shared/components/header/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.page.html',
  styleUrls: ['./provider-detail.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule]
})
export class ProviderDetailPage implements OnInit {



  constructor(private activatedRoute: ActivatedRoute, private router:Router) { }

  providerId: number = 0;

  ngOnInit() {
    // Obtener el ID del proveedor desde la URL
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    if (idParam !== null) {
      this.providerId = +idParam;
      alert("Encontrado " + this.providerId);
    } else {
      // Maneja el caso cuando no hay ID
      // Redirige a la página de edición pasando el ID del proveedor
      this.router.navigate(['/providers', this.providerId]);
    }
  }

}
