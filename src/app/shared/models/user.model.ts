export interface IUser {
  id?: number,
  name: {
    firstname: string,
    lastname: string,
  },
  username: string,
  email: string,
  phone: string,
  role: string,
  imgSrc?: string,
}

export interface IAuthUser {
  username: string;
  password: string;
}

