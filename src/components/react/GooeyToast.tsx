import { GoeyToaster, goeyToast } from 'goey-toast';
import 'goey-toast/styles.css';

export function triggerToast(text: string, type: 'info' | 'success' | 'error' = 'info') {
  if (type === 'success') {
    goeyToast.success(text);
  } else if (type === 'error') {
    goeyToast.error(text);
  } else {
    goeyToast(text);
  }
}

export default function GooeyToast() {
  return <GoeyToaster position="bottom-right" />;
}
