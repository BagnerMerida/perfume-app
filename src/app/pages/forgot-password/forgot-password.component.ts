import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  username = '';
  loading = false;
  message = '';
  errorMessage = '';

  constructor(
    private authService: AuthService
  ) { }

  sendRecoveryEmail(): void {
    this.message = '';
    this.errorMessage = '';
    if (!this.username) {
      this.errorMessage = 'El usuario es obligatorio';
      return;
    }

    this.loading = true;
    this.authService.forgotPassword({
      username: this.username
    }).subscribe({
      next: response => {
        this.loading = false;
        this.message = response;
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.errorMessage = 'No se pudo enviar el correo de recuperación';
      }
    });
  }
}
