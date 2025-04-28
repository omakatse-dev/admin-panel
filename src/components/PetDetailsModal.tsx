type PetDetail = {
  name: string;
  type: string;
  gender: string;
  breed: string;
  birthdayYear: number;
  birthdayMonth: number;
  size: string;
  allergies: {
    allergies: string[];
    true: boolean;
  };
  preferences: {
    preferences: string[];
    true: boolean;
  };
  treatFrequency: {
    preferences: string[];
    frequency: string;
  };
};

export default function PetDetailsModal({
  setShowModal,
  petDetails,
}: {
  setShowModal: (show: boolean) => void;
  petDetails: string;
}) {
  // Try to parse the pet details as JSON, if it fails, display as plain text
  let parsedDetails: PetDetail[] | string;
  try {
    parsedDetails = JSON.parse(petDetails);
  } catch {
    parsedDetails = petDetails;
  }

  const renderPetDetails = (details: PetDetail) => (
    <div key={details.name} className="mb-6 last:mb-0">
      <h3 className="text-xl font-semibold mb-3 text-blue-400">{details.name}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-gray-400">Type:</span>
          <span className="ml-2">{details.type}</span>
        </div>
        <div>
          <span className="text-gray-400">Gender:</span>
          <span className="ml-2">{details.gender}</span>
        </div>
        <div>
          <span className="text-gray-400">Breed:</span>
          <span className="ml-2">{details.breed}</span>
        </div>
        <div>
          <span className="text-gray-400">Age:</span>
          <span className="ml-2">
            {new Date().getFullYear() - details.birthdayYear} years old
          </span>
        </div>
        <div>
          <span className="text-gray-400">Size:</span>
          <span className="ml-2">{details.size}</span>
        </div>
        {details.allergies.allergies.length > 0 && (
          <div className="col-span-2">
            <span className="text-gray-400">Allergies:</span>
            <div className="ml-2 mt-1 flex flex-wrap gap-2">
              {details.allergies.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-sm"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
        {details.preferences.preferences.length > 0 && (
          <div className="col-span-2">
            <span className="text-gray-400">Preferences:</span>
            <div className="ml-2 mt-1 flex flex-wrap gap-2">
              {details.preferences.preferences.map((pref) => (
                <span
                  key={pref}
                  className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="col-span-2">
          <span className="text-gray-400">Treat Frequency:</span>
          <div className="ml-2 mt-1 flex flex-wrap gap-2">
            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
              {details.treatFrequency.frequency}
            </span>
            {details.treatFrequency.preferences.map((pref) => (
              <span
                key={pref}
                className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setShowModal(false)}
    >
      <div 
        className="bg-gray-800 p-8 rounded-lg w-1/3 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pet Details</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>
        <div className="bg-gray-700 p-6 rounded-md">
          {Array.isArray(parsedDetails) ? (
            parsedDetails.map((pet) => renderPetDetails(pet))
          ) : (
            <div className="whitespace-pre-wrap">{parsedDetails}</div>
          )}
        </div>
      </div>
    </div>
  );
} 