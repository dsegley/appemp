import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup 
  submitted = false

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    ) { 
      this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

  ngOnInit(): void {
    if (this.authService.userValue) {
      this.router.navigate(['/'])
    }
  }

  onSubmit() {
    this.submitted = true

    if (this.form.invalid) {
      return
    }

    let controls = this.form.controls
    this.authService.login(controls.username.value, controls.password.value).pipe(first())
    .subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
        this.router.navigateByUrl(returnUrl)
      },
      error: error => {
        console.error(error)
      }
    })
  }

}
