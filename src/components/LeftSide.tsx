import FetchCategories from './FetchCategories';

const LeftSideComponent = () => {
  return (
    <div className="h-screen bg-neutral w-1/4 shadow-md">
      <h1 className="text-4xl font-bold text-center mt-6">Naviguez...</h1>
      <div className="divider"></div>
      <FetchCategories />
    </div>
  );
};
export default LeftSideComponent;
