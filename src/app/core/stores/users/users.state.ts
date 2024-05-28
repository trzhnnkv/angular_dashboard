import {Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {AddUser, LoadUsers} from './users.actions';
import {User} from "../../interfaces/user.model";
import {ApiService} from "../../services/api.service";
import {tap} from "rxjs/operators";

export interface UserStateModel {
  users: User[];
  loaded: boolean;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    users: [],
    // TODO для спинера лучше сделать отдельный сервис.
    loaded: false
  }
})
@Injectable()
export class UserState {
  constructor(private apiService: ApiService) {
  }

  @Selector()
  static getUsers(state: UserStateModel) {
    return state.users;
  }

  @Selector()
  static getUserById(state: UserStateModel) {
    return (userId: number) => state.users.find(user => user.id === userId);
  }

  @Selector()
  static isLoaded(state: UserStateModel) {
    return state.loaded;
  }

  @Action(LoadUsers)
  loadUsers(ctx: StateContext<UserStateModel>) {
    const state = ctx.getState();
    // TODO Можно отрефакторить на проверку users
    if (state.loaded) {
      return;
    }
    return this.apiService.getUsers().pipe(
      tap((users) => {
        ctx.patchState({users, loaded: true});
      })
    );
  }

  @Action(AddUser)
  addUser(ctx: StateContext<UserStateModel>, action: AddUser) {
    const state = ctx.getState();
    const newUser: User = {...action.user, id: this.generateId(state.users)};
    const updatedUsers = [...state.users, newUser];
    // TODO Check users operators (ngxs docs)
    ctx.patchState({users: updatedUsers});
    return updatedUsers;
  }

  private generateId(users: User[]): number {
    return users.length + 1;
  }
}
