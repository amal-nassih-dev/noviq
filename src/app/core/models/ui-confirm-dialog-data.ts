export interface UiConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;   // default: "Delete"
  cancelLabel?: string;    // default: "Cancel"
  danger?: boolean;        // red confirm button
}