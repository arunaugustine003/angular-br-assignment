import { Component, DoCheck, OnDestroy } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { Subject } from 'rxjs';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent implements DoCheck,OnDestroy{
  user?: User | null;
  isUser: boolean = false;
  isAuditor: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }
  ngDoCheck(): void {
    let role = localStorage.getItem("role");
    if (role === "Auditor") {
      this.isAuditor = true;
    } else if (role === "User") {
      this.isUser = true;
    }
  }
  logout() {
    this.accountService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
