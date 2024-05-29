import { Pipe, PipeTransform } from '@angular/core';
import { UserWithDetails} from "../../core/interfaces/user.model";

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {
  transform(users: UserWithDetails[], filterValue: string): UserWithDetails[] {
    if (!filterValue) {
      return users;
    }
    filterValue = filterValue.toLowerCase();

    return users.filter(user => {
      const fullName = `${user.name.firstname} ${user.name.lastname}`.toLowerCase();
      const lastPurchaseDate = user.lastPurchaseDate !== 'No purchases yet'
        ? new Date(user.lastPurchaseDate).toLocaleDateString().toLowerCase()
        : 'no purchases yet';
      const totalPurchases = user.totalPurchases.toString().toLowerCase();

      return fullName.includes(filterValue) ||
        lastPurchaseDate.includes(filterValue) ||
        totalPurchases.includes(filterValue);
    });
  }
}
