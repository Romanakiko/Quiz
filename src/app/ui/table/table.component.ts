import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Folder} from '../../folder/folder';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormField, MatInput, MatLabel]
})
export class TableComponent implements AfterViewInit {
  displayedColumns: string[] = [ 'name', 'progress', 'fruit'];
  dataSource: MatTableDataSource<Folder>;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor() {
    const folders: Folder[] = [];
    this.dataSource = new MatTableDataSource(folders);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
