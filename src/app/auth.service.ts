import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IpResponseDTO } from './IpResponseDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any[] = []; // Array to store user data
  // BehaviorSubject to track changes in user data
  private userDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.userData);
  isAuditor: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
  }
  IsAuditorLoggedIn() {
    return localStorage.getItem('role') === 'Auditor';
  }
  public GetIp(): Observable<IpResponseDTO> {
    return this.http.get<IpResponseDTO>('https://api.ipify.org?format=json');
  }
  // Method to record login time
  recordLoginTime(user: any) {
    const loginTime = new Date().toLocaleString('en-GB', { hour12: false });
    user.loginTime = loginTime;
    this.updateUserData(user);
  }
  // Method to record logout time
  recordLogoutTime(user: any) {
    const logoutTime = new Date().toLocaleString('en-GB', { hour12: false });
    user.logoutTime = logoutTime;
    this.updateUserData(user);
  }
  // Method to update user data
  private updateUserData(user: any) {
    const index = this.userData.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.userData[index] = user;
    } else {
      this.userData.push(user);
    }
    this.userDataSubject.next(this.userData);
  }
  // Method to get user data as an Observable
  getUserData() {
    return this.userDataSubject.asObservable();
  }
}
