import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textarealinebreakpipe'
})
export class TextarealinebreakpipePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/\\n/g, '<br />');
  }

}
