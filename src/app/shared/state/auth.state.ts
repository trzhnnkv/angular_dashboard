import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

export interface AuthStateModel {
  role: string | null;
}

export class SetRole {
  static readonly type = '[Auth] Set Role';
  constructor(public role: string | null) {}
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    role: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static getRole(state: AuthStateModel): string | null {
    return state.role;
  }

  @Action(SetRole)
  setRole(ctx: StateContext<AuthStateModel>, action: SetRole) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      role: action.role
    });
  }
}
