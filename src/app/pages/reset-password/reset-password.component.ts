import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  message = '';
  errorMessage = '';

  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService

  ) { }

  ngOnInit(): void {

    this.token = this.route.snapshot.queryParamMap.get('token') || '';

  }

  resetPassword(): void {

    this.message = '';
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Token inválido o ausente';
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Debes ingresar y confirmar la contraseña';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: response => {
        this.loading = false;
        this.message = response;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: error => {
        console.error(error);
        this.loading = false;
        this.errorMessage = 'No se pudo actualizar la contraseña';
      }

    });

  }

}
