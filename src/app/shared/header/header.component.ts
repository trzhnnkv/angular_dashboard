import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService,) {
  }

  logout() {
    this.authService.logout();
  }
}
