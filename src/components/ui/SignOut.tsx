import { signOut } from "~/auth";

const SignOut = () => {
  return (
    <form
      className="flex  w-full items-center justify-center"
      action={async () => {
        "use server"
        await signOut();
      }}
    >
      <button
        type="submit"
        className="mx-auto w-full rounded-full border-2 border-red-600 px-4 py-3 text-red-600"
      >
        Log out
      </button>
    </form>
  );
};

export default SignOut;
