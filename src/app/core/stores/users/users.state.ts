import {Injectable} from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {AddUser, LoadUsers} from './users.actions';
import {User} from "../../interfaces/user.model";
import {ApiService} from "../../services/api.service";
import {tap} from "rxjs/operators";
import { patch, append } from '@ngxs/store/operators';

export interface UserStateModel {
  users: User[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    users: [],
  }
})
@Injectable()
export class UserState {
  constructor(private apiService: ApiService) {
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.users;
  }

  @Selector()
  static userById(state: UserStateModel) {
    return (userId: number) => state.users.find(user => user.id === userId);
  }

  @Action(LoadUsers)
  loadUsers(ctx: StateContext<UserStateModel>) {
    return this.apiService.getUsers().pipe(
      tap((users) => {
        ctx.patchState({users});
      })
    );
  }

  @Action(AddUser)
  addUser(ctx: StateContext<UserStateModel>, action: AddUser) {
    const state = ctx.getState();
    const newUser: User = { ...action.user, id: this.generateId(state.users) };

    ctx.setState(
      patch({
        users: append([newUser])
      })
    );
  }

  private generateId(users: User[]): number {
    return users.length + 1;
  }
}
