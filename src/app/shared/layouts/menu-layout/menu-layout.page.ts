import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-layout',
  templateUrl: './menu-layout.page.html',
  styleUrls: ['./menu-layout.page.scss'],
  standalone:false
})
export class MenuLayoutPage {

  constructor(private router: Router) { }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
