import { App } from "antd";

interface ConfirmOptions {
  title: string;
  content?: string;
  okText?: string;
  danger?: boolean;
  onOk: () => void;
}

/**
 * Shared confirm-modal styling. Every confirm dialog in the app routes through
 * here so they look and behave identically — callers only pass what differs
 * (message, button label, danger). Uses the App-context modal so it inherits
 * the ConfigProvider theme.
 */
export function useConfirm() {
  const { modal } = App.useApp();

  return ({
    title,
    content,
    okText = "Confirm",
    danger,
    onOk,
  }: ConfirmOptions) =>
    modal.confirm({
      centered: true,
      title,
      content,
      okText,
      cancelText: "Cancel",
      okButtonProps: danger ? { danger: true } : undefined,
      onOk,
    });
}
