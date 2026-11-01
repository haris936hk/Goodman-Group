
import { FieldLabel } from "@payloadcms/ui";
import type { TextFieldLabelServerComponent } from "payload";

// Payload 3.92.1 TextInput uses path IDs, while nested FieldLabel adds an edit-depth suffix.
export const MediaFieldLabel: TextFieldLabelServerComponent = ({ clientField, path }) => {
  const fieldPath = path ?? clientField.name;
  return (
    <FieldLabel
      htmlFor={`field-${fieldPath.replace(/\./g, "__")}`}
      label={clientField.label}
      path={fieldPath}
      required={clientField.required}
    />
  );
};
