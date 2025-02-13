
import UniversityCard from './UniversityCard';

const UniversitiesList = ({ universities, favorites, onFavoriteClick, onUniversityClick }) => {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Universities ({universities.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {universities.map((college) => (
          <UniversityCard
            key={college.name}
            college={college}
            isFavorite={favorites.includes(college.name)}
            onFavoriteClick={(e) => onFavoriteClick(college.name, e)}
            onClick={() => onUniversityClick(college)}
          />
        ))}
      </div>
    </>
  );
};

export default UniversitiesList;
