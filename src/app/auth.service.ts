import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IpResponseDTO } from './IpResponseDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  IsAuditorLoggedIn() {
    return localStorage.getItem("role") === "Auditor";
  }
  public GetIp() : Observable<IpResponseDTO> {
    return this.http.get<IpResponseDTO>("https://api.ipify.org?format=json");  
  }
}
