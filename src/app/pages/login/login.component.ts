import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';
  recoveryEmail = '';
  loading = false;
  loadingRecovery = false;
  errorMessage = '';
  recoveryError = '';
  showPassword = false;
  view: 'login' | 'recovery' | 'recovery-sent' = 'login';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    this.errorMessage = '';
    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña son obligatorios';
      return;
    }

    this.loading = true;
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: response => {
        this.authService.saveToken(response.token);
        this.loading = false;
        this.router.navigate(['/admin/products/new']);
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  switchToRecovery(): void {
    this.errorMessage = '';
    this.recoveryError = '';
    this.view = 'recovery';
  }

  backToLogin(): void {
    this.view = 'login';
    this.recoveryEmail = '';
    this.recoveryError = '';
  }

  sendRecovery(): void {
    this.recoveryError = '';
    if (!this.recoveryEmail) {
      this.recoveryError = 'El correo es obligatorio';
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.recoveryEmail)) {
      this.recoveryError = 'Ingresa un correo válido';
      return;
    }

    this.loadingRecovery = true;
    setTimeout(() => {
      this.loadingRecovery = false;
      this.view = 'recovery-sent';
    }, 900);
  }

}
