import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from "./custom-validators";


describe('CustomValidators', () => {
    it('innerPropertyRequired', () => {
        let formControl1 = new FormControl('checkRequired');
        let formGroup = new FormGroup({ checkRequired: formControl1 });
        let validatorFuntion = CustomValidators.innerPropertyRequired('checkRequired');
        validatorFuntion(formGroup);
        expect(formGroup.valid).toBe(true);
    });
    it('matchingFields', () => {
        let formControl1 = new FormControl('a');
        let formControl2 = new FormControl('b');
        let formGroup = new FormGroup({ a: formControl1, b: formControl2 });
        let validatorFuntion = CustomValidators.matchingFields('a', 'b', 'c');
        validatorFuntion(formGroup);
        expect(formGroup.valid).toBe(true);
    });
    it('lessThan', () => {
        let formControl1 = new FormControl('10');
        let formGroup = new FormGroup({ a: formControl1 });
        let validatorFuntion = CustomValidators.lessThan(1);
        validatorFuntion(formGroup);
        expect(formGroup.valid).toBe(true);
    });
    it('greatThan',()=>{
        let formControl1 = new FormControl('10');
        let formGroup = new FormGroup({ a: formControl1 });
        let validatorFuntion = CustomValidators.greatThan(1);
        validatorFuntion(formGroup);
        expect(formGroup.valid).toBe(true);
    });
    it('noWhitespaceRequired',()=>{
        let formControl1 = new FormControl('a',CustomValidators.noWhitespaceRequired());
        let formGroup = new FormGroup({ a: formControl1 });
        expect(formGroup.valid).toBe(true);
    });
});