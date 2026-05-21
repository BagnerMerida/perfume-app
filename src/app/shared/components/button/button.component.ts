import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  host: {
    '[class.app-button-wrapper]': 'true'
  }
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() iconPosition: 'start' | 'end' = 'end';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;
  @Input() isLink: boolean = false;
  @Input() routerLink?: string | any[];
  @Input() href?: string;
  @Input() target?: string;

  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    return [
      'app-button',
      `btn-${this.variant}`,
      `size-${this.size}`,
      this.loading ? 'loading' : '',
      this.fullWidth ? 'full-width' : '',
      this.disabled || this.loading ? 'disabled' : ''
    ].filter(c => c).join(' ');
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}

