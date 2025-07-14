import { CommonModule } from '@angular/common';
import { Component, Input, Signal, WritableSignal, computed } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-ds-paginator',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './ds-paginator.component.html',
  styleUrl: './ds-paginator.component.scss'
})
export class DsPaginatorComponent {

  @Input() page!: WritableSignal<number>;
  @Input() totalItems!: Signal<number>;
  @Input() itemsPerPage:number = 5;

  totalPages = computed(() => {
    console.log('totalitems', this.totalItems);
    
    if (this.itemsPerPage === 0 || this.totalItems() === 0) return 1;
    return Math.ceil(this.totalItems() / this.itemsPerPage);
  });

  currentPage = computed(() => this.page());

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    
    
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }
    
    return pages;
  });
  
  isSelected(pageNum: number | string): boolean {
    return typeof pageNum === 'number' && pageNum === this.currentPage();
  }

  isEllipsis(pageNum: number | string): boolean {
    return typeof pageNum === 'string' && pageNum === '...';
  }

  handleSelect(pageNum: number | string): void {
    if (typeof pageNum === 'number') {
      this.page.set(pageNum);
    }
  }

  nextPage(): void {
    const current = this.currentPage();
    const total = this.totalPages();
    if (current < total) {
      this.page.set(current + 1);
    }
  }

  backPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.page.set(current - 1);
    }
  }

  canGoNext(): boolean {
    return this.currentPage() < this.totalPages();
  }

  canGoBack(): boolean {
    return this.currentPage() > 1;
  }
}
