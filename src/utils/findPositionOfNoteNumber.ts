export default function findPositionOfNoteNumber(number: string): string {
  let position = '';
  switch (number) {
    case '1':
      position = '0-0';
      break;
    case '2':
      position = '0-1';
      break;
    case '3':
      position = '0-2';
      break;
    case '4':
      position = '1-0';
      break;
    case '5':
      position = '1-1';
      break;
    case '6':
      position = '1-2';
      break;
    case '7':
      position = '2-0';
      break;
    case '8':
      position = '2-1';
      break;
    case '9':
      position = '2-2';
      break;
    default:
      break;
  }
  return position;
}
