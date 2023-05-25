import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  user: User | null;
  isUser: boolean = false;
  isAuditor: boolean = false;

  constructor(
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
    let role = localStorage.getItem("role");
    if (role === "Auditor") {
      this.isAuditor = true;
    } else if (role === "User") {
      this.isUser = true;
    }
  }

  ngOnInit(): void {
    if (this.isUser) {
      console.log('User is Currently Logged In (True / False) =', this.isUser);
    } else if (this.isAuditor) {
      console.log(
        'Auditor is Currently Logged In (True / False)  =',
        this.isAuditor
      );
    }
  }
}
