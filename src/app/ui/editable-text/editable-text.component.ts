import {Component, input, OnInit, output, signal} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-editable-text',
    imports: [
        MatIcon,
        MatInput,
        ReactiveFormsModule
    ],
  templateUrl: './editable-text.component.html',
  styleUrl: './editable-text.component.scss'
})
export class EditableTextComponent implements OnInit {
  ngOnInit(): void {
      this.nameFormControl.patchValue(this._value() ?? "");
  }
  _value = input<string | undefined>("", {
    alias: "value"
  });
  value = output<string>();
  isEditable = signal<boolean>(false);
  nameFormControl = new FormControl("");

  enableEdit() {
    this.isEditable.set(true);
    this.nameFormControl.patchValue(this._value() ?? "");
  }

  submitValue() {
    this.value.emit(this.nameFormControl.value ?? "");
    this.isEditable.set(false);
  }
}
