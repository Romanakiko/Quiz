export interface Question {
    id: string,
    text: string,
    options: QuestionOption[],
    multiple: boolean
}

export interface QuestionOption {
    text: string,
    
}
