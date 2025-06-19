export interface Question {
  id: string,
  text: string,
  image: string,
  weight: number,
  options: QuestionOption[],
  multiple: boolean,
  folder_id: string
}

export interface QuestionOption {
  text: string,
  image: string,
}
