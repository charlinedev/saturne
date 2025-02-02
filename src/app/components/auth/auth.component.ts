import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthLoginType } from '../../../models/auth-login';
import { AuthRegisterType } from '../../../models/auth-register';
import { AuthToken } from '../../../models/auth-token';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(LoginComponent) login!: LoginComponent;
  @ViewChild(RegisterComponent) register!: RegisterComponent;

  modalForm!: HTMLElement | null;
  modalClose!: HTMLElement | HTMLButtonElement | null;
  wasLoggedIn: boolean = false;

  public subs: Subscription[] = [];

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.modalClose = document.getElementById('modalClose');
    this.modalForm = document.getElementById('authModal');
    this.modalForm?.addEventListener('hide.bs.modal', () => {
      this.login.resetForm();
      this.register.resetForm();
    });
    const sub = this.auth.isLoggedIn$.subscribe({
      next: (value: boolean) => {
        if (value) {
          this.wasLoggedIn = true;
        }
        if (this.wasLoggedIn && !value) {
          this.wasLoggedIn = false;
          confirm('You are logged out.');
        }
      },
    });
    this.subs.push(sub);
  }

  public userLogin(data: AuthLoginType) {
    const sub: Subscription = this.auth.login(data).subscribe({
      next: (response: AuthToken) => {
        this.modalClose?.click();
        if (response.role === 'ADMIN') {
          this.router.navigate(['dashboard']);
        } else if (response.role === 'STAGIAIRE') {
          this.router.navigate(['profile']);
        }
      },
      error: (err: any) => {
        console.error('ERROR: ', err);
      },
    });
    this.subs.push(sub);
  }

  public userRegister(data: AuthRegisterType) {
    const sub: Subscription = this.auth.register(data).subscribe({
      next: () => {
        this.modalClose?.click();
        this.router.navigateByUrl('dashboard');
      },
      error: (err: any) => {
        console.error('ERROR: ', err);
      },
    });
    this.subs.push(sub);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
