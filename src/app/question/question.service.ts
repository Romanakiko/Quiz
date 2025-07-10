import { Question } from './question';
import {inject, Injectable, resource, signal} from '@angular/core';
import {SupabaseService} from '../supabase/supabase.service';
import {HeaderService} from '../header/header.service';
import {UserService} from '../user/user.service';

@Injectable()
export class QuestionService {

  constructor() {
  }

  private folderId = signal<string | null>(null);
  private _questions = signal<Question[]>([]);
  private supabaseService = inject(SupabaseService);
  private headerService = inject(HeaderService);
  private userService = inject(UserService);

  questions = resource<Question[], {folderId: string | null}>({
    params: () => ({
      folderId: this.folderId()
    }),
    defaultValue: [],
    loader: async (param) => {
      if(param.params.folderId) {
        await this.getQuestionsInFolder(param.params.folderId as string);
      }
      return this._questions();
    }
  })

  // private questions = new Map<string, Question>();
  //
  // public generateQuestion(text: string, options: QuestionOption[], multiple: boolean = false): void {
  //   let id = Math.round(Math.random() * 100000).toString();
  //   this.questions.set(
  //     id,
  //      {
  //       id: id,
  //       options: options,
  //       text: text,
  //       multiple: multiple
  //      } as Question);
  // }
  //
  // public deleteQuestion(id: string): boolean {
  //   return this.questions.delete(id);
  // }
  //
  // public getAllQuestions(): Question[] {
  //   return Array.of(...this.questions.values());
  // }

  private async getQuestionsInFolder(FolderId: string): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { data, error }: { data: Question[] | null; error: any } = await this.supabaseService.getQuestionsInFolder(this.userService.userInfo()?.email ?? '', FolderId);
      if (error) throw error;
      this._questions.set(data ?? []);
    } catch (error) {
      console.log("QuestionsInFolderError=", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

}
