import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";

interface Props {
  list: string[];
  activeItem: string;
  category: string;
  onChange: (item: string) => void;
}

export const Filter: React.FC<Props> = ({
  list,
  activeItem,
  category,
  onChange,
}) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-cobalt bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-cobalt-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-cyanbrand focus-visible:ring-opacity-90 transition">
            <span className="mr-1 text-gray-500">{category}:</span>
            <span
              className={`${
                activeItem === "All"
                  ? "text-cyanbrand font-semibold"
                  : "text-cobalt"
              }`}
            >
              {activeItem}
            </span>
            <ChevronDownIcon
              className="w-4 h-4 ml-2 -mr-1 text-cobalt-light"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-50 absolute left-0 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-xl shadow-brand-card ring-1 ring-cobalt-soft focus:outline-none">
            <div className="px-2 py-1">
              {list.map((item) => (
                <Menu.Item key={item} onClick={() => onChange(item)}>
                  {({ active }) => {
                    return (
                      <button
                        className={`${
                          activeItem === item
                            ? "bg-cyanbrand-soft text-cyanbrand"
                            : "text-gray-900"
                        } font-medium group flex rounded-lg items-center w-full px-3 py-2 text-sm hover:bg-cobalt-soft my-1 transition`}
                      >
                        {item}
                      </button>
                    );
                  }}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
