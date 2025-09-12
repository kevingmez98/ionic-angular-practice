import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/components/header/header/header.component';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  imports: [HeaderComponent, IonicModule, CommonModule, FormsModule],
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
