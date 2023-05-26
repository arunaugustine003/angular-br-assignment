import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit, DoCheck, OnDestroy {
  user?: User | null;
  isUser: boolean = false;
  isAuditor: boolean = false;
  isAuditor1: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private accountService: AccountService,
    public authService: AuthService
  ) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit() {
  }
  ngDoCheck(): void {
    this.isAuditor1 = this.authService.isAuditor.getValue();
  }
  logout() {
    this.accountService.logout();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
