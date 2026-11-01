"use client";

import { EmailField, Form, FormSubmit, PasswordField, useAuth, useConfig, useTranslation } from "@payloadcms/ui";
import type { FormState } from "payload";
import { email, formatAdminURL, getSafeRedirect } from "payload/shared";
import type { UserWithToken } from "@payloadcms/ui";

const baseClass = "login__form";

export function AdministratorLoginForm({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { config } = useConfig();
  const userSlug = config.admin.user;
  const { setUser } = useAuth();
  const { t } = useTranslation();
  if (!userSlug) return <p>Administrator sign-in is unavailable.</p>;
  const redirectTo = typeof searchParams?.redirect === "string" ? searchParams.redirect : undefined;
  const initialState: FormState = {
    email: { initialValue: undefined, valid: true, value: undefined },
    password: { initialValue: undefined, valid: true, value: undefined },
  };

  return (
    <Form
      action={formatAdminURL({ apiRoute: config.routes.api, path: `/${userSlug}/login` })}
      className={baseClass}
      disableSuccessStatus
      initialState={initialState}
      method="POST"
      onSuccess={(data) => setUser(data as UserWithToken)}
      redirect={getSafeRedirect({ fallbackTo: config.routes.admin, redirectTo: redirectTo ?? config.routes.admin })}
      waitForAutocomplete
    >
      <div className={`${baseClass}__inputWrap`}>
        <EmailField
          field={{
            name: "email",
            admin: { autoComplete: "username" },
            label: t("general:email"),
            required: true,
          }}
          path="email"
          validate={email}
        />
        <PasswordField
          autoComplete="current-password"
          field={{ name: "password", label: t("general:password"), required: true }}
          path="password"
        />
      </div>
      <FormSubmit size="large">{t("authentication:login")}</FormSubmit>
    </Form>
  );
}
