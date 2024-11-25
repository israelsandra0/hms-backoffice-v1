import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Check, CheckCircle, CheckCircle2, TriangleAlert } from "lucide-react";
import { RiCheckboxCircleFill } from "@remixicon/react";

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, success, error, action, ...props }) {
        return (
          (<Toast key={id} {...props}>
            {error && <TriangleAlert className="text-red-600"/>}
            {success && <RiCheckboxCircleFill className="text-green-600" />}            
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
