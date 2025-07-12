import CategoryPageContent from "../../components/categories/CategoryPageContent";
import PageLayout from "../../components/ui/PageLayout";
import categoryImage from "../../images/category-bg.png";

function CategoryPage() {
  return (
    <PageLayout bgImage={categoryImage}>
      <div className="page category-page">
        <CategoryPageContent />
      </div>
    </PageLayout>
  );
}

export default CategoryPage;
