import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TabsService } from '../../core/services/tabs/tabs.service';

export interface Tab {
  id: string;
  label: string;
}

@Component({
  selector: 'app-tabs-sections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-sections.component.html',
  styleUrl: './tabs-sections.component.scss'
})

export class TabsSectionsComponent {
  @Input() tabs: Tab[] = [];

  constructor(public tabsService: TabsService) { 

  }

  setActiveTab(tabId: string): void {
    this.tabsService.activeTab = tabId;
  }

  isActiveTab(tabId: string): boolean {
    return this.tabsService.activeTab === tabId;
  }
}
