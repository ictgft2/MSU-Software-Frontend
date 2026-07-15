import SignInAuthForm from "@src/components/auth-components/SignInAuthForm";
import React, { Suspense } from "react";

function SignIn() {
  return (
    <div>
      <Suspense fallback={<div className="p-5 text-sm text-gray-500">Loading...</div>}>
        <SignInAuthForm />
      </Suspense>
    </div>
  );
}

export default SignIn;
