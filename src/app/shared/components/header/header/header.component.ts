import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [IonicModule],
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title: string = 'titulo';

}
