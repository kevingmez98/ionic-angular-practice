import { Component } from '@angular/core';

import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule],
  standalone: true,
})
export class HomePage {
  constructor(private navCtrl: NavController) { }

  goToLogin() {
    this.navCtrl.navigateForward('/login');
  }
}

