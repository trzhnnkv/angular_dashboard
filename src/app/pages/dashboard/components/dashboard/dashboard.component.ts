import { Component } from '@angular/core';
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  currentView: string = 'users';

  constructor(private auth: AuthService,) {
  }

  switchView(view: string) {
    this.currentView = view;
  }
}
