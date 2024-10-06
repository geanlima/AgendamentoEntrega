import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";

export class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isFormToutched = !!(form?.touched);
    const isControlInvalid = !!(control && control.invalid);
    const isControlParentInvalid = !!(control && control.parent && control.parent.invalid);

    return (isControlInvalid || isControlParentInvalid) && isFormToutched;
  }
}
