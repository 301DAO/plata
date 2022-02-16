export interface LoginFormProps {
  errorMessage?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({ errorMessage, onSubmit }: LoginFormProps) => {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-700">Welcome</h2>
          </div>
          <form className="mb-8 space-y-6" onSubmit={onSubmit}>
            <div>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-xl text-gray-800 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="text-l flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Log in / Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
