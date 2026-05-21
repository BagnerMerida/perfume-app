import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.css']
})
export class QuantitySelectorComponent {
  @Input() quantity: number = 1;
  @Input() min: number = 1;
  @Input() max: number = 999;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() quantityChange = new EventEmitter<number>();
  @Output() incremented = new EventEmitter<void>();
  @Output() decremented = new EventEmitter<void>();

  get canDecrease(): boolean {
    return this.quantity > this.min;
  }

  get canIncrease(): boolean {
    return this.quantity < this.max;
  }

  decrease(): void {
    if (this.canDecrease) {
      const newQuantity = this.quantity - 1;
      this.quantityChange.emit(newQuantity);
      this.decremented.emit();
    }
  }

  increase(): void {
    if (this.canIncrease) {
      const newQuantity = this.quantity + 1;
      this.quantityChange.emit(newQuantity);
      this.incremented.emit();
    }
  }

  handleChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value >= this.min && value <= this.max) {
      this.quantityChange.emit(value);
    }
  }
}
