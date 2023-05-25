import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
@Component({
  templateUrl: 'audit.component.html',
  styleUrls: ['./audit.component.less'],
})
export class AuditComponent implements OnInit, OnDestroy {
  users?: any[];
  // MatPaginator Inputs
  totalRecordCount = 0;
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];

  // MatPaginator Output
  pageEvent!: PageEvent;
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput
      .split(',')
      .map((str) => +str);
  }
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'loginTime',
    'logoutTime'
  ];
  timeFormat: '12' | '24' = '12'; // Default time format
  dataSource!: MatTableDataSource<any>;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[1]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService
  ) {}
  async ngOnInit(): Promise<void> {
    // if(!this.isAdmin){
    //   this.toastr.warning("User not authorized to view this Page", "Warning");
    //   this.navigateHome();
    // }
    this.getAllUniqueDetails();
  }
  getAllUniqueDetails() {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        this.users = users;
        console.log('Users from Audit Component=', this.users);
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }),
      (error: any) => {
        console.log(error);
      };
  }
  // Method to format time based on selected format
  formatTime(time: string): string {
    const options: Intl.DateTimeFormatOptions = this.timeFormat === '12'
      ? { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }
      : { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

    return new Date(time).toLocaleString('en-GB', options);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteUser(id: string) {
    const user = this.users!.find((x) => x.id === id);
    user.isDeleting = true;
    this.accountService
      .delete(id)
      .pipe(first())
      .subscribe(() => (this.users = this.users!.filter((x) => x.id !== id)));
  }
}
