import { Component } from '@angular/core';
import {EditableTextComponent} from '../../../ui/editable-text/editable-text.component';
import {TableComponent} from '../../../ui/table/table.component';

@Component({
  selector: 'app-folder',
  imports: [
    EditableTextComponent,
    TableComponent
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

}
