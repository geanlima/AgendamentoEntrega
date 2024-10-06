import { AbstractControl } from '@angular/forms';

export function MatchPassword(control: AbstractControl) {
  const password = control['value']['senhaNova'];
  const confirmation = control['value']['confirmacaoSenhaNova'];

  if (password !== confirmation) { return { 'match': false } }

  return null;
}
