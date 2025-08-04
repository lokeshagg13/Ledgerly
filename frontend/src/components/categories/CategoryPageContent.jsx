import { Button } from "react-bootstrap";
import CategoryControl from "./category-control/CategoryControl";
import CategoryTable from "./category-table/CategoryTable";
import LeftArrowIcon from "../ui/icons/LeftArrowIcon";
import useAppNavigate from "../../store/hooks/useAppNavigate";
import { CategoryProvider } from "../../store/context/categoryContext";

function CategoryPageContent() {
  const { handleNavigateBack } = useAppNavigate();
  
  return (
    <CategoryProvider>
      <div className="category-page-header">
        <Button
          variant="outline-light"
          className="page-back-button"
          onClick={handleNavigateBack}
        >
          <LeftArrowIcon fill="white" width="0.8em" height="0.8em" />
        </Button>
        <h2>Categories</h2>
      </div>

      <div className="category-page-body-wrapper">
        <div className="category-page-body">
          <CategoryControl />
          <CategoryTable />
        </div>
      </div>
    </CategoryProvider>
  );
}

export default CategoryPageContent;
