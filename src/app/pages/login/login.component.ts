import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
    MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

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

}
