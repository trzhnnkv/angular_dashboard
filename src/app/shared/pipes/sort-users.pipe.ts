import { Pipe, PipeTransform } from '@angular/core';
import { UserWithDetails } from "../../core/interfaces/user.model";

@Pipe({
  name: 'sortUsers'
})
export class SortUsersPipe implements PipeTransform {

  transform(users: UserWithDetails[], sortActive: string, sortDirection: string): UserWithDetails[] {
    if (!sortActive || sortDirection === '') {
      return users;
    }

    const isAsc = sortDirection === 'asc';
    return users.slice().sort((a, b) => {
      switch (sortActive) {
        case 'name':
          return this.compareNames(a.name.firstname, b.name.firstname, isAsc);
        case 'date':
          return this.compareDates(a.lastPurchaseDate, b.lastPurchaseDate, isAsc);
        case 'total':
          return this.compare(a.totalPurchases, b.totalPurchases, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private compareNames(a: string, b: string, isAsc: boolean): number {
    return a.localeCompare(b) * (isAsc ? 1 : -1);
  }

  private compareDates(a: string | Date, b: string | Date, isAsc: boolean): number {
    const dateA = a === 'No purchases yet' ? new Date(0) : new Date(a);
    const dateB = b === 'No purchases yet' ? new Date(0) : new Date(b);
    return (dateA < dateB ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
