import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showSpinner: boolean;
  errorMessage: string;
  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.showSpinner = false;
    this.init();
  }

  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser() {
    this.showSpinner = true;
    this.authService.loginUser(this.loginForm.value).subscribe(
      (response) => {
        this.tokenService.setToken(response.token);
        this.loginForm.reset();
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      (err) => {
        this.showSpinner = false;
        if (err.error.message) {
            this.errorMessage = err.error.message;
          }
      }
    )
  }

}
