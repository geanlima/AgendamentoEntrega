export class Credencial {
  user: string = '';
  password: string = '';

  public constructor(init?: Partial<Credencial>) {
    if (init) {
      this.user = init.user ?? '';
      this.password = init?.password ?? '';
    }
  }
}
