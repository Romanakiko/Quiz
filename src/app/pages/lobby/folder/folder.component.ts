import {Component, computed, inject, linkedSignal, signal} from '@angular/core';
import {EditableTextComponent} from '../../../ui/editable-text/editable-text.component';
import {TableComponent} from '../../../ui/table/table.component';
import {QuestionService} from '../../../question/question.service';
import {FolderService} from '../../../folder/folder.service';

@Component({
  selector: 'app-folder',
  imports: [
    EditableTextComponent,
    TableComponent
  ],
  providers: [QuestionService],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {
  folderService = inject(FolderService);
  questionService = inject(QuestionService);

  // name = linkedSignal({
  //   computation: (source, previous) => {
  //
  //   }
  // })
  name = signal<string>('');
  questions = computed(() => this.questionService.questions.value());

  async createFolder(name: string) {
    await this.folderService.newFolder(name);
  }

}
