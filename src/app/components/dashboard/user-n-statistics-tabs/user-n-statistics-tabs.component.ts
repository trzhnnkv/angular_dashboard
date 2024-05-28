import {Component} from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-user-n-statistics-tabs',
  templateUrl: './user-n-statistics-tabs.component.html',
})
export class UserNStatisticsTabsComponent {
  selectedIndex: number = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }
}
