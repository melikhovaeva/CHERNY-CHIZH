const enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register',
}

const TITLES: Record<AuthMode, string> = {
  [AuthMode.LOGIN]: 'Войти',
  [AuthMode.REGISTER]: 'Регистрация',
};

export { AuthMode, TITLES };
