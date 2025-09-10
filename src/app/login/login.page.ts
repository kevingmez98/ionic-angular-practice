import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authservice.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  constructor(private authService: AuthService, private router: Router) { }

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showAlert = false;


  async onSubmit() {
    this.errorMessage = '';

    try {
      const { data, error } = await this.authService.signIn(this.email, this.password);

      if (error) {
        console.error('Login error:', error.message);
        this.errorMessage = 'Credenciales incorrectas. Por favor, intente de nuevo.';
        this.showAlert = true;
        return;
      }

      if (data?.user) {
        console.log('Usuario autenticado:', data.user);

        // TODO: redirige a la página principal o dashboard
        this.router.navigateByUrl('/users');
      } else {
        this.showAlert = true;
        this.errorMessage = 'No se pudo iniciar sesión. Intenta más tarde.';
      }

    } catch (e) {
      console.error('Error inesperado:', e);
      this.errorMessage = 'Ocurrió un error. Intenta más tarde.';
    }
  }
}
