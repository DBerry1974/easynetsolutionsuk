import { isBrochureModalOpen } from "../../lib/stores/modal";

export const RequestABrochureButton = ({
  marginTop = false,
  overrides = "",
}) => (
  <button
    onClick={() => isBrochureModalOpen.set(true)}
    className={`${
      marginTop && "mt-6"
    }  block sm:inline-flex items-center border border-transparent uppercase bg-keld-yellow px-4 sm:px-7 py-4 text-sm sm:text-lg tracking-wider font-bold text-keld-slate shadow-sm hover:bg-yellow-700 hover:text-keld-slate focus:outline-none focus:ring-2 focus:ring-keld-yellow focus:ring-offset-2 ${overrides}`}
  >
    Request A Brochure
  </button>
);
