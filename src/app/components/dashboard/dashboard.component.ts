import {Component} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedIndex: number = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }
}
