import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { AuthService } from '@app/auth.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          let allUsers = localStorage.getItem(
            'angular-14-registration-login-example-users'
          );
          console.log('allUsers=', allUsers);
          let user = localStorage.getItem('user');
          console.log('user=', user);
          let user1 = user ? JSON.parse(user) : [];
          console.log('user1=', user1);
          let users = allUsers ? JSON.parse(allUsers) : [];
          console.log('users=', users);
          let currentUser = users.find(
            (userObj: any) => userObj.username === user1.username
          );
          console.log('currentUser=', currentUser);
          let role = currentUser ? currentUser.role : '';
          console.log('role=', role);
          localStorage.setItem('role', role);
          this.authService.recordLoginTime(currentUser);
          this.authService.GetIp().subscribe({
            next: (data) => {
              console.log('IP=', data.ip);
              localStorage.setItem('ip', data.ip);
            },
            error: (error) => {
              console.log(error);
            },
          });
          if (role === 'Auditor') {
            this.authService.isAuditor.next(true);
            this.authService.isUser.next(false);
            this.router.navigate(['/audit']);
          } else if (role === 'User') {
            this.authService.isUser.next(true);
            this.authService.isAuditor.next(false);
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        },
      });
  }
}
