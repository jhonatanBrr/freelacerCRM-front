import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  activeTabId: string = '';
  constructor() { }

  init(tabId: string) {
    this.activeTabId = tabId;
  }

  set activeTab(tabId: string) {
    this.activeTabId = tabId;
  }

  get activeTab(): string {
    return this.activeTabId;
  }
}
