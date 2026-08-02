"use client";

type DeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmMessage?: string;
};

export function DeleteButton({
  action,
  id,
  label = "حذف",
  confirmMessage = "این مورد حذف شود؟ این عمل قابل بازگشت نیست.",
}: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className="inline-flex"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-lipstick-pink/60 px-16 py-8 text-caption text-lipstick-pink transition-colors hover:bg-lipstick-pink/10"
      >
        {label}
      </button>
    </form>
  );
}
