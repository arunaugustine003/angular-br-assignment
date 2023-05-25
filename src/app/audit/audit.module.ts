import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuditComponent } from './audit.component';
import { AuditRoutingModule } from './audit-routing.module';
import { MaterialModule } from '@app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuditRoutingModule,
    MaterialModule,
  ],
  declarations: [AuditComponent],
})
export class AuditModule {}
