import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { UserRegister } from 'src/app/shared/models/user';
import { debounce, debounceTime, delay, distinctUntilChanged, finalize, first, map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email],[this.validateEmailNotTaken()]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          "(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$"
        ),
      ],
    ],
  });

  errors: string[] = [];

  onSubmit() {
    this.accountService
      .register(this.registerForm.value as UserRegister)
      .subscribe({
        next: () => this.router.navigateByUrl('/shop'),
        error: (error) => this.errors = error.errors,
        complete: () => console.log('register completed'),
      });
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(
          (value) => {
            return this.accountService.checkEmailExists(value).pipe(
              map(result => result ? {emailExists: true} : null),
              first(),
              finalize(() => control.markAsTouched())
            )
          }
        )
      )
    }
  }
}
