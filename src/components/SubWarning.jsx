const SubWarning = () => {
  return (
    <div className="my-4 flex flex-col gap-y-2">
      <div className="flex justify-center p-1 text-red-600">
        <p>
          Oops! You already have a sub in your cart, please remove one before
          proceeding through checkout.
        </p>
      </div>
    </div>
  );
};

export default SubWarning;
