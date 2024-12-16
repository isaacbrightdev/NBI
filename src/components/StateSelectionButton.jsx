import PlusCircle from '@/components/svg/PlusCircle';
import useSettings from '@/hooks/useSettings';

const StateSelectionButton = () => {
  const { dispatch } = useSettings();

  const btnClass = [
    'lg:flex-auto',
    'cursor-pointer',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'w-full',
    'border',
    'border-dashed',
    'p-[40px]',
    'rounded-[10px]'
  ];

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-label="Many Credit Options"
        className={[...btnClass].join(' ')}
        onClick={() =>
          dispatch({ type: 'SET_MODAL', data: { name: 'states', state: true } })
        }
      >
        <PlusCircle width={45} height={45} />
        <h4 className="mt-2.5 font-medium">
          Select Your {useSettings().jurisdictionHeading}
        </h4>
      </button>
    </div>
  );
};

StateSelectionButton.propTypes = {};

export default StateSelectionButton;
