interface ISettingsCogwheel {
  openSettings: () => void;
}

export const SettingsCogwheel = ({ openSettings }: ISettingsCogwheel) => {
  return (
    <img
      className="cursor-pointer"
      onClick={openSettings}
      src="./icon-settings.svg"
      alt="cogwheel"
    />
  );
};
