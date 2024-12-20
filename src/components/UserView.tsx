interface IUserView {
  signin: () => void;
  isSignedIn: boolean;
  userName: string | null;
  signout: () => void;
}

export const UserView = ({
  signin,
  isSignedIn,
  userName,
  signout,
}: IUserView) => {
  return (
    <>
      {isSignedIn ? (
        <div className="flex gap-6 text-lg items-center">
          <h1 className="text-white cursor-default">{userName}</h1>
          <img
            className="cursor-pointer"
            onClick={signout}
            src="./signout.svg"
            alt="sign out"
          />
        </div>
      ) : (
        <div className="flex gap-6 text-lg ">
          <p
            className="border p-2 bg-light-purple rounded-md cursor-pointer"
            onClick={signin}
          >
            LogIn With Google
          </p>
        </div>
      )}
    </>
  );
};
