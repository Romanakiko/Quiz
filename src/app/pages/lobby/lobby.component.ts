import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
  MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Folder} from '../../folder/folder';
import {FolderService} from '../../folder/folder.service';
import {GameService} from '../../game/game.service';

@Component({
  selector: 'app-lobby',
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatSort,
    MatInput,
    MatPaginator,
    MatNoDataRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatFormField,
    MatSortHeader,
    MatHeaderRow,
    MatRow
  ],
  providers: [FolderService, GameService],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent  implements AfterViewInit {
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
