import {User} from "../../interfaces/user.model";

export class LoadUsers {
  static readonly type = '[User] Load Users';
}

export class AddUser {
  static readonly type = '[User] Add User';
  constructor(public user: User) {
  }
}
