import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-message',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Mensaje</h4>
    <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Usuario o contraseña incorrectos. UwU</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close()">Cerrar</button>
  </div>
`
})
export class LoginModalMessage {
  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup 
  submitted = false
  loading = false

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
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
    
    this.loading = true
    let controls = this.form.controls
    
    this.authService.login(controls.username.value, controls.password.value).pipe(first())
    .subscribe({
      next: () => {
        this.loading = false
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
        this.router.navigateByUrl(returnUrl)
      },
      error: error => {
        console.error(error)
        this.loading = false
        this.showMessage()
      }
    })
  }

  showMessage() {
    this.modalService.open(LoginModalMessage, {ariaLabelledBy: 'modal-basic-title'})
  }

}
