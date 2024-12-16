const IconList = () => {
  return (
    <div className="my-6 flex w-full justify-between gap-2 lg:gap-4 lg:px-8">
      {window?.CartSettings?.icons &&
        window.CartSettings.icons.map((icon, i) => {
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2.5">
              <img
                src={icon.image}
                width="25"
                height="25"
                loading="eager"
                alt={icon.text}
              />
              <p className="text-center">{icon.text}</p>
            </div>
          );
        })}
    </div>
  );
};

export default IconList;
