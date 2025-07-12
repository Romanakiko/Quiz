import {Component, computed, inject, input, linkedSignal, resource} from '@angular/core';
import {EditableTextComponent} from '../../../ui/editable-text/editable-text.component';
import {TableComponent} from '../../../ui/table/table.component';
import {QuestionService} from '../../../question/question.service';
import {FolderService} from '../../../folder/folder.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../user/user.service';
import {IUser} from '../../../user/user';

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
  private folderService = inject(FolderService);
  private questionService = inject(QuestionService);
  private userService = inject(UserService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  folder_id = input<string | null>(null)

  name = resource<string, {id: string | null, email: IUser | null}>({
    defaultValue: '',
    params: (): {id: string | null, email: IUser | null} => ({
      id: this.folder_id(),
      email: this.userService.userInfo()
    }),
    loader: async (param) => {
      if(param.params.id) {
        const folder = await this.folderService.getFolderById(param.params.id);
        this.questionService.setFolder(param.params.id);
        return folder?.name ?? '';
      } else return ''
    }
  });
  questions = computed(() => this.questionService.questions.value());

  async nameChanged(name: string) {
    if(name === '') {
      return
    }
    if(!this.folder_id()) {
      const newFolder = await this.folderService.newFolder(name);
      await this.router.navigate(['../', newFolder?.id], { relativeTo: this.activatedRoute});
    } else {
      const newFolder = await this.folderService.changeName(name, this.folder_id() ?? '');
      this.name.set(newFolder?.name ?? name);
    }
  }

}
